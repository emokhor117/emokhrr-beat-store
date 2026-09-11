import { Router } from 'express'

import {
  requireAdmin,
} from '../middleware/admin-auth.middleware.js'

import {
  upsertBeatLicensesController,
} from '../controllers/admin-beat-license.controller.js'

const router = Router()

router.put(
  '/admin/beats/:beatId/licenses',
  requireAdmin,
  upsertBeatLicensesController
)

export default router