import { Temporal } from 'temporal-polyfill'
import { db } from '../prisma/db.js'

async function backfillDownloadExpiry() {
  const grants = await db.orm.public.DownloadGrant
    .where({})
    .all()

  let updated = 0

  for (const grant of grants) {
    if (grant.expiresAt) {
      continue
    }

    const baseTime =
      grant.createdAt ?? Temporal.Now.instant()

    const expiresAt = baseTime.add({
      hours: 168,
    })

    await db.orm.public.DownloadGrant
      .where({
        id: grant.id,
      })
      .update({
        expiresAt,
      })

    updated += 1
  }

  console.log(
    `Backfill complete. Updated ${updated} download grant(s).`
  )
}

backfillDownloadExpiry()
  .catch((error) => {
    console.error(
      'Download expiry backfill failed:',
      error
    )

    process.exitCode = 1
  })