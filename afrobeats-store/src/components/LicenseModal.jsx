import {
  Check,
  ShieldCheck,
  X,
} from 'lucide-react'

import {
  FontAwesomeIcon,
} from '@fortawesome/react-fontawesome'

import {
  faCompactDisc,
  faCrown,
  faLayerGroup,
  faMusic,
} from '@fortawesome/free-solid-svg-icons'

const licenseDisplay = {
  basic: {
    badge: 'Starter',
    icon: faMusic,
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
    icon: faCompactDisc,
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
    icon: faLayerGroup,
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
    icon: faCrown,
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
        className="absolute inset-0 h-full w-full bg-[#18202d]/35 backdrop-blur-[8px]"
      />

      {/* MODAL */}
      <div className="relative z-10 flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[32px] border border-white/80 bg-[#f4f7fc]/95 text-[#18202d] shadow-[0_35px_100px_rgba(34,48,70,0.22)] backdrop-blur-2xl sm:max-w-[900px] sm:rounded-[32px]">
        {/* DECORATIVE GLOW */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d9d5ff]/55 blur-[80px]" />

        <div className="pointer-events-none absolute -left-24 top-[40%] h-64 w-64 rounded-full bg-[#ccecf5]/40 blur-[90px]" />

        {/* HEADER */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-[#18202d]/[0.06] px-5 py-5 sm:px-7 sm:py-6">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8c97a8]">
              Choose your license
            </p>

            <h2 className="mt-1.5 truncate text-xl font-extrabold tracking-[-0.035em] text-[#18202d] sm:text-2xl">
              {beat.title}
            </h2>

            <p className="mt-1 text-[10px] font-semibold text-[#909aaa]">
              {beat.producer}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#18202d]/[0.07] bg-white/65 text-[#7d899a] shadow-sm transition hover:border-[#18202d]/15 hover:bg-white hover:text-[#18202d]"
            aria-label="Close"
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </header>

        {/* CONTENT */}
        <div className="relative overflow-y-auto p-5 sm:p-7">
          {licenses.length === 0 ? (
            <div className="rounded-[22px] border border-[#18202d]/[0.07] bg-white/55 p-10 text-center shadow-sm">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#e7e9ff] text-[#646b91]">
                <FontAwesomeIcon
                  icon={faMusic}
                  className="text-sm"
                />
              </div>

              <p className="mt-4 text-sm font-bold text-[#18202d]">
                No licenses available
              </p>

              <p className="mx-auto mt-2 max-w-[330px] text-[10px] leading-5 text-[#8b96a7]">
                This beat does not currently
                have any licenses available
                for purchase.
              </p>
            </div>
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2">
              {licenses.map((license) => {
                const code =
                  license.code?.toLowerCase() ||
                  license.id?.toLowerCase()

                const display =
                  licenseDisplay[code] || {
                    badge: null,
                    icon: faMusic,
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
                      'group relative flex h-full flex-col overflow-hidden rounded-[24px] border p-5 text-left transition duration-300',

                      isSelected
                        ? 'border-[#7f7ac7]/45 bg-[#ececff] shadow-[0_18px_45px_rgba(104,101,170,0.13)]'
                        : 'border-white/90 bg-white/60 shadow-[0_10px_30px_rgba(42,57,80,0.045)]',

                      isAvailable
                        ? 'hover:-translate-y-0.5 hover:border-[#aaa7e5]/60 hover:bg-white/90 hover:shadow-[0_18px_45px_rgba(42,57,80,0.09)]'
                        : 'cursor-not-allowed opacity-40',
                    ].join(' ')}
                  >
                    {/* SELECTED GLOW */}
                    {isSelected &&
                      isAvailable && (
                        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#bbb6ff]/25 blur-3xl" />
                      )}

                    {/* TOP */}
                    <div className="relative flex w-full items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        {/* LICENSE ICON */}
                        <div
                          className={[
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition',

                            isSelected
                              ? 'bg-[#18202d] text-white'
                              : 'bg-[#edf0f6] text-[#69758a] group-hover:bg-[#e8e7ff] group-hover:text-[#65618f]',
                          ].join(' ')}
                        >
                          <FontAwesomeIcon
                            icon={
                              display.icon
                            }
                            className="text-[13px]"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[13px] font-extrabold tracking-[-0.02em] text-[#18202d]">
                              {license.name}
                            </h3>

                            {display.badge &&
                              isAvailable && (
                                <span
                                  className={[
                                    'rounded-full px-2 py-1 text-[7px] font-extrabold uppercase tracking-[0.1em]',

                                    isSelected
                                      ? 'bg-white/70 text-[#66638b]'
                                      : 'bg-[#eef0f5] text-[#8b95a5]',
                                  ].join(
                                    ' '
                                  )}
                                >
                                  {
                                    display.badge
                                  }
                                </span>
                              )}

                            {!isAvailable && (
                              <span className="rounded-full bg-[#eef0f5] px-2 py-1 text-[7px] font-extrabold uppercase tracking-[0.1em] text-[#939caa]">
                                Unavailable
                              </span>
                            )}
                          </div>

                          <p className="mt-2 max-w-[280px] text-[9px] font-medium leading-[17px] text-[#8792a3]">
                            {
                              display.description
                            }
                          </p>
                        </div>
                      </div>

                      {/* SELECTED CHECK */}
                      <div
                        className={[
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition',

                          isSelected &&
                          isAvailable
                            ? 'border-[#18202d] bg-[#18202d] text-white'
                            : 'border-[#18202d]/10 bg-white/40 text-transparent',
                        ].join(' ')}
                      >
                        <Check
                          size={12}
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="relative mt-6">
                      <span className="text-[10px] font-bold text-[#9aa4b2]">
                        ₦
                      </span>

                      <span className="ml-1 text-[24px] font-extrabold tracking-[-0.045em] text-[#18202d]">
                        {license.priceNGN.toLocaleString(
                          'en-NG'
                        )}
                      </span>
                    </div>

                    {/* FEATURES */}
                    {display.features.length >
                      0 && (
                      <div className="relative mt-5 flex-1 border-t border-[#18202d]/[0.06] pt-4">
                        <ul className="grid gap-2.5">
                          {display.features.map(
                            (feature) => (
                              <li
                                key={
                                  feature
                                }
                                className="flex items-start gap-2.5"
                              >
                                <div
                                  className={[
                                    'mt-[2px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full',

                                    isSelected
                                      ? 'bg-[#d8d5ff] text-[#555176]'
                                      : 'bg-[#edf0f5] text-[#788496]',
                                  ].join(
                                    ' '
                                  )}
                                >
                                  <Check
                                    size={9}
                                    strokeWidth={
                                      2.5
                                    }
                                  />
                                </div>

                                <span className="text-[9px] font-medium leading-4 text-[#788496]">
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

                    {/* UNAVAILABLE */}
                    {!isAvailable && (
                      <div className="relative mt-5 border-t border-[#18202d]/[0.06] pt-4">
                        <p className="text-[9px] font-medium leading-5 text-[#8d97a6]">
                          Required beat files
                          are not currently
                          available for this
                          license.
                        </p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* SECURITY */}
          <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-white/80 bg-white/45 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e7e9ff] text-[#68658d]">
              <ShieldCheck
                size={14}
                strokeWidth={1.9}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold text-[#536074]">
                Secure licensing
              </p>

              <p className="mt-1 text-[9px] font-medium leading-4 text-[#909aaa]">
                License availability,
                pricing and file
                entitlements are verified
                securely by the server
                before payment.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="relative shrink-0 border-t border-[#18202d]/[0.06] bg-white/55 p-5 backdrop-blur-xl sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {selectedLicense &&
              selectedLicense.available !==
                false ? (
                <>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa4b2]">
                    Selected license
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    <p className="text-[12px] font-extrabold text-[#18202d]">
                      {
                        selectedLicense.name
                      }
                    </p>

                    <span className="h-1 w-1 rounded-full bg-[#b0b7c2]" />

                    <p className="text-[11px] font-bold text-[#758195]">
                      ₦
                      {selectedLicense.priceNGN.toLocaleString(
                        'en-NG'
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa4b2]">
                    Your license
                  </p>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#7f8a9b]">
                    Select an available
                    license to continue.
                  </p>
                </>
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
              className="group flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#18202d] px-7 text-[10px] font-bold text-white shadow-[0_12px_30px_rgba(24,32,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#273246] hover:shadow-[0_16px_35px_rgba(24,32,45,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#dfe3ea] disabled:text-[#a3abb7] disabled:shadow-none"
            >
              Add to cart

              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}