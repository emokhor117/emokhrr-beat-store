import { Router } from 'express'

import {
  uploadBeatAssetController,
} from '../controllers/beat-asset.controller.js'

import {
  uploadBeatAsset,
} from '../middleware/upload.middleware.js'

const router = Router()

router.post(
  '/beats/:publicId/assets',
  uploadBeatAsset,
  uploadBeatAssetController
)

export default router