import express from 'express'
import slugify from 'slugify'
import { isAuthenticated } from '../middlewares'
import {
  createUser,
  findUserBySlug,
  findAllUsers,
  findUserByEmail,
  updateUser,
  deleteUser,
  toggleActive,
} from '../services/users'

const router = express.Router()

// 3 - Aqui poderíamos ter
// router.get('/', bracelet, async (req, res, next) => {

// e prontu. [começa a ler em @/middlewares.ts ]

router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const users = await findAllUsers()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:slug', isAuthenticated, async (req, res, next) => {
  try {
    const { slug } = req.params
    const user = await findUserBySlug(slug)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const { email, password, name, avatar, role, video, bio, active } = req.body
    if (!email || !password || !name) {
      res.status(400)
      throw new Error('You must provide an email, a name and a password.')
    }
    const existingEmail = await findUserByEmail(email)
    if (existingEmail) {
      res.status(400)
      throw new Error('Email already in use.')
    }
    const slug = slugify(name, { lower: true })
    const existingSlug = await findUserBySlug(slug)
    if (existingSlug) {
      res.status(400)
      throw new Error(
        "A user with the exactly same name already exists in the database. Check if it's active."
      )
    }
    const user = await createUser({
      email,
      password,
      name,
      avatar,
      role,
      video,
      bio,
      active,
    })
    res.json({ success: true, userId: user.id })
  } catch (err) {
    next(err)
  }
})

router.put('/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params
    const { email, name, avatar, video, bio, active, role } = req.body
    const user = await updateUser(userId, {
      email,
      name,
      avatar,
      role,
      video,
      bio,
      active,
    })
    res.json({ success: true, userId: user.id })
  } catch (err) {
    next(err)
  }
})

router.get('/:userId/toggle', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params
    const toggledProject = await toggleActive(userId)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

router.delete('/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await deleteUser(userId)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
