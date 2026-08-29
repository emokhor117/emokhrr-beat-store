import 'dotenv/config'
import { db } from '../prisma/db.js'

async function seed() {
  console.log('Starting EMOKHRR Beats seed...')

  // ----------------------------
  // LICENSE TYPES
  // ----------------------------

  const basic = await db.orm.public.LicenseType.upsert({
    create: {
      code: 'basic',
      name: 'Basic',
      description:
        'Entry-level non-exclusive license with MP3 delivery.',
      terms: {
        nonExclusive: true,
        streamLimit: 5000,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 1,
    },
    update: {
      name: 'Basic',
      description:
        'Entry-level non-exclusive license with MP3 delivery.',
      terms: {
        nonExclusive: true,
        streamLimit: 5000,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 1,
    },
    conflictOn: {
      code: 'basic',
    },
  })

  const premium = await db.orm.public.LicenseType.upsert({
    create: {
      code: 'premium',
      name: 'Premium',
      description:
        'Expanded non-exclusive license with MP3 and WAV delivery.',
      terms: {
        nonExclusive: true,
        streamLimit: 50000,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 2,
    },
    update: {
      name: 'Premium',
      description:
        'Expanded non-exclusive license with MP3 and WAV delivery.',
      terms: {
        nonExclusive: true,
        streamLimit: 50000,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 2,
    },
    conflictOn: {
      code: 'premium',
    },
  })

  const trackout = await db.orm.public.LicenseType.upsert({
    create: {
      code: 'trackout',
      name: 'Trackout',
      description:
        'Premium usage rights with MP3, WAV and trackout/stem delivery.',
      terms: {
        nonExclusive: true,
        streamLimit: 50000,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 3,
    },
    update: {
      name: 'Trackout',
      description:
        'Premium usage rights with MP3, WAV and trackout/stem delivery.',
      terms: {
        nonExclusive: true,
        streamLimit: 50000,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 3,
    },
    conflictOn: {
      code: 'trackout',
    },
  })

  const unlimited = await db.orm.public.LicenseType.upsert({
    create: {
      code: 'unlimited',
      name: 'Unlimited',
      description:
        'Highest non-exclusive tier with unrestricted streaming and full delivery assets.',
      terms: {
        nonExclusive: true,
        streamLimit: null,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 4,
    },
    update: {
      name: 'Unlimited',
      description:
        'Highest non-exclusive tier with unrestricted streaming and full delivery assets.',
      terms: {
        nonExclusive: true,
        streamLimit: null,
        creditRequired: true,
        creditText: 'Prod. EMOKHRR',
      },
      active: true,
      sortOrder: 4,
    },
    conflictOn: {
      code: 'unlimited',
    },
  })

  console.log('✓ License types seeded')

  // ----------------------------
  // LICENSE → FILE PERMISSIONS
  // ----------------------------

  const grants = [
    {
      licenseTypeId: basic.id,
      assetType: 'MP3_UNMASTERED',
    },

    {
      licenseTypeId: premium.id,
      assetType: 'MP3_UNMASTERED',
    },
    {
      licenseTypeId: premium.id,
      assetType: 'WAV_UNMASTERED',
    },

    {
      licenseTypeId: trackout.id,
      assetType: 'MP3_UNMASTERED',
    },
    {
      licenseTypeId: trackout.id,
      assetType: 'WAV_UNMASTERED',
    },
    {
      licenseTypeId: trackout.id,
      assetType: 'STEMS_ZIP',
    },

    {
      licenseTypeId: unlimited.id,
      assetType: 'MP3_UNMASTERED',
    },
    {
      licenseTypeId: unlimited.id,
      assetType: 'WAV_UNMASTERED',
    },
    {
      licenseTypeId: unlimited.id,
      assetType: 'STEMS_ZIP',
    },
  ]

  for (const grant of grants) {
    await db.orm.public.LicenseAssetGrant.upsert({
      create: grant,
      update: {},
      conflictOn: {
        licenseTypeId: grant.licenseTypeId,
        assetType: grant.assetType,
      },
    })
  }

  console.log('✓ License asset permissions seeded')

  // ----------------------------
  // INITIAL BEATS
  // ----------------------------

  const beatData = [
    {
      publicId: 'beat_001',
      title: 'Midnight Motion',
      slug: 'midnight-motion',
      producer: 'EMOKHRR',
      genre: 'Dark R&B',
      mood: 'Dark',
      bpm: 98,
      musicalKey: 'F# Minor',
      durationSec: 174,
      status: 'ACTIVE',
    },
    {
      publicId: 'beat_002',
      title: 'No Pressure',
      slug: 'no-pressure',
      producer: 'EMOKHRR',
      genre: 'Afro-Fusion',
      mood: 'Chill',
      bpm: 104,
      musicalKey: 'C Minor',
      durationSec: 192,
      status: 'ACTIVE',
    },
    {
      publicId: 'beat_003',
      title: 'After Hours',
      slug: 'after-hours',
      producer: 'EMOKHRR',
      genre: 'Afrobeats',
      mood: 'Melodic',
      bpm: 112,
      musicalKey: 'A Minor',
      durationSec: 220,
      status: 'ACTIVE',
    },
  ]

  const seededBeats = []

  for (const beat of beatData) {
    const storedBeat = await db.orm.public.Beat.upsert({
      create: beat,
      update: {
        title: beat.title,
        slug: beat.slug,
        producer: beat.producer,
        genre: beat.genre,
        mood: beat.mood,
        bpm: beat.bpm,
        musicalKey: beat.musicalKey,
        durationSec: beat.durationSec,
        status: beat.status,
      },
      conflictOn: {
        publicId: beat.publicId,
      },
    })

    seededBeats.push(storedBeat)
  }

  console.log('✓ Beats seeded')

  // ----------------------------
  // BEAT PRICING
  // ----------------------------

  for (const beat of seededBeats) {
    const pricing = [
      {
        licenseTypeId: basic.id,
        priceKobo: 35000 * 100,
      },
      {
        licenseTypeId: premium.id,
        priceKobo: 70000 * 100,
      },
      {
        licenseTypeId: trackout.id,
        priceKobo: 85000 * 100,
      },
      {
        licenseTypeId: unlimited.id,
        priceKobo: 150000 * 100,
      },
    ]

    for (const price of pricing) {
      await db.orm.public.BeatLicense.upsert({
        create: {
          beatId: beat.id,
          licenseTypeId: price.licenseTypeId,
          priceKobo: price.priceKobo,
          active: true,
        },
        update: {
          priceKobo: price.priceKobo,
          active: true,
        },
        conflictOn: {
          beatId: beat.id,
          licenseTypeId: price.licenseTypeId,
        },
      })
    }
  }

  console.log('✓ Beat pricing seeded')

  console.log('')
  console.log('EMOKHRR Beats database seed completed.')
}

seed().catch((error) => {
  console.error('Seed failed:')
  console.error(error)
  process.exit(1)
})