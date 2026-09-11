import {
  checkoutSchema,
} from '../validators/checkout.validator.js'

import {
  createPendingOrder,
} from '../services/checkout.service.js'

export async function createCheckout(req, res) {
  const validation = checkoutSchema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid checkout request',
    })
  }

  try {
    const order = await createPendingOrder({
      email: validation.data.email,
      items: validation.data.items,
    })

    return res.status(201).json({
      success: true,

      order: {
        orderNumber: order.orderNumber,
        email: order.email,
        status: order.status,
        currency: order.currency,

        accessToken: order.accessToken,

        items: order.items,

        totalKobo: order.totalKobo,
        totalNGN: order.totalKobo / 100,
      },
    })
  } catch (error) {

    if (
  error.message ===
    'LICENSE_DELIVERABLE_MISSING'
) {
  return res.status(409).json({
    success: false,
    message:
      'This license is temporarily unavailable for this beat because its required files are not ready.',
  })
}

if (
  error.message ===
    'LICENSE_DELIVERABLES_NOT_CONFIGURED'
) {
  console.error(
    'License has no asset grant configuration'
  )

  return res.status(409).json({
    success: false,
    message:
      'This license is temporarily unavailable.',
  })
}

if (error.message === 'INVALID_BEAT') {
  return res.status(400).json({
    success: false,
    message: 'One or more beats are invalid',
  })
    }

    if (error.message === 'INVALID_LICENSE') {
      return res.status(400).json({
        success: false,
        message: 'One or more licenses are invalid',
      })
    }

    if (error.message === 'LICENSE_NOT_AVAILABLE') {
      return res.status(400).json({
        success: false,
        message:
          'The selected license is not available for this beat',
      })
    }

    if (error.message === 'DUPLICATE_BEAT') {
      return res.status(400).json({
        success: false,
        message:
          'A beat cannot appear more than once in an order',
      })
    }

    throw error
  }
}