import { db } from '../prisma/db.js'

export async function upsertBeatLicenses({
  beatPublicId,
  licenses,
}) {
  if (
    !Array.isArray(licenses) ||
    licenses.length === 0
  ) {
    throw new Error(
      'INVALID_LICENSE_DATA'
    )
  }

  const beat =
    await db.orm.public.Beat
      .where({
        publicId:
          beatPublicId,
      })
      .first()

  if (!beat) {
    throw new Error(
      'BEAT_NOT_FOUND'
    )
  }

  const normalizedLicenses =
    licenses.map((license) => {
      const code =
        String(
          license.code || ''
        )
          .trim()
          .toLowerCase()

      const priceNGN =
        Number(
          license.priceNGN
        )

      if (
        !code ||
        !Number.isFinite(priceNGN) ||
        priceNGN <= 0
      ) {
        throw new Error(
          'INVALID_LICENSE_DATA'
        )
      }

      return {
        code,
        priceKobo:
          Math.round(
            priceNGN * 100
          ),
      }
    })

  const seenCodes = new Set()

  for (
    const license
    of normalizedLicenses
  ) {
    if (
      seenCodes.has(
        license.code
      )
    ) {
      throw new Error(
        'INVALID_LICENSE_DATA'
      )
    }

    seenCodes.add(
      license.code
    )
  }

  return db.transaction(
    async (tx) => {
      const results = []

      for (
        const license
        of normalizedLicenses
      ) {
        const licenseType =
          await tx.orm.public.LicenseType
            .where({
              code:
                license.code,
              active: true,
            })
            .first()

        if (!licenseType) {
          throw new Error(
            'LICENSE_TYPE_NOT_FOUND'
          )
        }

        const existing =
          await tx.orm.public.BeatLicense
            .where({
              beatId:
                beat.id,

              licenseTypeId:
                licenseType.id,
            })
            .first()

        let beatLicense

        if (existing) {
          beatLicense =
            await tx.orm.public.BeatLicense
              .where({
                id:
                  existing.id,
              })
              .update({
                priceKobo:
                  license.priceKobo,

                active: true,
              })
        } else {
          beatLicense =
            await tx.orm.public.BeatLicense
              .create({
                beatId:
                  beat.id,

                licenseTypeId:
                  licenseType.id,

                priceKobo:
                  license.priceKobo,

                active: true,
              })
        }

        results.push({
          code:
            licenseType.code,

          name:
            licenseType.name,

          priceKobo:
            beatLicense.priceKobo,

          priceNGN:
            beatLicense.priceKobo /
            100,

          active:
            beatLicense.active,
        })
      }

      return results
    }
  )
}