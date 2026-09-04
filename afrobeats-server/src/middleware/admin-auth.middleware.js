import jwt from 'jsonwebtoken'

const { ADMIN_JWT_SECRET } = process.env

if (!ADMIN_JWT_SECRET) {
  throw new Error(
    'ADMIN_JWT_SECRET is not configured'
  )
}

export function requireAdmin(req, res, next) {
  try {
    const authorization =
      req.get('authorization')

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required',
      })
    }

    const token =
      authorization.slice(7).trim()

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required',
      })
    }

    const payload = jwt.verify(
      token,
      ADMIN_JWT_SECRET,
      {
        issuer: 'emokhrr-beats',
        audience: 'emokhrr-admin',
      }
    )

    if (payload.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      })
    }

    req.admin = {
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid or expired admin token',
      })
    }

    console.error(
      'Admin authorization failed:',
      {
        name: error.name,
        message: error.message,
      }
    )

    return res.status(500).json({
      success: false,
      message:
        'Admin authorization failed',
    })
  }
}