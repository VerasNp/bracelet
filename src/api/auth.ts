import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import {
  findUserByEmail,
  findUserById,
  updatePassword,
} from '../services/users'
import { generateTokens } from '../common/jwt'
import { hashToken } from '../common/hashToken'
import {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens,
} from '../services/auth'
import { isAuthenticated } from '../middlewares'

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
    const jti = uuidv4()
    const { accessToken, refreshToken } = generateTokens(existingUser, jti)
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    })
    res.json({
      accessToken,
      refreshToken,
    })
  } catch (err) {
    next(err)
  }
})

router.post('/updatePassword', isAuthenticated, async (req, res, next) => {
  try {
    // @ts-ignore
    const { userId } = req.payload
    const { password, newPassword, confirmNewPassword } = req.body
    if (!password || !newPassword || !confirmNewPassword) {
      res.status(400)
      throw new Error(
        "You must provide the old password, the new one and it's confirmation."
      )
    }
    const user = await findUserById(userId)
    if (!user) {
      res.status(500)
      throw new Error('Something went wrong.')
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      res.status(403)
      throw new Error('Invalid password.')
    }
    const confirmedPassword = newPassword === confirmNewPassword
    if (!confirmedPassword) {
      res.status(403)
      throw new Error('Invalid password confirmation.')
    }
    const result = await updatePassword(userId, newPassword)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

router.post('/refreshToken', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400)
      throw new Error('Missing refresh token.')
    }
    const payload = jwt.verify(
      refreshToken,
      `${process.env.JWT_REFRESH_SECRET}`
    )
    // @ts-ignore
    const savedRefreshToken = await findRefreshTokenById(payload.jti)
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401)
      throw new Error('Unauthorized')
    }
    const hashedToken = hashToken(refreshToken)
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401)
      throw new Error('Unauthorized')
    }
    // @ts-ignore
    const user = await findUserById(payload.userId)
    if (!user) {
      res.status(401)
      throw new Error('Unauthorized')
    }
    await deleteRefreshToken(savedRefreshToken.id)
    const jti = uuidv4()
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    )
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    })
    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (err) {
    next(err)
  }
})

// @ts-ignore
router.get('/logout', isAuthenticated, async (req, res, next) => {
  try {
    // @ts-ignore
    const { userId } = req.payload
    await revokeTokens(userId)
    res.status(200).send({})
  } catch (err) {
    next(err)
  }
})

export default router
