import { Router } from 'express'
import {
  requireAdmin,
} from '../middleware/admin-auth.middleware.js'

import {
  uploadBeatAsset,
} from '../middleware/upload.middleware.js'

import {
  uploadBeatAssetController,
} from '../controllers/beat-asset.controller.js'


const router = Router()

router.post(
  '/admin/beats/:beatId/assets',
  requireAdmin,
  uploadBeatAsset,
  uploadBeatAssetController
)

export default router