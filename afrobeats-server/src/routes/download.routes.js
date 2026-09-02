import { Router } from 'express'

import {
  getOrderDownloadsController,
} from '../controllers/download.controller.js'

const router = Router()

router.get(
  '/orders/:orderNumber/downloads',
  getOrderDownloadsController
)

export default router