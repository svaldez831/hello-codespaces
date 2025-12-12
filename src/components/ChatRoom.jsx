import { useChat } from '../hooks/useChat.js'
import { EnterMessage } from './EnterMessage.jsx'
import { ChatMessage } from './ChatMessage.jsx'

export function ChatRoom() {
  const { messages, currentRoom, sendMessage } = useChat()
  return (
    <div>
      <h3>Welcome to {currentRoom}:</h3>

      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}
      <EnterMessage onSend={sendMessage} />
    </div>
  )
}
