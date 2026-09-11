import { randomUUID } from 'node:crypto'

import { db } from '../prisma/db.js'

const VALID_STATUSES = [
  'DRAFT',
  'ACTIVE',
  'EXCLUSIVE_SOLD',
  'ARCHIVED',
]

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generatePublicId() {
  const randomPart = randomUUID()
    .replaceAll('-', '')
    .slice(0, 10)
    .toUpperCase()

  return `beat_${randomPart}`
}

function normalizeOptionalString(value) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return null
  }

  return String(value).trim()
}

async function beatHasActiveAsset({
  beatId,
  assetType,
  orm,
}) {
  const assets =
    await orm.public.BeatAsset
      .where({
        beatId,
        type: assetType,
        active: true,
      })
      .all()

  return assets.length > 0
}

async function licenseIsDeliverable({
  beatId,
  licenseTypeId,
  orm,
}) {
  const requiredGrants =
    await orm.public.LicenseAssetGrant
      .where({
        licenseTypeId,
      })
      .all()

  if (requiredGrants.length === 0) {
    return false
  }

  for (const grant of requiredGrants) {
    const hasAsset =
      await beatHasActiveAsset({
        beatId,
        assetType: grant.assetType,
        orm,
      })

    if (!hasAsset) {
      return false
    }
  }

  return true
}

async function validateBeatCanBePublished({
  beat,
  orm,
}) {
  // Artwork is mandatory.
  const hasArtwork =
    await beatHasActiveAsset({
      beatId: beat.id,
      assetType: 'ARTWORK',
      orm,
    })

  if (!hasArtwork) {
    throw new Error(
      'BEAT_MISSING_ARTWORK'
    )
  }

  // Public preview is mandatory.
  const hasPreview =
    await beatHasActiveAsset({
      beatId: beat.id,
      assetType:
        'PREVIEW_MASTERED_TAGGED',
      orm,
    })

  if (!hasPreview) {
    throw new Error(
      'BEAT_MISSING_PREVIEW'
    )
  }

  // Beat must have at least one active
  // configured license.
  const beatLicenses =
    await orm.public.BeatLicense
      .where({
        beatId: beat.id,
        active: true,
      })
      .all()

  if (beatLicenses.length === 0) {
    throw new Error(
      'BEAT_HAS_NO_LICENSES'
    )
  }

  let hasDeliverableLicense = false

  for (const beatLicense of beatLicenses) {
    const licenseType =
      await orm.public.LicenseType
        .where({
          id:
            beatLicense.licenseTypeId,
          active: true,
        })
        .first()

    if (!licenseType) {
      continue
    }

    const deliverable =
      await licenseIsDeliverable({
        beatId: beat.id,
        licenseTypeId:
          licenseType.id,
        orm,
      })

    if (deliverable) {
      hasDeliverableLicense = true
      break
    }
  }

  if (!hasDeliverableLicense) {
    throw new Error(
      'BEAT_HAS_NO_DELIVERABLE_LICENSE'
    )
  }
}

export async function createBeat({
  title,
  producer = 'EMOKHRR',
  genre = null,
  mood = null,
  bpm = null,
  musicalKey = null,
  durationSec = null,
  status = 'DRAFT',
  slug = null,
  publicId = null,
}) {
  if (
    typeof title !== 'string' ||
    title.trim() === ''
  ) {
    throw new Error(
      'INVALID_BEAT_DATA'
    )
  }

  if (
    !VALID_STATUSES.includes(status)
  ) {
    throw new Error(
      'INVALID_BEAT_DATA'
    )
  }

  /*
   * New beats should be created as drafts.
   *
   * Publishing happens through updateBeat()
   * after assets/licenses have been configured.
   */
  if (status === 'ACTIVE') {
    throw new Error(
      'BEAT_MUST_START_AS_DRAFT'
    )
  }

  const normalizedTitle =
    title.trim()

  const generatedSlug =
    slugify(
      slug || normalizedTitle
    )

  const generatedPublicId =
    publicId || generatePublicId()

  if (!generatedSlug) {
    throw new Error(
      'INVALID_BEAT_DATA'
    )
  }

  const existingBeat =
    await db.orm.public.Beat
      .where({
        publicId:
          generatedPublicId,
      })
      .first()

  if (existingBeat) {
    throw new Error(
      'BEAT_ALREADY_EXISTS'
    )
  }

  const existingSlug =
    await db.orm.public.Beat
      .where({
        slug: generatedSlug,
      })
      .first()

  if (existingSlug) {
    throw new Error(
      'BEAT_ALREADY_EXISTS'
    )
  }

  const beat =
    await db.orm.public.Beat.create({
      publicId:
        generatedPublicId,

      title:
        normalizedTitle,

      slug:
        generatedSlug,

      producer:
        String(producer).trim(),

      genre:
        normalizeOptionalString(
          genre
        ),

      mood:
        normalizeOptionalString(
          mood
        ),

      bpm:
        bpm !== null &&
        bpm !== undefined
          ? Number(bpm)
          : null,

      musicalKey:
        normalizeOptionalString(
          musicalKey
        ),

      durationSec:
        durationSec !== null &&
        durationSec !== undefined
          ? Number(durationSec)
          : null,

      status,
    })

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
    status: beat.status,
  }
}

