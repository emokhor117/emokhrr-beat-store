import {
  authenticateAdmin,
} from '../services/admin-auth.service.js'

export async function adminLoginController(
  req,
  res
) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Email and password are required',
      })
    }

    const auth = await authenticateAdmin({
      email,
      password,
    })

    return res.status(200).json({
      success: true,
      token: auth.token,
      expiresIn: auth.expiresIn,
    })
  } catch (error) {
    if (
      error.message ===
      'INVALID_ADMIN_CREDENTIALS'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    console.error('Admin login failed:', {
      name: error.name,
      message: error.message,
    })

    return res.status(500).json({
      success: false,
      message: 'Admin login failed',
    })
  }
}