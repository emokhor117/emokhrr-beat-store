import {
  Check,
  ShieldCheck,
  X,
} from 'lucide-react'

const licenseDisplay = {
  basic: {
    badge: 'Starter',

    description:
      'For independent releases and smaller projects.',

    features: [
      'Unmastered MP3 file',
      'Instant delivery after purchase',
      'Up to 5,000 audio streams',
      'Up to 2,000 distributed copies',
      '1 music video',
      'Unlimited paid performances',
      'Limited radio broadcasting',
      'Non-exclusive license',
    ],
  },

  premium: {
    badge: 'Popular',

    description:
      'For growing releases that need higher usage limits.',

    features: [
      'Unmastered MP3 + WAV files',
      'Instant delivery after purchase',
      'Up to 50,000 audio streams',
      'Higher distribution allowance',
      'Multiple music videos',
      'Unlimited paid performances',
      'Expanded radio broadcasting',
      'Non-exclusive license',
    ],
  },

  trackout: {
    badge: 'Stems Included',

    description:
      'For artists and engineers who need full control of the mix.',

    features: [
      'Unmastered MP3 + WAV files',
      'Track stems included',
      'Instant delivery after purchase',
      'Commercial distribution permitted',
      'Music video use permitted',
      'Unlimited paid performances',
      'Radio broadcasting permitted',
      'Non-exclusive license',
    ],
  },

  unlimited: {
    badge: 'Best License',

    description:
      'Maximum usage rights under a non-exclusive license.',

    features: [
      'Unmastered MP3 + WAV files',
      'Track stems included',
      'Instant delivery after purchase',
      'Unlimited audio streams',
      'Unlimited distribution',
      'Unlimited music videos',
      'Unlimited paid performances',
      'Unlimited radio broadcasting',
      'Non-exclusive license',
    ],
  },
}

export default function LicenseModal({
  beat,
  licenses = [],
  selectedLicense,
  setSelectedLicense,
  onClose,
  onContinue,
}) {
  if (!beat) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-[28px] border border-white/[0.08] bg-[#0d0d10] shadow-2xl sm:max-w-6xl sm:rounded-[28px]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.07] bg-[#0d0d10]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Choose your license
            </p>

            <h2 className="mt-1 truncate text-xl font-semibold text-white sm:text-2xl">
              {beat.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/55 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close license selector"
          >
            <X
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          {/* BEAT SUMMARY */}
          <div className="mb-7 flex items-center gap-4">
            {beat.image ? (
              <img
                src={beat.image}
                alt={beat.title}
                className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-white/[0.05] sm:h-20 sm:w-20" />
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white sm:text-base">
                {beat.title}
              </p>

              <p className="mt-1 text-xs text-white/35">
                {beat.genre || 'Genre'}
                {beat.bpm
                  ? ` · ${beat.bpm} BPM`
                  : ''}
                {beat.key
                  ? ` · ${beat.key}`
                  : ''}
              </p>

              <p className="mt-1 text-[11px] text-white/25">
                Select the license that
                fits your release.
              </p>
            </div>
          </div>

          {/* LICENSES */}
          {licenses.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-10 text-center">
              <p className="text-sm font-medium text-white/60">
                No licenses currently
                available for this beat.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {licenses.map(
                (license) => {
                  const isSelected =
                    selectedLicense?.id ===
                    license.id

                  const display =
                    licenseDisplay[
                      license.code?.toLowerCase() ||
                        license.id?.toLowerCase()
                    ] || {
                      badge: null,
                      description:
                        license.description ||
                        'Commercial beat license.',
                      features: [
                        'Commercial use permitted',
                        'License terms apply',
                      ],
                    }

                  return (
                    <button
                      key={license.id}
                      type="button"
                      onClick={() =>
                        setSelectedLicense(
                          license
                        )
                      }
                      className={`relative flex h-full flex-col rounded-2xl border p-5 text-left transition duration-200 ${
                        isSelected
                          ? 'border-white bg-white text-black shadow-xl'
                          : 'border-white/[0.08] bg-white/[0.025] text-white hover:border-white/[0.18] hover:bg-white/[0.045]'
                      }`}
                    >
                      {/* TITLE / BADGE */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-lg font-semibold ${
                                isSelected
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            >
                              {
                                license.name
                              }
                            </h3>

                            {display.badge && (
                              <span
                                className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] ${
                                  isSelected
                                    ? 'bg-black/10 text-black/60'
                                    : 'bg-white/[0.07] text-white/45'
                                }`}
                              >
                                {
                                  display.badge
                                }
                              </span>
                            )}
                          </div>

                          <p
                            className={`mt-2 text-xs leading-5 ${
                              isSelected
                                ? 'text-black/55'
                                : 'text-white/35'
                            }`}
                          >
                            {
                              display.description
                            }
                          </p>
                        </div>

                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-black bg-black text-white'
                              : 'border-white/20'
                          }`}
                        >
                          {isSelected && (
                            <Check
                              size={12}
                              strokeWidth={
                                2.4
                              }
                            />
                          )}
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="mt-6">
                        <span
                          className={`text-2xl font-semibold tracking-[-0.03em] ${
                            isSelected
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        >
                          ₦
                          {license.priceNGN.toLocaleString(
                            'en-NG'
                          )}
                        </span>
                      </div>

                      {/* DIVIDER */}
                      <div
                        className={`my-5 border-t ${
                          isSelected
                            ? 'border-black/10'
                            : 'border-white/[0.07]'
                        }`}
                      />

                      {/* FEATURES */}
                      <ul className="space-y-3">
                        {display.features.map(
                          (feature) => (
                            <li
                              key={
                                feature
                              }
                              className={`flex items-start gap-2.5 text-xs leading-5 ${
                                isSelected
                                  ? 'text-black/65'
                                  : 'text-white/45'
                              }`}
                            >
                              <Check
                                size={
                                  14
                                }
                                strokeWidth={
                                  2
                                }
                                className={`mt-0.5 shrink-0 ${
                                  isSelected
                                    ? 'text-black'
                                    : 'text-white/65'
                                }`}
                              />

                              <span>
                                {
                                  feature
                                }
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </button>
                  )
                }
              )}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/60">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  License terms apply
                </p>

                <p className="mt-1 max-w-2xl text-[11px] leading-5 text-white/35">
                  Your selected license
                  determines your permitted
                  usage, distribution
                  limits, streaming limits
                  and included files.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinue}
              disabled={!selectedLicense}
              className="h-11 w-full rounded-full bg-white px-6 text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-white/20 sm:w-auto sm:min-w-[160px]"
            >
              {selectedLicense
                ? 'Add to cart'
                : 'Select a license'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}