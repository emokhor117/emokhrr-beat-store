import { Router } from 'express'

import {
  getDownloadController,
} from '../controllers/download.controller.js'

const router = Router()

router.get(
  '/downloads/:grantId',
  getDownloadController
)

export default router