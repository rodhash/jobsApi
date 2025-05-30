
import express from 'express'
import dotenv from 'dotenv'
import { server } from './server'
import { errorHandler } from './middleware/error-handler'
import { notFound } from './middleware/not-found'
import { authRouter } from './routes/auth'
import { jobsRouter } from './routes/jobs'
import { authMW } from './middleware/authentication'
import helmet, { xssFilter } from 'helmet'
import cors from 'cors'
import rateLimiter from 'express-rate-limit'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

const app = express()
dotenv.config()
const swaggerDocument = YAML.load('./swagger.yaml')

// Middleware
app.use(express.json() )

// Security MW
// app.use(xss()) // deprecated?
app.use(helmet())
app.use(cors())

// app.set('trust proxy', 1) // deprecated?
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 100,
}))

// routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMW, jobsRouter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.get('/', (req, res) => {
  res.send(' <h1>Jobs API</h1> <a href="/api-docs">API Documentation</a> ')
})

server(app)

// Error handler
app.use(errorHandler)
app.use(notFound)

