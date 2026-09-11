import { Router } from 'express'

import {
  requireAdmin,
} from '../middleware/admin-auth.middleware.js'

import {
  createBeatController,
  updateBeatController,
  listAdminBeatsController,
} from '../controllers/admin-beat.controller.js'

const router = Router()

router.get(
  '/admin/beats',
  requireAdmin,
  listAdminBeatsController
)

router.post(
  '/admin/beats',
  requireAdmin,
  createBeatController
)

router.patch(
  '/admin/beats/:beatId',
  requireAdmin,
  updateBeatController
)

export default router