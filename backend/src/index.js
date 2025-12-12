import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import { Server } from 'socket.io'

import { initDatabase } from './db/init.js'
import { app } from './app.js'
import { handleSocket } from './socket.js'

const PORT = process.env.PORT || 3001

await initDatabase()

// 1) Create an HTTP server from the Express app
const server = http.createServer(app)

// 2) Create Socket.IO server on top of that HTTP server
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, /https:\/\/.*\.app\.github\.dev$/],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// 3) Make io accessible in routes (for post-created alerts later)
app.set('io', io)

// 4) Register all socket event handlers
handleSocket(io)

// 5) Start the combined HTTP + WebSocket server
server.listen(PORT, '0.0.0.0', () => {
  console.info(`express + socket.io running on http://localhost:${PORT}`)
})
