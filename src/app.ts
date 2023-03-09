import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import * as middlewares from './middlewares'
import api from './api'

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use('/', api)
app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
