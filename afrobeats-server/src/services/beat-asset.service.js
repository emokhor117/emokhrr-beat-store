import crypto from 'crypto'

import { db } from '../prisma/db.js'
import {
  uploadObject,
  uploadLargeObject,
} from './storage.service.js'

import {
  validateAssetFile,
} from '../utils/asset-validation.js'
import {
  ASSET_TYPES,
  getAssetStorageConfig,
} from '../utils/asset-storage.js'

const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024

function calculateChecksum(buffer) {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest('hex')
}

export async function uploadBeatAsset({
  beatPublicId,
  assetType,
  file,
}) {
  if (!file) {
    throw new Error('No file was uploaded')
  }
  validateAssetFile({
  assetType,
  file,
})

  if (!Object.values(ASSET_TYPES).includes(assetType)) {
    throw new Error('Unsupported asset type')
  }

  const beat = await db.orm.public.Beat
    .where({
      publicId: beatPublicId,
    })
    .first()

  if (!beat) {
    throw new Error('Beat not found')
  }

  const existingAssets = await db.orm.public.BeatAsset
    .where({
      beatId: beat.id,
      type: assetType,
    })
    .all()

  const latestVersion =
    existingAssets.length > 0
      ? Math.max(
          ...existingAssets.map(
            asset => Number(asset.version)
          )
        )
      : 0

  const version = latestVersion + 1

  const {
    bucket,
    key,
  } = getAssetStorageConfig({
    beatId: beat.id,
    assetType,
    version,
    mimeType: file.mimetype,
  })

  const checksum =
    calculateChecksum(file.buffer)

  const uploadFn =
    file.size >= LARGE_FILE_THRESHOLD
      ? uploadLargeObject
      : uploadObject

  await uploadFn({
    bucket,
    key,
    body: file.buffer,
    contentType: file.mimetype,
  })

  const asset = await db.orm.public.BeatAsset.create({
    beatId: beat.id,
    type: assetType,
    storageKey: key,
    version,
    mimeType: file.mimetype,
    fileSize: BigInt(file.size),
    checksum,
    active: true,
  })

  return {
    id: asset.id,
    beatId: beat.id,
    beatPublicId: beat.publicId,
    type: asset.type,
    version: asset.version,
    storageKey: asset.storageKey,
    mimeType: asset.mimeType,
    fileSize: asset.fileSize?.toString(),
    checksum: asset.checksum,
  }
}