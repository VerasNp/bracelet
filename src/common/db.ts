import { PrismaClient } from '@prisma/client'

declare global {
  var db: PrismaClient | undefined
}

export const db =
  global.db ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn', 'info']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') global.db = db
