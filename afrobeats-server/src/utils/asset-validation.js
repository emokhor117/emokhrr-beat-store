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
  ],

  [ASSET_TYPES.STEMS_ZIP]: [
    'application/zip',
    'application/x-zip-compressed',
  ],
}

export function validateAssetFile({
  assetType,
  file,
}) {
  const allowed =
    ALLOWED_MIME_TYPES[assetType]

  if (!allowed) {
    throw new Error(
      'Unsupported asset type'
    )
  }

  if (!allowed.includes(file.mimetype)) {
    throw new Error(
      `Invalid file type for ${assetType}`
    )
  }

  return true
}