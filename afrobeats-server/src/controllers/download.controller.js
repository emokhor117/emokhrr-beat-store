import {
  getAuthorizedOrderDownloads,
} from '../services/download.service.js'

export async function getOrderDownloadsController(
  req,
  res
) {
  try {
    const { orderNumber } = req.params

    const accessToken =
      req.get('x-order-access-token')

    if (!accessToken) {
      return res.status(400).json({
        message:
          'x-order-access-token header is required',
      })
    }

    const result =
      await getAuthorizedOrderDownloads({
        orderNumber,
        accessToken,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      })

    return res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error(
      'Order download authorization failed:',
      {
        name: error.name,
        message: error.message,
      }
    )

    if (
      error.message ===
        'Order number and access token are required'
    ) {
      return res.status(400).json({
        message: error.message,
      })
    }

    if (
      error.message ===
        'Download access is not authorized'
    ) {
      return res.status(403).json({
        message: error.message,
      })
    }

    if (
      error.message === 'Order is not paid' ||
      error.message ===
        'No download grants found' ||
      error.message ===
        'No active downloads are available'
    ) {
      return res.status(403).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message:
        'Failed to authorize order downloads',
    })
  }
}