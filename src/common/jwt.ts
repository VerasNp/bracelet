import jwt from 'jsonwebtoken'

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { userId: user.id, admin: user.admin },
    `${process.env.JWT_ACCESS_SECRET}`,
    {
      expiresIn: '255m',
    }
  )
}

export const generateRefreshToken = (user: any, jti: any) => {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    `${process.env.JWT_REFRESH_SECRET}`,
    {
      expiresIn: '24h',
    }
  )
}

export const generateTokens = (user: any, jti: any) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user, jti)
  return {
    accessToken,
    refreshToken,
  }
}
