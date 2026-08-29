import { R2_BUCKETS } from '../services/storage.service.js'

export const ASSET_TYPES = {
  ARTWORK: 'ARTWORK',
  PREVIEW_MASTERED_TAGGED: 'PREVIEW_MASTERED_TAGGED',
  MP3_UNMASTERED: 'MP3_UNMASTERED',
  WAV_UNMASTERED: 'WAV_UNMASTERED',
  STEMS_ZIP: 'STEMS_ZIP',
}

function getArtworkExtension(mimeType) {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    default:
      throw new Error(
        `Unsupported artwork MIME type: ${mimeType}`
      )
  }
}

export function getAssetStorageConfig({
  beatId,
  assetType,
  version = 1,
  mimeType,
}) {
  switch (assetType) {
    case ASSET_TYPES.ARTWORK: {
      const extension =
        getArtworkExtension(mimeType)

      return {
        bucket: R2_BUCKETS.PUBLIC,
        key:
          `artwork/${beatId}/v${version}/cover.${extension}`,
        isPublic: true,
      }
    }

    case ASSET_TYPES.PREVIEW_MASTERED_TAGGED:
      return {
        bucket: R2_BUCKETS.PUBLIC,
        key:
          `previews/${beatId}/v${version}/preview.mp3`,
        isPublic: true,
      }

    case ASSET_TYPES.MP3_UNMASTERED:
      return {
        bucket: R2_BUCKETS.PRIVATE,
        key:
          `beats/${beatId}/mp3/v${version}/unmastered.mp3`,
        isPublic: false,
      }

    case ASSET_TYPES.WAV_UNMASTERED:
      return {
        bucket: R2_BUCKETS.PRIVATE,
        key:
          `beats/${beatId}/wav/v${version}/unmastered.wav`,
        isPublic: false,
      }

    case ASSET_TYPES.STEMS_ZIP:
      return {
        bucket: R2_BUCKETS.PRIVATE,
        key:
          `beats/${beatId}/stems/v${version}/stems.zip`,
        isPublic: false,
      }

    default:
      throw new Error(
        `Unsupported asset type: ${assetType}`
      )
  }
}