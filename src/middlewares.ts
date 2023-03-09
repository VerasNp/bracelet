import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import ErrorResponse from './interfaces/ErrorResponse'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
}

export const isAuthenticated = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const { authorization } = req.headers
  if (!authorization) {
    res.status(401)
    throw new Error('🚫 Un-Authorized 🚫')
  }
  try {
    const token = authorization.split(' ')[1]
    const payload = jwt.verify(token, `${process.env.JWT_ACCESS_SECRET}`)
    // @ts-ignore
    req.payload = payload
  } catch (err: any) {
    res.status(401)
    if (err.name === 'TokenExpiredError') {
      throw new Error(err.name)
    }
    throw new Error('🚫 Un-Authorized 🚫')
  }
  return next()
}