export async function updateBeat({
  beatPublicId,
  updates,
}) {
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

  const allowedUpdates = {}

  if (
    updates.title !== undefined
  ) {
    if (
      typeof updates.title !==
        'string' ||
      updates.title.trim() === ''
    ) {
      throw new Error(
        'INVALID_BEAT_DATA'
      )
    }

    allowedUpdates.title =
      updates.title.trim()
  }

  if (
    updates.producer !== undefined
  ) {
    allowedUpdates.producer =
      String(
        updates.producer
      ).trim()
  }

  if (
    updates.genre !== undefined
  ) {
    allowedUpdates.genre =
      normalizeOptionalString(
        updates.genre
      )
  }

  if (
    updates.mood !== undefined
  ) {
    allowedUpdates.mood =
      normalizeOptionalString(
        updates.mood
      )
  }

  if (
    updates.bpm !== undefined
  ) {
    allowedUpdates.bpm =
      updates.bpm === null
        ? null
        : Number(updates.bpm)
  }

  if (
    updates.musicalKey !==
    undefined
  ) {
    allowedUpdates.musicalKey =
      normalizeOptionalString(
        updates.musicalKey
      )
  }

  if (
    updates.durationSec !==
    undefined
  ) {
    allowedUpdates.durationSec =
      updates.durationSec === null
        ? null
        : Number(
            updates.durationSec
          )
  }

  if (
    updates.status !== undefined
  ) {
    if (
      !VALID_STATUSES.includes(
        updates.status
      )
    ) {
      throw new Error(
        'INVALID_BEAT_DATA'
      )
    }

    /*
     * Publishing requires validation.
     */
    if (
      updates.status === 'ACTIVE' &&
      beat.status !== 'ACTIVE'
    ) {
      await validateBeatCanBePublished({
        beat,
        orm: db.orm,
      })
    }

    allowedUpdates.status =
      updates.status
  }

  const updatedBeat =
    await db.orm.public.Beat
      .where({
        id: beat.id,
      })
      .update(
        allowedUpdates
      )

  return {
    id:
      updatedBeat.publicId,

    title:
      updatedBeat.title,

    slug:
      updatedBeat.slug,

    producer:
      updatedBeat.producer,

    genre:
      updatedBeat.genre,

    mood:
      updatedBeat.mood,

    bpm:
      updatedBeat.bpm,

    key:
      updatedBeat.musicalKey,

    durationSec:
      updatedBeat.durationSec,

    status:
      updatedBeat.status,
  }
}

export async function listAdminBeats() {
  const beats =
    await db.orm.public.Beat
      .all()

  const results = []

  for (const beat of beats) {
    const assets =
      await db.orm.public.BeatAsset
        .where({
          beatId: beat.id,
          active: true,
        })
        .all()

    const beatLicenses =
      await db.orm.public.BeatLicense
        .where({
          beatId: beat.id,
          active: true,
        })
        .all()

    const assetTypes =
      assets.map(
        (asset) => asset.type
      )

    const licenses = []

    for (const beatLicense of beatLicenses) {
      const licenseType =
        await db.orm.public.LicenseType
          .where({
            id:
              beatLicense.licenseTypeId,
          })
          .first()

      if (!licenseType) {
        continue
      }

      licenses.push({
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

    licenses.sort(
      (a, b) =>
        a.priceKobo - b.priceKobo
    )

    results.push({
      id: beat.publicId,

      title: beat.title,

      slug: beat.slug,

      producer:
        beat.producer,

      genre:
        beat.genre,

      mood:
        beat.mood,

      bpm:
        beat.bpm,

      key:
        beat.musicalKey,

      durationSec:
        beat.durationSec,

      status:
        beat.status,

      assets: {
        artwork:
          assetTypes.includes(
            'ARTWORK'
          ),

        preview:
          assetTypes.includes(
            'PREVIEW_MASTERED_TAGGED'
          ),

        mp3:
          assetTypes.includes(
            'MP3_UNMASTERED'
          ),

        wav:
          assetTypes.includes(
            'WAV_UNMASTERED'
          ),

        stems:
          assetTypes.includes(
            'STEMS_ZIP'
          ),
      },

      licenses,

      lowestPriceNGN:
        licenses.length > 0
          ? Math.min(
              ...licenses.map(
                (license) =>
                  license.priceNGN
              )
            )
          : null,

      createdAt:
        beat.createdAt,
    })
  }

  return results.sort(
    (a, b) =>
      String(b.createdAt)
        .localeCompare(
          String(a.createdAt)
        )
  )
}
