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

  function handleSelectLicense(license) {
    if (license.available === false) {
      return
    }

    setSelectedLicense(license)
  }

  function handleContinue() {
    if (
      !selectedLicense ||
      selectedLicense.available === false
    ) {
      return
    }

    onContinue()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      {/* OVERLAY */}
      <button
        type="button"
        aria-label="Close license selection"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/80 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/[0.08] bg-[#0d0d10] text-white shadow-2xl sm:max-w-3xl sm:rounded-[28px]">
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/30">
              Choose a license
            </p>

            <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.02em] text-white">
              {beat.title}
            </h2>

            <p className="mt-1 text-[11px] text-white/30">
              {beat.producer}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close"
          >
            <X
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </header>

        {/* CONTENT */}
        <div className="overflow-y-auto p-5 sm:p-7">
          {licenses.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 text-center">
              <p className="text-sm font-medium text-white">
                No licenses available
              </p>

              <p className="mt-2 text-xs leading-5 text-white/35">
                This beat does not currently have any licenses available
                for purchase.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {licenses.map((license) => {
                const code =
                  license.code?.toLowerCase() ||
                  license.id?.toLowerCase()

                const display =
                  licenseDisplay[code] || {
                    badge: null,
                    description:
                      license.description ||
                      'Beat license',
                    features: [],
                  }

                const isAvailable =
                  license.available !== false

                const isSelected =
                  selectedLicense?.id ===
                    license.id ||
                  selectedLicense?.code ===
                    license.code

                return (
                  <button
                    key={
                      license.id ||
                      license.code
                    }
                    type="button"
                    disabled={!isAvailable}
                    onClick={() =>
                      handleSelectLicense(
                        license
                      )
                    }
                    className={[
                      'relative flex h-full flex-col rounded-2xl border p-4 text-left transition sm:p-5',

                      isSelected
                        ? 'border-white bg-white/[0.08]'
                        : 'border-white/[0.08] bg-white/[0.025]',

                      isAvailable
                        ? 'hover:border-white/[0.16] hover:bg-white/[0.045]'
                        : 'cursor-not-allowed opacity-40',
                    ].join(' ')}
                  >
                    {/* TOP */}
                    <div className="flex w-full items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">
                            {license.name}
                          </h3>

                          {display.badge &&
                            isAvailable && (
                              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40">
                                {
                                  display.badge
                                }
                              </span>
                            )}

                          {!isAvailable && (
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40">
                              Unavailable
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-[11px] leading-5 text-white/35">
                          {
                            display.description
                          }
                        </p>
                      </div>

                      {isSelected &&
                        isAvailable && (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black">
                            <Check
                              size={13}
                              strokeWidth={
                                2.4
                              }
                            />
                          </div>
                        )}
                    </div>

                    {/* PRICE */}
                    <div className="mt-5">
                      <span className="text-xl font-semibold tracking-[-0.03em] text-white">
                        ₦
                        {license.priceNGN.toLocaleString(
                          'en-NG'
                        )}
                      </span>
                    </div>

                    {/* FEATURES */}
                    {display.features.length >
                      0 && (
                      <div className="mt-5 flex-1 border-t border-white/[0.07] pt-4">
                        <ul className="space-y-2.5">
                          {display.features.map(
                            (feature) => (
                              <li
                                key={
                                  feature
                                }
                                className="flex items-start gap-2.5"
                              >
                                <Check
                                  size={13}
                                  strokeWidth={
                                    2
                                  }
                                  className="mt-0.5 shrink-0 text-white/40"
                                />

                                <span className="text-[10px] leading-4 text-white/40">
                                  {
                                    feature
                                  }
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* UNAVAILABLE MESSAGE */}
                    {!isAvailable && (
                      <div className="mt-5 border-t border-white/[0.07] pt-4">
                        <p className="text-[10px] leading-5 text-white/45">
                          Required beat
                          files are not
                          currently
                          available for
                          this license.
                        </p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* SECURITY NOTE */}
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
            <ShieldCheck
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-white/45"
            />

            <p className="text-[10px] leading-5 text-white/30">
              License availability,
              pricing and file
              entitlements are verified
              securely by the server
              before payment.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="shrink-0 border-t border-white/[0.07] bg-[#0d0d10] p-5 sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {selectedLicense &&
              selectedLicense.available !==
                false ? (
                <>
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/30">
                    Selected
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {
                      selectedLicense.name
                    }

                    <span className="ml-2 text-white/35">
                      ₦
                      {selectedLicense.priceNGN.toLocaleString(
                        'en-NG'
                      )}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-xs text-white/30">
                  Select an available
                  license to continue.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={
                !selectedLicense ||
                selectedLicense.available ===
                  false
              }
              onClick={handleContinue}
              className="h-11 rounded-full bg-white px-6 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/25"
            >
              Add to cart
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}