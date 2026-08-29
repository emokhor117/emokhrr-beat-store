import { randomUUID } from 'node:crypto'
import { db } from '../prisma/db.js'

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

export async function calculateOrder(items) {
  const orderItems = []
  const seenBeats = new Set()

  for (const item of items) {
    if (seenBeats.has(item.beatId)) {
      throw new Error('DUPLICATE_BEAT')
    }

    seenBeats.add(item.beatId)

    // 1. Find the beat.
    const beat = await db.orm.public.Beat
      .where({
        publicId: item.beatId,
        status: 'ACTIVE',
      })
      .first()

    if (!beat) {
      throw new Error('INVALID_BEAT')
    }

    // 2. Find the requested license.
    const license = await db.orm.public.LicenseType
      .where({
        code: item.licenseId,
        active: true,
      })
      .first()

    if (!license) {
      throw new Error('INVALID_LICENSE')
    }

    // 3. Find the authoritative price.
    const beatLicense = await db.orm.public.BeatLicense
      .where({
        beatId: beat.id,
        licenseTypeId: license.id,
        active: true,
      })
      .first()

    if (!beatLicense) {
      throw new Error('LICENSE_NOT_AVAILABLE')
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

  const totalKobo = orderItems.reduce(
    (total, item) => total + item.priceKobo,
    0
  )

  return {
    items: orderItems,
    totalKobo,
  }
}

export async function createPendingOrder({
  email,
  name = null,
  items,
}) {
  const calculatedOrder = await calculateOrder(items)

  const orderNumber = generateOrderNumber()

  // Create the parent order first.
  const order = await db.orm.public.Order.create({
    orderNumber,

    customerEmail: email,
    customerName: name,

    currency: 'NGN',

    subtotalKobo: calculatedOrder.totalKobo,
    totalKobo: calculatedOrder.totalKobo,

    status: 'PENDING',
  })

  // Snapshot every purchased item.
  for (const item of calculatedOrder.items) {
    await db.orm.public.OrderItem.create({
      orderId: order.id,

      beatId: item.beatDatabaseId,
      licenseTypeId: item.licenseTypeId,

      beatPublicIdSnapshot: item.beatPublicId,
      beatTitleSnapshot: item.beatTitle,

      licenseCodeSnapshot: item.licenseCode,
      licenseNameSnapshot: item.licenseName,

      priceKoboSnapshot: item.priceKobo,

      termsSnapshot: item.licenseTerms,
    })
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    email: order.customerEmail,
    currency: order.currency,
    status: order.status,

    items: calculatedOrder.items.map((item) => ({
      beatId: item.beatPublicId,
      beatTitle: item.beatTitle,

      licenseId: item.licenseCode,
      licenseName: item.licenseName,

      priceKobo: item.priceKobo,
    })),

    totalKobo: calculatedOrder.totalKobo,
  }
}