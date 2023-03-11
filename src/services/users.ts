import bcrypt from 'bcrypt'
import slugify from 'slugify'
import { db } from '../common/db'

export const createUser = (user: any) => {
  user.password = bcrypt.hashSync(user.password, 12)
  user.slug = slugify(user.name, { lower: true })
  user.firstName = user.name.split(' ')[0]
  return db.user.create({
    data: user,
  })
}

export const findAllUsers = () => {
  return db.user.findMany({
    where: { active: true},
    select: {
      id: true,
      slug: true,
      name: true,
      avatar: true,
      role: true,
    },
  })
}

export const findUserByEmail = (email: any) => {
  return db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
      active: true,
    },
  })
}

export const findUserById = (id: string) => {
  return db.user.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      password: true,
      active: true,
    },
  })
}

export const findUserBySlug = (slug: string) => {
  return db.user.findFirst({
    where: {
      slug,
      active: true,
    },
    select: {
      id: true,
      email: true,
      slug: true,
      name: true,
      avatar: true,
      role: true,
      video: true,
      bio: true,
    }
  })
}

export const updateUser = (id: string, userData: any) => {
  userData.password
    ? (userData.password = bcrypt.hashSync(userData.password, 12))
    : null
  userData.name
    ? ((userData.slug = slugify(userData.name, { lower: true })),
      (userData.firstName = userData.name.split(' ')[0]))
    : null
  return db.user.update({ where: { id }, data: userData })
}

export const updatePassword = (id: string, newPassword: string) => {
  const password = bcrypt.hashSync(newPassword, 12)
  return db.user.update({ where: { id }, data: { password } })
}

export const toggleActive = async (id: string) => {
  const user = await db.user.findFirst({
    where: { id: id },
    select: { active: true },
  })
  return db.user.update({
    where: { id },
    data: { active: !user?.active },
  })
}

export const deleteUser = (id: string) => {
  return db.user.delete({ where: { id } })
}
