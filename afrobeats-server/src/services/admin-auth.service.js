import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH,
  ADMIN_JWT_SECRET,
} = process.env

if (
  !ADMIN_EMAIL ||
  !ADMIN_PASSWORD_HASH ||
  !ADMIN_JWT_SECRET
) {
  throw new Error(
    'Admin authentication environment variables are not fully configured'
  )
}

export async function authenticateAdmin({
  email,
  password,
}) {
  const normalizedEmail =
    email.trim().toLowerCase()

  const expectedEmail =
    ADMIN_EMAIL.trim().toLowerCase()

  if (normalizedEmail !== expectedEmail) {
    throw new Error('INVALID_ADMIN_CREDENTIALS')
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      ADMIN_PASSWORD_HASH
    )

  if (!passwordMatches) {
    throw new Error('INVALID_ADMIN_CREDENTIALS')
  }

  const token = jwt.sign(
    {
      role: 'ADMIN',
      email: expectedEmail,
    },
    ADMIN_JWT_SECRET,
    {
      expiresIn: '2h',
      issuer: 'emokhrr-beats',
      audience: 'emokhrr-admin',
    }
  )

  return {
    token,
    expiresIn: 7200,
  }
}