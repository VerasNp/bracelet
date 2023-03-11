import express from 'express'
import bcrypt from 'bcrypt'
import {
  findUserByEmail
} from '../services/users'
import { isAuthenticated } from '../middlewares'
import Bracelet from '../common/Bracelet'

const router = express.Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400)
      throw new Error('You must provide an email and a password.')
    }
    const existingUser = await findUserByEmail(email)
    if (!existingUser) {
      res.status(403)
      throw new Error('Invalid login credentials.')
    }
    const validPassword = await bcrypt.compare(password, existingUser.password)
    if (!validPassword) {
      res.status(403)
      throw new Error('Invalid login credentials.')
    }
    if (!existingUser.active) {
      res.status(403)
      throw new Error('Invalid login credentials.')
    }
    const userAgent = req.get("user-agent")!
    const remoteAddr = req.socket.remoteAddress!
    const bracelet = Bracelet.make(existingUser.id, userAgent, remoteAddr)
    res.json({
      bracelet
    })
  } catch (err) {
    next(err)
  }
})


// @ts-ignore
router.get('/logout', isAuthenticated, async (req, res, next) => {
  try {
    // @ts-ignore
    Bracelet.castOut(req.bracelet)
    res.status(200).send({})
  } catch (err) {
    next(err)
  }
})

export default router
