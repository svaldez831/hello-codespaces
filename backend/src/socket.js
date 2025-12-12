export function handleSocket(io) {
  io.on('connection', (socket) => {
    console.log('user connected:', socket.id)
    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id)
    })
    socket.on('chat.message', (message) => {
      console.log(`${socket.id}: ${message}`)
      io.emit('chat.message', {
        username: socket.id,
        message,
      })
    })
  })
}
