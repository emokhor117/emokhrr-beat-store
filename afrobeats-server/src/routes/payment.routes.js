import { Router } from 'express'

import {
  initializePayment,
  handlePaystackWebhook,
} from '../controllers/payment.controller.js'

const router = Router()

router.post(
  '/paystack/initialize',
  initializePayment
)

router.post(
  '/paystack/webhook',
  handlePaystackWebhook
)

export default router