import { db } from '../prisma/db.js'
import {
  createSignedDownloadUrl,
} from './storage.service.js'
import { Temporal } from 'temporal-polyfill'



export async function getAuthorizedDownload({
  grantId,
  customerEmail,
  ipAddress,
  userAgent,
}) {
  const grant = await db.orm.public.DownloadGrant
    .where({
      id: grantId,
    })
    .first()

  if (!grant) {
    throw new Error('Download grant not found')
  }

  if (grant.status !== 'ACTIVE') {
    throw new Error('Download grant is not active')
  }

  if (
  grant.expiresAt &&
  Temporal.Instant.compare(
    grant.expiresAt,
    Temporal.Now.instant()
  ) <= 0
) {
  throw new Error('Download grant has expired')
}

  const order = await db.orm.public.Order
    .where({
      id: grant.orderId,
    })
    .first()

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.status !== 'PAID') {
    throw new Error('Order is not paid')
  }

  if (
    order.customerEmail.toLowerCase() !==
    customerEmail.toLowerCase()
  ) {
    throw new Error('Download is not authorized')
  }

  const asset = await db.orm.public.BeatAsset
    .where({
      id: grant.assetId,
    })
    .first()

  if (!asset) {
    throw new Error('Asset not found')
  }

  const downloadableTypes = [
    'MP3_UNMASTERED',
    'WAV_UNMASTERED',
    'STEMS_ZIP',
  ]

  if (!downloadableTypes.includes(asset.type)) {
    throw new Error('Asset is not downloadable')
  }

  const signedUrl = await createSignedDownloadUrl({
    key: asset.storageKey,
    expiresIn: 300,
  })

  await db.orm.public.DownloadEvent.create({
  downloadGrantId: grant.id,
  ipAddress: ipAddress || null,
  userAgent: userAgent || null,
})

  return {
    grantId: grant.id,
    assetType: asset.type,
    mimeType: asset.mimeType,
    signedUrl,
    expiresIn: 300,
  }
}