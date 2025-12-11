import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { postsRoutes } from './routes/posts.js'
import { typeDefs, resolvers } from './graphql/index.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { optionalAuth } from './middleware/jwt.js'
import { likeRoutes } from './routes/likes.js'
const app = express()
app.use(cors())
app.use(bodyParser.json())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth }
      },
    }),
  ),
)

userRoutes(app)
eventRoutes(app)
postsRoutes(app)
likeRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello World from Express!')
})

export { app }
