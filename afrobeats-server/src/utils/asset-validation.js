import {
  fileTypeFromFile,
} from 'file-type'

import {
  ASSET_TYPES,
} from './asset-storage.js'

const ALLOWED_MIME_TYPES = {
  [ASSET_TYPES.ARTWORK]: [
    'image/jpeg',
    'image/png',
    'image/webp',
  ],

  [ASSET_TYPES.PREVIEW_MASTERED_TAGGED]: [
    'audio/mpeg',
  ],

  [ASSET_TYPES.MP3_UNMASTERED]: [
    'audio/mpeg',
  ],

  [ASSET_TYPES.WAV_UNMASTERED]: [
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/vnd.wave',
  ],

  [ASSET_TYPES.STEMS_ZIP]: [
    'application/zip',
    'application/x-zip-compressed',
  ],
}

export async function validateAssetFile({
  assetType,
  file,
}) {
  const allowedMimeTypes =
    ALLOWED_MIME_TYPES[assetType]

  if (!allowedMimeTypes) {
    throw new Error('Unsupported asset type')
  }

  if (!file?.path) {
    throw new Error('No file was uploaded')
  }

  if (
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    throw new Error(
      `Invalid file type for ${assetType}`
    )
  }

  const detectedType =
    await fileTypeFromFile(file.path)

  if (!detectedType) {
    throw new Error(
      `Unable to verify file contents for ${assetType}`
    )
  }

  if (
    !allowedMimeTypes.includes(
      detectedType.mime
    )
  ) {
    throw new Error(
      `File contents do not match ${assetType}`
    )
  }

  return true
}