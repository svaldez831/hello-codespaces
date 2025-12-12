// src/hooks/useChat.js (or wherever you keep it)
import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketIOContext.jsx'

export function useChat() {
  const { socket } = useSocket()
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [currentRoom, setCurrentRoom] = useState('public')

  // helper to append a message
  function receiveMessage(message) {
    setMessages((prev) => [...prev, message])
  }

  // listen for events from server
  useEffect(() => {
    if (!socket) return

    const handleUsers = (userList) => {
      // userList: [{ socketId, username }]
      setUsers(userList)
    }

    socket.on('chat.users', handleUsers)
    socket.on('chat.message', receiveMessage)

    // on first connect (or when socket changes), load history for current room
    ;(async () => {
      try {
        const history = await socket.emitWithAck('chat.history')
        // history: array of { room, username, message, replayed: true }
        setMessages(history)
      } catch (err) {
        console.error('Failed to load chat history:', err)
      }
    })()

    return () => {
      socket.off('chat.users', handleUsers)
      socket.off('chat.message', receiveMessage)
    }
  }, [socket])

  // change room helper, used by /join
  async function changeRoom(newRoom) {
    if (!socket) return
    if (!newRoom || newRoom === currentRoom) return

    // clear current view while switching
    setMessages([])
    setUsers([])

    try {
      const result = await socket.emitWithAck('chat.changeRoom', newRoom)

      if (!result?.success) {
        receiveMessage({
          message: `Failed to join room "${newRoom}".`,
        })
        return
      }

      setCurrentRoom(result.room ?? newRoom)

      // fetch history for the new room
      const history = await socket.emitWithAck('chat.history')
      setMessages(history)
    } catch (err) {
      console.error('Error changing room:', err)
      receiveMessage({
        message: `Error joining room "${newRoom}".`,
      })
    }
  }

  // send message or execute slash commands
  async function sendMessage(message) {
    if (!socket) return
    if (!message || !message.trim()) return

    if (message.startsWith('/')) {
      const [rawCommand, ...args] = message.slice(1).split(/\s+/)
      const command = rawCommand.toLowerCase()

      switch (command) {
        case 'clear':
          setMessages([])
          break

        case 'rooms': {
          const userInfo = await socket.emitWithAck('user.info', socket.id)
          const rooms =
            userInfo?.rooms?.filter((room) => room !== socket.id) ?? []
          receiveMessage({
            message:
              rooms.length > 0
                ? `You are in: ${rooms.join(', ')}`
                : 'You are not in any rooms.',
          })
          break
        }

        case 'join': {
          const newRoom = args[0]
          if (!newRoom) {
            receiveMessage({
              message: 'Usage: /join <roomName>',
            })
            break
          }
          await changeRoom(newRoom)
          break
        }

        default:
          receiveMessage({
            message: `Unknown command: /${command}`,
          })
          break
      }
    } else {
      // normal chat message
      socket.emit('chat.message', message)
    }
  }

  return {
    messages,
    users,
    currentRoom,
    sendMessage,
    changeRoom, // in case you want buttons/UI to change rooms too
  }
}
