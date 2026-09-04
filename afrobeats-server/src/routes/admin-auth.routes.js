import { Router } from 'express'

import {
  adminLoginController,
} from '../controllers/admin-auth.controller.js'

const router = Router()

router.post(
  '/admin/auth/login',
  adminLoginController
)

export default router