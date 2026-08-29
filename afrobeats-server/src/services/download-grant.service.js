import { db } from '../prisma/db.js'

export async function createDownloadGrantsForOrder({
  orderId,
  orm = db.orm,
}) {
  const order = await orm.public.Order
    .where({
      id: orderId,
    })
    .first()

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.status !== 'PAID') {
    throw new Error(
      'Download grants can only be created for paid orders'
    )
  }

  const orderItems = await orm.public.OrderItem
    .where({
      orderId,
    })
    .all()

  const createdGrants = []

  for (const orderItem of orderItems) {
    const assetGrants =
      await orm.public.LicenseAssetGrant
        .where({
          licenseTypeId:
            orderItem.licenseTypeId,
        })
        .all()

    for (const assetGrant of assetGrants) {
      const assets =
        await orm.public.BeatAsset
          .where({
            beatId: orderItem.beatId,
            type: assetGrant.assetType,
            active: true,
          })
          .all()

      if (assets.length === 0) {
  throw new Error(
    `Required asset ${assetGrant.assetType} is missing for beat ${orderItem.beatId}`
  )
}

      const latestAsset = assets.reduce(
        (latest, current) =>
          current.version > latest.version
            ? current
            : latest
      )

      const existingGrant =
        await orm.public.DownloadGrant
          .where({
            orderId,
            orderItemId: orderItem.id,
            assetId: latestAsset.id,
          })
          .first()

      if (existingGrant) {
        createdGrants.push(existingGrant)
        continue
      }

      const grant =
        await orm.public.DownloadGrant.create({
          orderId,
          orderItemId: orderItem.id,
          assetId: latestAsset.id,
          status: 'ACTIVE',
        })

      createdGrants.push(grant)
    }
  }

  return createdGrants
}