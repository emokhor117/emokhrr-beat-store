import {
  uploadBeatAsset,
} from '../services/beat-asset.service.js'

export async function uploadBeatAssetController(
  req,
  res
) {
  try {
    const { publicId } = req.params
    const { assetType } = req.body
    const file = req.file

    if (!assetType) {
      return res.status(400).json({
        message: 'assetType is required',
      })
    }

    const asset = await uploadBeatAsset({
      beatPublicId: publicId,
      assetType,
      file,
    })

    return res.status(201).json({
      message: 'Beat asset uploaded successfully',
      asset,
    })
  } catch (error) {
    console.error('Beat asset upload failed:', {
      name: error.name,
      message: error.message,
    })

    const knownClientErrors = [
      'No file was uploaded',
      'Unsupported asset type',
      'Beat not found',
    ]

    const isValidationError =
      error.message?.startsWith(
        'Invalid file type for'
      )

    if (
      knownClientErrors.includes(error.message) ||
      isValidationError
    ) {
      return res.status(
        error.message === 'Beat not found'
          ? 404
          : 400
      ).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to upload beat asset',
    })
  }
}