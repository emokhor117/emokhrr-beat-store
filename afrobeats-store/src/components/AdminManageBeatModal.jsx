import {
  Archive,
  Check,
  FileAudio,
  Image,
  LoaderCircle,
  Music2,
  PackageCheck,
  RefreshCw,
  Save,
  UploadCloud,
  Waves,
  X,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import { API_URL } from '../config/api'

const defaultPrices = {
  basic: 35000,
  premium: 70000,
  trackout: 85000,
  unlimited: 150000,
}

const licenseInfo = {
  basic: {
    name: 'Basic',
    description:
      'Entry-level MP3 license.',
  },

  premium: {
    name: 'Premium',
    description:
      'MP3 + WAV with higher usage.',
  },

  trackout: {
    name: 'Trackout',
    description:
      'MP3 + WAV + stems.',
  },

  unlimited: {
    name: 'Unlimited',
    description:
      'Maximum non-exclusive usage.',
  },
}

const assetConfig = [
  {
    type: 'ARTWORK',
    key: 'artwork',
    title: 'Artwork',
    description:
      'Square cover image used throughout the store.',
    accept:
      'image/jpeg,image/png,image/webp',
    icon: Image,
  },

  {
    type:
      'PREVIEW_MASTERED_TAGGED',
    key: 'preview',
    title: 'Store Preview',
    description:
      'Mastered, tagged version customers can preview.',
    accept:
      'audio/mpeg,audio/wav,audio/x-wav',
    icon: Waves,
  },

  {
    type: 'MP3_UNMASTERED',
    key: 'mp3',
    title: 'Unmastered MP3',
    description:
      'Purchase delivery file.',
    accept: 'audio/mpeg',
    icon: FileAudio,
  },

  {
    type: 'WAV_UNMASTERED',
    key: 'wav',
    title: 'Unmastered WAV',
    description:
      'High-quality purchase delivery file.',
    accept:
      'audio/wav,audio/x-wav',
    icon: FileAudio,
  },

  {
    type: 'STEMS_ZIP',
    key: 'stems',
    title: 'Track Stems',
    description:
      'ZIP containing individual stems.',
    accept:
      '.zip,application/zip',
    icon: Archive,
  },
]

export default function AdminManageBeatModal({
  beat,
  isOpen,
  onClose,
  onUpdated,
}) {
  const [activeTab, setActiveTab] =
    useState('details')

  const [form, setForm] =
    useState({
      title: '',
      producer: '',
      genre: '',
      mood: '',
      bpm: '',
      key: '',
      durationSec: '',
    })

  const [prices, setPrices] =
    useState(defaultPrices)

  const [assets, setAssets] =
    useState({})

  const [
    uploadingAsset,
    setUploadingAsset,
  ] = useState(null)

  const [isSaving, setIsSaving] =
    useState(false)

  const [
    isSavingPrices,
    setIsSavingPrices,
  ] = useState(false)

  const [
    isUpdatingStatus,
    setIsUpdatingStatus,
  ] = useState(false)

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')

  const token =
    sessionStorage.getItem(
      'emokhrr_admin_token'
    )

  useEffect(() => {
    if (!beat) {
      return
    }

    setForm({
      title:
        beat.title || '',

      producer:
        beat.producer ||
        'EMOKHRR',

      genre:
        beat.genre || '',

      mood:
        beat.mood || '',

      bpm:
        beat.bpm ?? '',

      key:
        beat.key || '',

      durationSec:
        beat.durationSec ??
        '',
    })

    setAssets(
      beat.assets || {}
    )

    const nextPrices = {
      ...defaultPrices,
    }

    for (
      const license
      of beat.licenses || []
    ) {
      if (
        nextPrices[
          license.code
        ] !== undefined
      ) {
        nextPrices[
          license.code
        ] =
          license.priceNGN
      }
    }

    setPrices(nextPrices)

    setActiveTab('details')
    setError('')
    setMessage('')
  }, [beat])

  if (!isOpen || !beat) {
    return null
  }

  function updateField(
    field,
    value
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function showSuccess(text) {
    setError('')
    setMessage(text)
  }

  function showError(text) {
    setMessage('')
    setError(text)
  }

  async function saveDetails() {
    try {
      setIsSaving(true)
      setError('')
      setMessage('')

      const response = await fetch(
        `${API_URL}/api/admin/beats/${encodeURIComponent(
          beat.id
        )}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title:
              form.title.trim(),

            producer:
              form.producer.trim(),

            genre:
              form.genre.trim() ||
              null,

            mood:
              form.mood.trim() ||
              null,

            bpm:
              form.bpm === ''
                ? null
                : Number(
                    form.bpm
                  ),

            musicalKey:
              form.key.trim() ||
              null,

            durationSec:
              form.durationSec ===
              ''
                ? null
                : Number(
                    form.durationSec
                  ),
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to save beat'
        )
      }

      showSuccess(
        'Beat details saved.'
      )

      await onUpdated()
    } catch (error) {
      console.error(
        'Beat update failed:',
        error
      )

      showError(
        error.message ||
          'Unable to save beat'
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function savePrices() {
    try {
      setIsSavingPrices(true)
      setError('')
      setMessage('')

      const licenses =
        Object.entries(
          prices
        ).map(
          ([
            code,
            priceNGN,
          ]) => ({
            code,
            priceNGN:
              Number(
                priceNGN
              ),
          })
        )

      const response = await fetch(
        `${API_URL}/api/admin/beats/${encodeURIComponent(
          beat.id
        )}/licenses`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify({
              licenses,
            }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to save license prices'
        )
      }

      showSuccess(
        'License pricing saved.'
      )

      await onUpdated()
    } catch (error) {
      console.error(
        'License pricing update failed:',
        error
      )

      showError(
        error.message ||
          'Unable to save license pricing'
      )
    } finally {
      setIsSavingPrices(false)
    }
  }

  async function uploadAsset(
    asset,
    file
  ) {
    if (!file) {
      return
    }

    try {
      setUploadingAsset(
        asset.type
      )

      setError('')
      setMessage('')

      const formData =
        new FormData()

      formData.append(
        'assetType',
        asset.type
      )

      formData.append(
        'file',
        file
      )

      const response = await fetch(
        `${API_URL}/api/admin/beats/${encodeURIComponent(
          beat.id
        )}/assets`,
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to upload ${asset.title}`
        )
      }

      setAssets(
        (current) => ({
          ...current,
          [asset.key]: true,
        })
      )

      showSuccess(
        `${asset.title} uploaded successfully.`
      )

      await onUpdated()
    } catch (error) {
      console.error(
        'Asset upload failed:',
        error
      )

      showError(
        error.message ||
          'Asset upload failed'
      )
    } finally {
      setUploadingAsset(
        null
      )
    }
  }

  async function updateStatus(
    status
  ) {
    try {
      setIsUpdatingStatus(
        true
      )

      setError('')
      setMessage('')

      const response = await fetch(
        `${API_URL}/api/admin/beats/${encodeURIComponent(
          beat.id
        )}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to update status'
        )
      }

      showSuccess(
        status === 'ACTIVE'
          ? 'Beat published successfully.'
          : status === 'ARCHIVED'
            ? 'Beat archived.'
            : 'Beat returned to draft.'
      )

      await onUpdated()
    } catch (error) {
      console.error(
        'Status update failed:',
        error
      )

      showError(
        error.message ||
          'Unable to update beat status'
      )
    } finally {
      setIsUpdatingStatus(
        false
      )
    }
  }

  const tabs = [
    {
      id: 'details',
      label: 'Details',
    },
    {
      id: 'pricing',
      label: 'Pricing',
    },
    {
      id: 'assets',
      label: 'Assets',
    },
    {
      id: 'publish',
      label: 'Publish',
    },
  ]

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-5">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close beat manager"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-[#24163d]/35 backdrop-blur-md"
      />

      {/* WORKSPACE */}
      <div className="relative z-10 flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-[30px] border border-[#d2c5f5] bg-[#f9f7ff] shadow-[0_30px_100px_rgba(57,35,99,0.3)] sm:max-w-5xl sm:rounded-[30px]">
        {/* HEADER */}
        <header className="shrink-0 border-b border-[#ded5f5] bg-[#f9f7ff]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6236ff] to-[#ff9d42] text-white shadow-lg">
                <Music2
                  size={20}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8d8298]">
                  Manage Beat
                </p>

                <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.02em] text-[#18141f]">
                  {beat.title}
                </h2>

                <p className="mt-1 truncate text-[10px] text-[#8b8294]">
                  {beat.id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d5ccef] bg-white text-[#766d82] transition hover:border-[#b7a5f4] hover:text-[#6236ff]"
            >
              <X
                size={18}
              />
            </button>
          </div>

          {/* TABS */}
          <nav className="mt-5 flex gap-1 overflow-x-auto rounded-2xl bg-[#eee9ff] p-1.5">
            {tabs.map(
              (tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.id
                    )
                  }
                  className={[
                    'min-w-fit flex-1 rounded-xl px-4 py-2.5 text-[10px] font-semibold transition',
                    activeTab ===
                    tab.id
                      ? 'bg-white text-[#6236ff] shadow-sm'
                      : 'text-[#82778d] hover:text-[#24163d]',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            )}
          </nav>
        </header>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {/* MESSAGES */}
          {message && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <Check
                size={15}
                className="text-emerald-600"
              />

              <p className="text-xs text-emerald-700">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs leading-5 text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* DETAILS */}
          {activeTab ===
            'details' && (
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8d8298]">
                  Metadata
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#18141f]">
                  Beat details
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Title"
                  value={
                    form.title
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      'title',
                      value
                    )
                  }
                />

                <Field
                  label="Producer"
                  value={
                    form.producer
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      'producer',
                      value
                    )
                  }
                />

                <Field
                  label="Genre"
                  value={
                    form.genre
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      'genre',
                      value
                    )
                  }
                />

                <Field
                  label="Mood"
                  value={
                    form.mood
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      'mood',
                      value
                    )
                  }
                />

                <Field
                  label="BPM"
                  type="number"
                  value={
                    form.bpm
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      'bpm',
                      value
                    )
                  }
                />

                <Field
                  label="Musical Key"
                  value={
                    form.key
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      'key',
                      value
                    )
                  }
                />

                <Field
                  label="Duration (seconds)"
                  type="number"
                  value={
                    form.durationSec
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      'durationSec',
                      value
                    )
                  }
                />
              </div>

              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  onClick={
                    saveDetails
                  }
                  disabled={
                    isSaving
                  }
                  className="flex h-11 items-center gap-2 rounded-full bg-[#6236ff] px-6 text-[10px] font-semibold text-white shadow-[0_8px_24px_rgba(98,54,255,0.24)] transition hover:bg-[#5127e8] disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Save
                      size={14}
                    />
                  )}

                  Save details
                </button>
              </div>
            </section>
          )}

          {/* PRICING */}
          {activeTab ===
            'pricing' && (
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8d8298]">
                  Licensing
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#18141f]">
                  License pricing
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#7d7488]">
                  Prices entered
                  here are stored
                  by the backend
                  in kobo and used
                  as the
                  authoritative
                  checkout price.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(
                  prices
                ).map(
                  ([
                    code,
                    price,
                  ]) => {
                    const info =
                      licenseInfo[
                        code
                      ]

                    return (
                      <div
                        key={
                          code
                        }
                        className="rounded-[22px] border border-[#dcd3f2] bg-white p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-[#24163d]">
                              {
                                info.name
                              }
                            </h4>

                            <p className="mt-1 text-[10px] leading-5 text-[#8b8293]">
                              {
                                info.description
                              }
                            </p>
                          </div>

                          <span className="rounded-full bg-[#eee9ff] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#6236ff]">
                            {
                              code
                            }
                          </span>
                        </div>

                        <div className="mt-5 flex items-center rounded-2xl border border-[#d7cff0] bg-[#faf9ff] px-4">
                          <span className="text-sm font-semibold text-[#746b80]">
                            ₦
                          </span>

                          <input
                            type="number"
                            min="1"
                            value={
                              price
                            }
                            onChange={(
                              event
                            ) =>
                              setPrices(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  [code]:
                                    event
                                      .target
                                      .value,
                                })
                              )
                            }
                            className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-[#18141f] outline-none"
                          />
                        </div>
                      </div>
                    )
                  }
                )}
              </div>

              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  onClick={
                    savePrices
                  }
                  disabled={
                    isSavingPrices
                  }
                  className="flex h-11 items-center gap-2 rounded-full bg-[#6236ff] px-6 text-[10px] font-semibold text-white shadow-[0_8px_24px_rgba(98,54,255,0.24)] transition hover:bg-[#5127e8] disabled:opacity-50"
                >
                  {isSavingPrices ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Save
                      size={14}
                    />
                  )}

                  Save pricing
                </button>
              </div>
            </section>
          )}

          {/* ASSETS */}
          {activeTab ===
            'assets' && (
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8d8298]">
                  Delivery
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#18141f]">
                  Beat assets
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#7d7488]">
                  Upload the
                  public artwork
                  and preview plus
                  the private files
                  customers receive
                  after purchase.
                </p>
              </div>

              <div className="space-y-3">
                {assetConfig.map(
                  (asset) => {
                    const Icon =
                      asset.icon

                    const ready =
                      Boolean(
                        assets[
                          asset.key
                        ]
                      )

                    const loading =
                      uploadingAsset ===
                      asset.type

                    return (
                      <article
                        key={
                          asset.type
                        }
                        className="flex flex-col gap-4 rounded-[22px] border border-[#dcd3f2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={[
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                              ready
                                ? 'bg-[#ddd2ff] text-[#6236ff]'
                                : 'bg-[#f2eff7] text-[#92899d]',
                            ].join(
                              ' '
                            )}
                          >
                            <Icon
                              size={
                                18
                              }
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-semibold text-[#24163d]">
                                {
                                  asset.title
                                }
                              </h4>

                              {ready ? (
                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-700">
                                  Ready
                                </span>
                              ) : (
                                <span className="rounded-full bg-orange-100 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-orange-700">
                                  Missing
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-[10px] leading-5 text-[#8a8195]">
                              {
                                asset.description
                              }
                            </p>
                          </div>
                        </div>

                        <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#cfc3f2] bg-[#faf9ff] px-4 text-[9px] font-semibold text-[#6236ff] transition hover:bg-[#eee9ff]">
                          {loading ? (
                            <LoaderCircle
                              size={
                                13
                              }
                              className="animate-spin"
                            />
                          ) : (
                            <UploadCloud
                              size={
                                13
                              }
                            />
                          )}

                          {loading
                            ? 'Uploading...'
                            : ready
                              ? 'Replace'
                              : 'Upload'}

                          <input
                            type="file"
                            accept={
                              asset.accept
                            }
                            disabled={
                              loading
                            }
                            className="hidden"
                            onChange={(
                              event
                            ) => {
                              const file =
                                event
                                  .target
                                  .files?.[0]

                              uploadAsset(
                                asset,
                                file
                              )

                              event.target.value =
                                ''
                            }}
                          />
                        </label>
                      </article>
                    )
                  }
                )}
              </div>
            </section>
          )}

          {/* PUBLISH */}
          {activeTab ===
            'publish' && (
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8d8298]">
                  Store Status
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#18141f]">
                  Publishing
                </h3>
              </div>

              <div className="rounded-[26px] border border-[#d8cef2] bg-gradient-to-br from-[#eee9ff] to-[#faf9ff] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6236ff] text-white">
                  <PackageCheck
                    size={20}
                  />
                </div>

                <h4 className="mt-5 text-lg font-semibold text-[#24163d]">
                  Current status:{' '}
                  {beat.status}
                </h4>

                <p className="mt-2 max-w-xl text-xs leading-6 text-[#7b7287]">
                  Publishing is
                  validated by the
                  backend. Artwork,
                  preview, pricing
                  and at least one
                  deliverable
                  license must be
                  configured.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {beat.status !==
                    'ACTIVE' && (
                    <button
                      type="button"
                      disabled={
                        isUpdatingStatus
                      }
                      onClick={() =>
                        updateStatus(
                          'ACTIVE'
                        )
                      }
                      className="flex h-11 items-center gap-2 rounded-full bg-[#6236ff] px-5 text-[10px] font-semibold text-white shadow-[0_8px_24px_rgba(98,54,255,0.24)] transition hover:bg-[#5127e8]"
                    >
                      Publish beat
                    </button>
                  )}

                  {beat.status !==
                    'DRAFT' && (
                    <button
                      type="button"
                      disabled={
                        isUpdatingStatus
                      }
                      onClick={() =>
                        updateStatus(
                          'DRAFT'
                        )
                      }
                      className="h-11 rounded-full border border-[#d2c7ef] bg-white px-5 text-[10px] font-semibold text-[#655b74]"
                    >
                      Return to draft
                    </button>
                  )}

                  {beat.status !==
                    'ARCHIVED' && (
                    <button
                      type="button"
                      disabled={
                        isUpdatingStatus
                      }
                      onClick={() =>
                        updateStatus(
                          'ARCHIVED'
                        )
                      }
                      className="h-11 rounded-full border border-orange-200 bg-orange-50 px-5 text-[10px] font-semibold text-orange-700"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}) {
  return (
    <div>
      <label className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
      />
    </div>
  )
}