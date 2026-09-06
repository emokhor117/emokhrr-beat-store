import { db } from '../prisma/db.js'

import {
  createSignedPublicUrl,
} from '../services/storage.service.js'

export async function listBeats(req, res, next) {
  try {
    const beats = await db.orm.public.Beat
      .where({
        status: 'ACTIVE',
      })
      .all()

    const formattedBeats = await Promise.all(
      beats.map(async (beat) => {
        // -------------------------
        // ASSETS
        // -------------------------

        const assets = await db.orm.public.BeatAsset
          .where({
            beatId: beat.id,
            active: true,
          })
          .all()

        const artwork = assets
          .filter(
            (asset) =>
              asset.type === 'ARTWORK'
          )
          .sort(
            (a, b) =>
              b.version - a.version
          )[0]

        const preview = assets
          .filter(
            (asset) =>
              asset.type ===
              'PREVIEW_MASTERED_TAGGED'
          )
          .sort(
            (a, b) =>
              b.version - a.version
          )[0]

        const image = artwork
          ? await createSignedPublicUrl({
              key: artwork.storageKey,
            })
          : null

        const previewUrl = preview
          ? await createSignedPublicUrl({
              key: preview.storageKey,
            })
          : null

        // -------------------------
        // BEAT LICENSES
        // -------------------------

        const beatLicenses =
          await db.orm.public.BeatLicense
            .where({
              beatId: beat.id,
              active: true,
            })
            .all()

        const licenses = []

        for (const beatLicense of beatLicenses) {
          const licenseType =
            await db.orm.public.LicenseType
              .where({
                id: beatLicense.licenseTypeId,
                active: true,
              })
              .first()

          if (!licenseType) {
            continue
          }

          licenses.push({
            id: licenseType.code,
            code: licenseType.code,
            name: licenseType.name,
            description:
              licenseType.description,

            priceKobo:
              beatLicense.priceKobo,

            priceNGN:
              beatLicense.priceKobo / 100,

            terms: licenseType.terms,

            sortOrder:
              licenseType.sortOrder,
          })
        }

        // Basic → Premium → Trackout → Unlimited,
        // according to sortOrder in the DB.
        licenses.sort(
          (a, b) =>
            a.sortOrder - b.sortOrder
        )

        // Cheapest active license for this beat.
        const lowestPriceKobo =
          licenses.length > 0
            ? Math.min(
                ...licenses.map(
                  (license) =>
                    license.priceKobo
                )
              )
            : null

        return {
          id: beat.publicId,
          title: beat.title,
          slug: beat.slug,
          producer: beat.producer,
          genre: beat.genre,
          mood: beat.mood,
          bpm: beat.bpm,
          key: beat.musicalKey,
          durationSec:
            beat.durationSec,

          image,
          previewUrl,

          priceKobo:
            lowestPriceKobo,

          priceNGN:
            lowestPriceKobo !== null
              ? lowestPriceKobo / 100
              : null,

          licenses,
        }
      })
    )

    return res.status(200).json({
      success: true,
      beats: formattedBeats,
    })
  } catch (error) {
    next(error)
  }
}