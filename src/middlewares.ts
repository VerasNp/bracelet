import { NextFunction, Request, Response } from 'express'
import Bracelet from './common/Bracelet'
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
    // 1 - Eai, vamos
    // TODO: Tornar a lib mais lib???
    // Assim, essa func pode deixar de existir e o próprio
    // Bracelet é o middle. veja exemplo em @/app.ts
    const userAgent = req.get('user-agent')!
    const remoteAddr = req.socket.remoteAddress!
    const token = authorization.split(' ')[1]
    const readableBracelet = Bracelet.read(token)
    Bracelet.verify(readableBracelet, userAgent, remoteAddr)
    // @ts-ignore
    req.bracelet = Bracelet.remake(readableBracelet, userAgent, remoteAddr)
  } catch (err: any) {
    res.status(401)
    throw new Error('🚫 Un-Authorized 🚫')
  }
  return next()
}
