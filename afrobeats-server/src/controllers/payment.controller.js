import crypto from 'node:crypto'

import {
  initializePaymentSchema,
} from '../validators/payment.validator.js'

import {
  initializePaystackPayment,
  processPaystackWebhook,
} from '../services/paystack.service.js'

export async function initializePayment(req, res) {
  const validation =
    initializePaymentSchema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message:
        'Invalid payment initialization request',
    })
  }

  try {
    const payment =
      await initializePaystackPayment(
        validation.data.orderNumber
      )

    return res.status(200).json({
      success: true,

      payment: {
        orderNumber: payment.orderNumber,
        reference: payment.reference,
        authorizationUrl:
          payment.authorizationUrl,
        accessCode: payment.accessCode,
        amountKobo: payment.amountKobo,
        totalNGN: payment.amountKobo / 100,
        currency: payment.currency,
      },
    })
  } catch (error) {
    if (error.message === 'ORDER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (error.message === 'ORDER_NOT_PAYABLE') {
      return res.status(409).json({
        success: false,
        message:
          'This order cannot currently be paid',
      })
    }

    if (
      error.message ===
      'PAYSTACK_NOT_CONFIGURED'
    ) {
      return res.status(500).json({
        success: false,
        message:
          'Payment provider is not configured',
      })
    }

    if (
      error.message ===
      'PAYSTACK_INITIALIZATION_FAILED'
    ) {
      return res.status(502).json({
        success: false,
        message:
          'Unable to initialize payment',
      })
    }

    throw error
  }
}

export async function handlePaystackWebhook(
  req,
  res
) {
  const secretKey =
    process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    return res.sendStatus(500)
  }

  const signature =
    req.headers['x-paystack-signature']

  console.log(
    'Signature present:',
    Boolean(signature)
  )

  if (
    !signature ||
    typeof signature !== 'string'
  ) {
    return res.sendStatus(401)
  }

  const expectedSignature = crypto
    .createHmac('sha512', secretKey)
    .update(JSON.stringify(req.body))
    .digest('hex')

  /*
    Use timingSafeEqual rather than a normal ===
    comparison for cryptographic signatures.
  */
  const suppliedBuffer =
    Buffer.from(signature, 'hex')

  const expectedBuffer =
    Buffer.from(expectedSignature, 'hex')

  if (
    suppliedBuffer.length !==
      expectedBuffer.length ||
    !crypto.timingSafeEqual(
      suppliedBuffer,
      expectedBuffer
    )
  ) {
    return res.sendStatus(401)
  }

  /*
    Acknowledge events we don't care about.
  */
  if (req.body?.event !== 'charge.success') {
    return res.sendStatus(200)
  }

  try {
    await processPaystackWebhook(req.body)

    console.log(
  'Processing Paystack reference:',
  reference
)

    return res.sendStatus(200)
  } catch (error) {
    console.error(
      'Paystack webhook processing failed:',
      error
    )

    /*
      We return 500 here so Paystack knows
      processing did not complete successfully
      and can retry the webhook.
    */
    return res.sendStatus(500)
  }
}