import express from 'express'
import cors from 'cors'
import connectDB from './db/connection.js'
import blogsRouter from './controllers/blogs.js'
import middleware from './utils/middleware.js'

connectDB()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
