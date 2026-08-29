import {
  getAuthorizedDownload,
} from '../services/download.service.js'

export async function getDownloadController(req, res) {
  try {
    const { grantId } = req.params
    const { email } = req.query

    if (!email) {
      return res.status(400).json({
        message: 'email is required',
      })
    }

    const download = await getAuthorizedDownload({
      grantId,
      customerEmail: email,
      ipAddress: req.ip,
  userAgent: req.get('user-agent'),
    })

    return res.status(200).json({
      message: 'Download authorized',
      download,
    })
  } catch (error) {
    console.error('Download authorization failed:', {
      name: error.name,
      message: error.message,
    })

    if (
      error.message === 'Download grant not found' ||
      error.message === 'Order not found' ||
      error.message === 'Asset not found'
    ) {
      return res.status(404).json({
        message: error.message,
      })
    }

    if (
      error.message === 'Download grant is not active' ||
      error.message === 'Download grant has expired' ||
      error.message === 'Order is not paid' ||
      error.message === 'Download is not authorized' ||
      error.message === 'Asset is not downloadable'
    ) {
      return res.status(403).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to authorize download',
    })
  }
}