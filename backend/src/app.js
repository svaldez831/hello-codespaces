import express from 'express'
import { recipeRoutes } from './routes/recipes.js'
import { userRoutes } from './routes/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(bodyParser.json())
app.use(cors())

recipeRoutes(app)
userRoutes(app)

app.get('/', (req, res) => {
  res.send('Recipe Back-End !')
})

export { app }
