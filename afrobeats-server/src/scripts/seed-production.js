import 'dotenv/config'
import { db } from '../prisma/db.js'

async function seedProduction() {
  console.log(
    'Starting EMOKHRR Beats production bootstrap...'
  )

  // ============================================================
  // LICENSE TYPES
  // ============================================================

  const basic =
    await db.orm.public.LicenseType.upsert({
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

  const premium =
    await db.orm.public.LicenseType.upsert({
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

  const trackout =
    await db.orm.public.LicenseType.upsert({
      create: {
        code: 'trackout',
        name: 'Trackout',
        description:
          'Non-exclusive license with MP3, WAV and trackout/stem delivery.',
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
          'Non-exclusive license with MP3, WAV and trackout/stem delivery.',
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

  const unlimited =
    await db.orm.public.LicenseType.upsert({
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

  console.log('✓ License types ready')

  // ============================================================
  // LICENSE → DOWNLOAD ENTITLEMENTS
  // ============================================================

  const grants = [
    // BASIC
    {
      licenseTypeId: basic.id,
      assetType: 'MP3_UNMASTERED',
    },

    // PREMIUM
    {
      licenseTypeId: premium.id,
      assetType: 'MP3_UNMASTERED',
    },
    {
      licenseTypeId: premium.id,
      assetType: 'WAV_UNMASTERED',
    },

    // TRACKOUT
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

    // UNLIMITED
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
        licenseTypeId:
          grant.licenseTypeId,
        assetType: grant.assetType,
      },
    })
  }

  console.log(
    '✓ License download entitlements ready'
  )

  // ============================================================
  // COMPLETE
  // ============================================================

  console.log('')
  console.log(
    'EMOKHRR Beats production bootstrap completed.'
  )
  console.log(
    'No demo beats, customers, orders or payments were created.'
  )
}

seedProduction()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(
      'Production bootstrap failed:'
    )
    console.error(error)
    process.exit(1)
  })