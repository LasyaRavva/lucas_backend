require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()


app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const lessonsRoutes = require('./routes/lessons')
app.use('/api/lessons', lessonsRoutes)
app.use('/api/lesson', lessonsRoutes)

const flashcardsRoutes = require('./routes/flashcards')
app.use('/api/flashcards', flashcardsRoutes)

const quizzesRoutes = require('./routes/quizzes')
app.use('/api/quizzes', quizzesRoutes)

const usersRoutes = require('./routes/users')
app.use('/api/users', usersRoutes)
const conversationRoutes = require('./routes/conversation')
app.use('/api/conversations', conversationRoutes)
app.use('/api/conversation', conversationRoutes)
// TODO: Add routes
app.get('/api', (req, res) => {
  res.json({ message: 'API running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
