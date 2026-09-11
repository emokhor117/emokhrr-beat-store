import crypto from 'crypto'

import { db } from '../prisma/db.js'
import { Temporal } from 'temporal-polyfill'

import {
  createSignedDownloadUrl,
} from './storage.service.js'

function hashOrderAccessToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
}

export async function getAuthorizedOrderDownloads({
  orderNumber,
  accessToken,
  ipAddress,
  userAgent,
}) {
  if (!orderNumber || !accessToken) {
    throw new Error('Order number and access token are required')
  }

  const accessTokenHash =
    hashOrderAccessToken(accessToken)

  const order = await db.orm.public.Order
    .where({
      orderNumber,
      accessTokenHash,
    })
    .first()

  if (!order) {
    throw new Error('Download access is not authorized')
  }

  if (order.status !== 'PAID') {
    throw new Error('Order is not paid')
  }

  const grants = await db.orm.public.DownloadGrant
    .where({
      orderId: order.id,
    })
    .all()

  if (grants.length === 0) {
    throw new Error('No download grants found')
  }

  const downloads = []

  for (const grant of grants) {
    if (grant.status !== 'ACTIVE') {
      continue
    }

    if (
      grant.expiresAt &&
      Temporal.Instant.compare(
        grant.expiresAt,
        Temporal.Now.instant()
      ) <= 0
    ) {
      continue
    }

    const asset = await db.orm.public.BeatAsset
      .where({
        id: grant.assetId,
      })
      .first()

    if (!asset) {
      continue
    }

    const downloadableTypes = [
      'MP3_UNMASTERED',
      'WAV_UNMASTERED',
      'STEMS_ZIP',
    ]

    if (!downloadableTypes.includes(asset.type)) {
      continue
    }

    const orderItem = await db.orm.public.OrderItem
      .where({
        id: grant.orderItemId,
      })
      .first()

    if (!orderItem) {
      continue
    }

    const signedUrl = await createSignedDownloadUrl({
      key: asset.storageKey,
      expiresIn: 300,
    })

   
    downloads.push({
      grantId: grant.id,

      beatId:
        orderItem.beatPublicIdSnapshot,

      beatTitle:
        orderItem.beatTitleSnapshot,

      licenseCode:
        orderItem.licenseCodeSnapshot,

      licenseName:
        orderItem.licenseNameSnapshot,

      assetType: asset.type,
      mimeType: asset.mimeType,

      signedUrl,
      expiresIn: 300,

      grantExpiresAt:
        grant.expiresAt ?? null,
    })
  }

  if (downloads.length === 0) {
    throw new Error(
      'No active downloads are available'
    )
  }

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    downloads,
  }
}