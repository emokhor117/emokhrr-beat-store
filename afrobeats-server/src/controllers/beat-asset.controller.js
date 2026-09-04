import {
  uploadBeatAsset,
} from '../services/beat-asset.service.js'


export async function uploadBeatAssetController(
  req,
  res
) {
  try {
    const { beatId } = req.params
    const { assetType } = req.body ?? {}
    const file = req.file

    if (!beatId) {
      return res.status(400).json({
        success: false,
        message: 'beatId is required',
      })
    }

    if (!assetType) {
      return res.status(400).json({
        success: false,
        message: 'assetType is required',
      })
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'file is required',
      })
    }



    const asset = await uploadBeatAsset({
      beatPublicId: beatId,
      assetType,
      file,
    })

    return res.status(201).json({
      success: true,
      message: 'Beat asset uploaded successfully',
      asset: {
        id: asset.id,
        type: asset.type,
        version: asset.version,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize ?? null,
        checksum: asset.checksum,
      },
    })
  } catch (error) {
    console.error('Beat asset upload failed:', {
      name: error.name,
      message: error.message,
    })

    if (
  error.message === 'Unsupported asset type' ||
  error.message.startsWith('Invalid file type') ||
  error.message.startsWith('Unsupported artwork MIME type') ||
  error.message === 'No file was uploaded' ||
  error.message.startsWith('Unable to verify file contents') ||
  error.message.startsWith('File contents do not match')
) {
  return res.status(400).json({
    success: false,
    message: error.message,
  })
}

    if (error.message === 'Beat not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to upload beat asset',
    })
  }
} 