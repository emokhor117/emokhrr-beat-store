import {
  randomUUID,
  randomBytes,
  createHash,
} from 'node:crypto'

import { db } from '../prisma/db.js'

function generateOrderAccessToken() {
  return randomBytes(32).toString('hex')
}

function hashOrderAccessToken(token) {
  return createHash('sha256')
    .update(token)
    .digest('hex')
}

function generateOrderNumber() {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll('-', '')

  const randomPart = randomUUID()
    .replaceAll('-', '')
    .slice(0, 8)
    .toUpperCase()

  return `EMK-${date}-${randomPart}`
}

async function calculateOrderWithOrm(
  items,
  orm
) {
  const orderItems = []
  const seenBeats = new Set()

  for (const item of items) {
    if (seenBeats.has(item.beatId)) {
      throw new Error('DUPLICATE_BEAT')
    }

    seenBeats.add(item.beatId)

    // 1. Find the beat.
    const beat =
      await orm.public.Beat
        .where({
          publicId: item.beatId,
          status: 'ACTIVE',
        })
        .first()

    if (!beat) {
      throw new Error('INVALID_BEAT')
    }

    // 2. Find the requested license.
    const license =
      await orm.public.LicenseType
        .where({
          code: item.licenseId,
          active: true,
        })
        .first()

    if (!license) {
      throw new Error('INVALID_LICENSE')
    }

    // 3. Find the authoritative price.
    const beatLicense =
      await orm.public.BeatLicense
        .where({
          beatId: beat.id,
          licenseTypeId: license.id,
          active: true,
        })
        .first()

    if (!beatLicense) {
      throw new Error(
        'LICENSE_NOT_AVAILABLE'
      )
    }

    orderItems.push({
      beatDatabaseId: beat.id,
      beatPublicId: beat.publicId,
      beatTitle: beat.title,

      licenseTypeId: license.id,
      licenseCode: license.code,
      licenseName: license.name,
      licenseTerms: license.terms,

      priceKobo: beatLicense.priceKobo,
    })
  }

  const totalKobo =
    orderItems.reduce(
      (total, item) =>
        total + item.priceKobo,
      0
    )

  return {
    items: orderItems,
    totalKobo,
  }
}

export async function calculateOrder(items) {
  return calculateOrderWithOrm(
    items,
    db.orm
  )
}

export async function createPendingOrder({
  email,
  name = null,
  items,
}) {
  const orderNumber =
    generateOrderNumber()

  // Generate a unique secret token
  // specifically for this order.
  const accessToken =
    generateOrderAccessToken()

  // Only the hash is stored.
  const accessTokenHash =
    hashOrderAccessToken(accessToken)

  const result =
    await db.transaction(
      async (tx) => {
        /*
         * We calculate the order INSIDE
         * the transaction as well.
         *
         * This means pricing/licensing reads
         * and order creation are part of the
         * same checkout operation.
         */
        const calculatedOrder =
          await calculateOrderWithOrm(
            items,
            tx.orm
          )

        // Create parent order.
        const order =
          await tx.orm.public.Order.create({
            orderNumber,

            customerEmail: email,
            customerName: name,

            accessTokenHash,

            currency: 'NGN',

            subtotalKobo:
              calculatedOrder.totalKobo,

            totalKobo:
              calculatedOrder.totalKobo,

            status: 'PENDING',
          })

        // Snapshot every purchased item.
        for (
          const item
          of calculatedOrder.items
        ) {
          await tx.orm.public.OrderItem.create({
            orderId: order.id,

            beatId:
              item.beatDatabaseId,

            licenseTypeId:
              item.licenseTypeId,

            beatPublicIdSnapshot:
              item.beatPublicId,

            beatTitleSnapshot:
              item.beatTitle,

            licenseCodeSnapshot:
              item.licenseCode,

            licenseNameSnapshot:
              item.licenseName,

            priceKoboSnapshot:
              item.priceKobo,

            termsSnapshot:
              item.licenseTerms,
          })
        }

        return {
          order,
          calculatedOrder,
        }
      }
    )

  return {
    id: result.order.id,

    orderNumber:
      result.order.orderNumber,

    email:
      result.order.customerEmail,

    currency:
      result.order.currency,

    status:
      result.order.status,

    /*
     * Returned once to the customer.
     * Raw token is never stored
     * in PostgreSQL.
     */
    accessToken,

    items:
      result.calculatedOrder.items.map(
        (item) => ({
          beatId:
            item.beatPublicId,

          beatTitle:
            item.beatTitle,

          licenseId:
            item.licenseCode,

          licenseName:
            item.licenseName,

          priceKobo:
            item.priceKobo,
        })
      ),

    totalKobo:
      result.calculatedOrder.totalKobo,
  }
}