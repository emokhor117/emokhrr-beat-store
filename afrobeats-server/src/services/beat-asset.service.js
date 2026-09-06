import crypto from 'node:crypto'

import {
  createReadStream,
} from 'node:fs'

import {
  readFile,
  unlink,
} from 'node:fs/promises'

import { db } from '../prisma/db.js'

import {
  uploadObject,
  uploadLargeObject,
  deleteObject,
} from './storage.service.js'

import {
  validateAssetFile,
} from '../utils/asset-validation.js'

import {
  ASSET_TYPES,
  getAssetStorageConfig,
} from '../utils/asset-storage.js'

const LARGE_FILE_THRESHOLD =
  10 * 1024 * 1024

async function calculateFileChecksum(
  filePath
) {
  return new Promise(
    (resolve, reject) => {
      const hash =
        crypto.createHash('sha256')

      const stream =
        createReadStream(filePath)

      stream.on('data', chunk => {
        hash.update(chunk)
      })

      stream.on('end', () => {
        resolve(hash.digest('hex'))
      })

      stream.on('error', reject)
    }
  )
}

async function removeTemporaryFile(
  filePath
) {
  if (!filePath) return

  try {
    await unlink(filePath)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(
        'Failed to remove temporary upload file:',
        {
          filePath,
          message: error.message,
        }
      )
    }
  }
}

export async function uploadBeatAsset({
  beatPublicId,
  assetType,
  file,
}) {
  if (!file) {
    throw new Error(
      'No file was uploaded'
    )
  }

  try {
    await validateAssetFile({
      assetType,
      file,
    })

    if (
      !Object.values(
        ASSET_TYPES
      ).includes(assetType)
    ) {
      throw new Error(
        'Unsupported asset type'
      )
    }

    const beat =
      await db.orm.public.Beat
        .where({
          publicId: beatPublicId,
        })
        .first()

    if (!beat) {
      throw new Error(
        'Beat not found'
      )
    }

    /*
     * Read all existing versions so
     * we can calculate the next one.
     */
    const existingAssets =
      await db.orm.public.BeatAsset
        .where({
          beatId: beat.id,
          type: assetType,
        })
        .all()

    const latestVersion =
      existingAssets.length > 0
        ? Math.max(
            ...existingAssets.map(
              asset =>
                Number(asset.version)
            )
          )
        : 0

    const version =
      latestVersion + 1

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
      await calculateFileChecksum(
        file.path
      )

    let uploadedToR2 = false

    try {
      /*
       * Upload the new object first.
       *
       * We do NOT deactivate the old
       * asset before this succeeds.
       */
      if (
        file.size >=
        LARGE_FILE_THRESHOLD
      ) {
        const stream =
          createReadStream(
            file.path
          )

        await uploadLargeObject({
          bucket,
          key,
          body: stream,
          contentType:
            file.mimetype,
        })
      } else {
        const buffer =
          await readFile(
            file.path
          )

        await uploadObject({
          bucket,
          key,
          body: buffer,
          contentType:
            file.mimetype,
        })
      }

      uploadedToR2 = true

      /*
       * Database changes are atomic:
       *
       * 1. Deactivate old versions.
       * 2. Create new active version.
       *
       * If creation fails, the
       * deactivations roll back.
       */
      const asset =
        await db.transaction(
          async (tx) => {
            const oldAssets =
              await tx.orm.public.BeatAsset
                .where({
                  beatId: beat.id,
                  type: assetType,
                  active: true,
                })
                .all()

            for (
              const oldAsset
              of oldAssets
            ) {
              await tx.orm.public.BeatAsset
                .where({
                  id: oldAsset.id,
                })
                .update({
                  active: false,
                })
            }

            const newAsset =
              await tx.orm.public.BeatAsset
                .create({
                  beatId:
                    beat.id,

                  type:
                    assetType,

                  storageKey:
                    key,

                  version,

                  mimeType:
                    file.mimetype,

                  fileSize:
                    BigInt(
                      file.size
                    ),

                  checksum,

                  active: true,
                })

            return newAsset
          }
        )

      return {
        id:
          asset.id,

        beatId:
          beat.id,

        beatPublicId:
          beat.publicId,

        type:
          asset.type,

        version:
          asset.version,

        storageKey:
          asset.storageKey,

        mimeType:
          asset.mimeType,

        fileSize:
          asset.fileSize
            ?.toString(),

        checksum:
          asset.checksum,
      }
    } catch (error) {
      /*
       * If R2 succeeded but the DB
       * operation failed, remove the
       * orphaned R2 object.
       */
      if (uploadedToR2) {
        try {
          await deleteObject({
            bucket,
            key,
          })
        } catch (
          cleanupError
        ) {
          console.error(
            'Failed to clean up orphaned R2 object:',
            {
              key,
              message:
                cleanupError.message,
            }
          )
        }
      }

      throw error
    }
  } finally {
    /*
     * Always remove Multer's
     * temporary local file.
     */
    await removeTemporaryFile(
      file.path
    )
  }
}
