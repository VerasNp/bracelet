import express from 'express'
import auth from './auth'
import users from './users'

const router = express.Router()

// Sanity check
router.get('/coffee', (req, res) => {
  res.status(418)
  throw new Error('🤖 - Coffee not supported')
})

router.use('/auth', auth)
router.use('/users', users)

export default router
