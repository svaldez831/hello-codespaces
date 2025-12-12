// src/socket.js
import jwt from 'jsonwebtoken'
import { getUserInfoById } from './services/users.js'
import {
  joinRoom,
  sendPublicMessage,
  getUserInfoBySocketId,
  getUsersInRoom,
  sendSystemMessage,
} from './services/chat.js'
import { getMessagesByRoom } from './services/messages.js'

export function handleSocket(io) {
  // -----------------------------
  // Auth Middleware
  // -----------------------------
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      return next(new Error('Authentication failed: no token provided'))
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return next(new Error('Authentication failed: invalid token'))
      }

      socket.auth = decodedToken
      socket.user = await getUserInfoById(decodedToken.sub)
      return next()
    })
  })

  // -----------------------------
  // Connection Handler
  // -----------------------------
  io.on('connection', async (socket) => {
    console.log('Socket connected:', socket.id, 'user:', socket.user?.username)

    // Initial room
    let room = socket.handshake.query?.room ?? 'public'

    // Join room / send system message
    await joinRoom(io, socket, { room })
    console.log(`${socket.id} joined room: ${room}`)

    // Send list of users already in this room
    const usersInRoom = await getUsersInRoom(io, room)
    socket.emit('chat.users', usersInRoom)

    // -----------------------------
    // Switch Rooms
    // -----------------------------
    socket.on('chat.changeRoom', async (newRoom, callback) => {
      try {
        const oldRoom = room

        // Leave old room
        socket.leave(oldRoom)
        sendSystemMessage(io, {
          room: oldRoom,
          message: `${socket.user.username} left the room.`,
        })

        // Join new room
        room = newRoom
        await joinRoom(io, socket, { room })

        // Updated user lists
        const updatedUsers = await getUsersInRoom(io, room)
        socket.emit('chat.users', updatedUsers)

        // Optional ack
        if (typeof callback === 'function') {
          callback({ success: true, room })
        }

        console.log(`${socket.user.username} switched to room: ${room}`)
      } catch (error) {
        console.error('Error switching rooms:', error)
        if (typeof callback === 'function') {
          callback({ success: false })
        }
      }
    })

    // -----------------------------
    // Chat History Handler
    // -----------------------------
    socket.on('chat.history', async (callback) => {
      const messages = await getMessagesByRoom(room)
      const payloads = messages.map(({ username, message }) => ({
        room,
        username,
        message,
        replayed: true,
      }))

      if (typeof callback === 'function') {
        callback(payloads)
      }
    })

    // -----------------------------
    // Live Chat Messages
    // -----------------------------
    socket.on('chat.message', async (message) => {
      if (!message || typeof message !== 'string') return

      sendPublicMessage(io, {
        username: socket.user.username,
        room,
        message,
      })
    })

    // -----------------------------
    // User Info (for /rooms command)
    // -----------------------------
    socket.on('user.info', async (socketId, callback) => {
      const info = await getUserInfoBySocketId(io, socketId)
      callback(info)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)
    })
  })
}
