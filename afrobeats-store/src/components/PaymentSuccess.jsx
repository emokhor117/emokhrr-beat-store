import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  FileArchive,
  FileAudio,
  LoaderCircle,
  LockKeyhole,
  Music2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import logo from '../assets/emokkhor-logo.png'

import { API_URL } from '../config/api'

const assetLabels = {
  MP3_UNMASTERED: {
    title: 'MP3',
    description: 'Unmastered MP3',
    icon: FileAudio,
  },

  WAV_UNMASTERED: {
    title: 'WAV',
    description: 'Unmastered WAV',
    icon: FileAudio,
  },

  STEMS_ZIP: {
    title: 'Track Stems',
    description: 'Individual track stems',
    icon: FileArchive,
  },
}

export default function PaymentSuccess() {
  const [status, setStatus] =
    useState('loading')

  const [downloads, setDownloads] =
    useState([])

  const [orderStatus, setOrderStatus] =
    useState(null)

  const [message, setMessage] =
    useState('Confirming your payment...')

  const params =
    new URLSearchParams(
      window.location.search
    )

  const orderNumber =
    params.get('order')

  const loadDownloads =
    useCallback(async () => {
      if (!orderNumber) {
        setStatus('error')
        setMessage(
          'No order number was provided.'
        )
        return
      }

      const accessToken =
        sessionStorage.getItem(
          `order_access_${orderNumber}`
        )

      if (!accessToken) {
        setStatus('missing-token')

        setMessage(
          'Your secure order access token is not available in this browser session.'
        )

        return
      }

      try {
        setStatus('loading')

        setMessage(
          'Confirming your payment...'
        )

        const response = await fetch(
          `${API_URL}/api/orders/${encodeURIComponent(
            orderNumber
          )}/downloads`,
          {
            headers: {
              'x-order-access-token':
                accessToken,
            },
          }
        )

        const data =
          await response.json()

        if (!response.ok) {
          /*
           * Paystack may redirect the browser
           * before the webhook has finished
           * marking the order PAID.
           */
          if (
            response.status === 403 &&
            data?.message ===
              'Order is not paid'
          ) {
            setStatus('processing')

            setMessage(
              'Your payment was received. We are finishing verification now.'
            )

            return
          }

          if (
            response.status === 403 &&
            data?.message ===
              'No download grants found'
          ) {
            setStatus('processing')

            setMessage(
              'Your payment is verified. Your downloads are being prepared.'
            )

            return
          }

          if (
            response.status === 403 &&
            data?.message ===
              'No active downloads are available'
          ) {
            setStatus('expired')

            setMessage(
              'There are no active downloads available for this order.'
            )

            return
          }

          if (response.status === 403) {
            throw new Error(
              'This browser is not authorized to access this order.'
            )
          }

          throw new Error(
            data?.message ||
              'Unable to load your downloads.'
          )
        }

        setDownloads(
          Array.isArray(data.downloads)
            ? data.downloads
            : []
        )

        setOrderStatus(
          data.status || null
        )

        setStatus('success')

        setMessage(
          'Your files are ready to download.'
        )
      } catch (error) {
        console.error(
          'Download retrieval failed:',
          error
        )

        setStatus('error')

        setMessage(
          error.message ||
            'Unable to retrieve your purchase.'
        )
      }
    }, [orderNumber])

  useEffect(() => {
    loadDownloads()
  }, [loadDownloads])

  /*
   * Group files by purchased beat.
   *
   * This also supports checkout orders
   * containing multiple beats.
   */
  const groupedDownloads =
    downloads.reduce(
      (groups, download) => {
        const key = download.beatId

        if (!groups[key]) {
          groups[key] = {
            beatId: download.beatId,
            beatTitle:
              download.beatTitle,
            licenseCode:
              download.licenseCode,
            licenseName:
              download.licenseName,
            files: [],
          }
        }

        groups[key].files.push(
          download
        )

        return groups
      },
      {}
    )

  const purchasedBeats =
    Object.values(groupedDownloads)

  const isWaiting =
    status === 'loading' ||
    status === 'processing'

  const isProblem =
    status === 'error' ||
    status === 'missing-token' ||
    status === 'expired'

  function goHome() {
    window.location.href = '/'
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef3fb] px-4 py-8 text-[#18202d] sm:px-6 sm:py-12">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#d8d5ff]/50 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[420px] w-[420px] rounded-full bg-[#c9f3ee]/55 blur-[130px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* BRAND */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goHome}
            className="group flex items-center gap-2 text-xs font-bold text-[#687286] transition hover:text-[#18202d]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to store
          </button>

          <button
            type="button"
            onClick={goHome}
            aria-label="EMOKHRR home"
            className="border-0 bg-transparent p-0"
          >
            <img
              src={logo}
              alt="EMOKHRR"
              className="h-[30px] w-auto object-contain mix-blend-multiply sm:h-[34px]"
            />
          </button>
        </div>

        {/* MAIN PURCHASE CARD */}
        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[#f8fbff]/90 shadow-[0_30px_100px_rgba(23,32,51,0.13)] backdrop-blur-2xl">
          {/* STATUS */}
          <section className="relative overflow-hidden border-b border-[#172033]/[0.06] px-6 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d8d5ff]/40 blur-[90px]" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-5">
                {/* Status icon */}
                {status === 'success' ? (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#18202d] text-white shadow-[0_12px_30px_rgba(24,32,45,0.18)]">
                    <CheckCircle2
                      size={26}
                      strokeWidth={2}
                    />
                  </div>
                ) : isWaiting ? (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#d8d5ff] text-[#403b69]">
                    <LoaderCircle
                      size={25}
                      strokeWidth={2}
                      className={
                        status === 'loading'
                          ? 'animate-spin'
                          : ''
                      }
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#ffe7e5] text-[#a44848]">
                    <AlertCircle
                      size={25}
                      strokeWidth={2}
                    />
                  </div>
                )}

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a93a5]">
                      EMOKHRR Checkout
                    </span>

                    {orderStatus === 'PAID' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#dcefe9] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#315f56]">
                        <Check
                          size={10}
                          strokeWidth={3}
                        />
                        Paid
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-[#18202d] sm:text-4xl">
                    {status === 'success'
                      ? 'Your beats are ready.'
                      : status ===
                          'processing'
                        ? 'Finishing your order.'
                        : status ===
                            'missing-token'
                          ? 'Order access required.'
                          : status ===
                              'expired'
                            ? 'Downloads unavailable.'
                            : status ===
                                'error'
                              ? 'We could not load your order.'
                              : 'Confirming your payment.'}
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#70798c]">
                    {message}
                  </p>

                  {orderNumber && (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aa2b1]">
                      Order {orderNumber}
                    </p>
                  )}
                </div>
              </div>

              {status === 'success' && (
                <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#172033]/[0.06] bg-white/70 px-4 py-2.5 text-[11px] font-bold text-[#657084] sm:flex">
                  <ShieldCheck
                    size={15}
                    className="text-[#555089]"
                  />
                  Purchase verified
                </div>
              )}
            </div>
          </section>

          {/* SUCCESS CONTENT */}
          {status === 'success' && (
            <section className="p-6 sm:p-10">
              {/* Delivery notice */}
              <div className="mb-8 flex items-start gap-4 rounded-[22px] border border-[#172033]/[0.06] bg-[#eef3fb]/75 p-4 sm:p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white text-[#555089] shadow-sm">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[#293347]">
                    Secure file delivery
                  </p>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-[#778195]">
                    Your files are delivered using temporary secure
                    links. Each generated link lasts 5 minutes. If one
                    expires, refresh the links below while your order
                    access remains active.
                  </p>
                </div>
              </div>

              {/* PURCHASED BEATS */}
              <div className="space-y-9">
                {purchasedBeats.map(
                  (beat, beatIndex) => (
                    <section
                      key={beat.beatId}
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[#8b94a5]">
                            <Music2
                              size={13}
                              strokeWidth={2}
                            />

                            <span className="text-[9px] font-extrabold uppercase tracking-[0.18em]">
                              {purchasedBeats.length >
                              1
                                ? `Purchased beat ${
                                    beatIndex +
                                    1
                                  }`
                                : 'Purchased beat'}
                            </span>
                          </div>

                          <h2 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#20293a] sm:text-2xl">
                            {beat.beatTitle}
                          </h2>
                        </div>

                        <span className="w-fit rounded-full border border-[#172033]/[0.06] bg-[#d8d5ff]/45 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#555078]">
                          {beat.licenseName}{' '}
                          License
                        </span>
                      </div>

                      {/* FILE CARDS */}
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {beat.files.map(
                          (file) => {
                            const info =
                              assetLabels[
                                file
                                  .assetType
                              ] || {
                                title:
                                  file.assetType,
                                description:
                                  'Purchased file',
                                icon:
                                  FileAudio,
                              }

                            const FileIcon =
                              info.icon

                            return (
                              <a
                                key={
                                  file.grantId
                                }
                                href={
                                  file.signedUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative overflow-hidden rounded-[22px] border border-[#172033]/[0.07] bg-white/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#7770bc]/25 hover:bg-white hover:shadow-[0_14px_35px_rgba(23,32,51,0.08)]"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eef0ff] text-[#555089] transition group-hover:bg-[#d8d5ff]">
                                      <FileIcon
                                        size={19}
                                        strokeWidth={
                                          1.9
                                        }
                                      />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-extrabold text-[#20293a]">
                                        {
                                          info.title
                                        }
                                      </p>

                                      <p className="mt-1 truncate text-[11px] font-medium text-[#8a93a5]">
                                        {
                                          info.description
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#18202d] text-white transition duration-200 group-hover:scale-105">
                                    <Download
                                      size={16}
                                      strokeWidth={
                                        2
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 border-t border-[#172033]/[0.05] pt-3">
                                  <ShieldCheck
                                    size={12}
                                    className="text-[#8b85c6]"
                                  />

                                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9aa2b1]">
                                    Secure download
                                  </span>
                                </div>
                              </a>
                            )
                          }
                        )}
                      </div>
                    </section>
                  )
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="mt-10 flex flex-col gap-4 border-t border-[#172033]/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-[#667084]">
                    Download link expired?
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#929aaa]">
                    Generate a fresh set of
                    secure links.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadDownloads}
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#172033]/[0.08] bg-white/70 px-5 text-[11px] font-extrabold text-[#3c4659] transition hover:bg-white hover:text-[#18202d]"
                >
                  <RefreshCw
                    size={14}
                  />
                  Refresh links
                </button>
              </div>
            </section>
          )}

          {/* LOADING */}
          {status === 'loading' && (
            <section className="p-6 sm:p-10">
              <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#d8d5ff] blur-xl" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-white bg-white/80 shadow-sm">
                    <LoaderCircle
                      size={25}
                      className="animate-spin text-[#555089]"
                    />
                  </div>
                </div>

                <p className="mt-5 text-sm font-extrabold text-[#303a4e]">
                  Verifying your purchase
                </p>

                <p className="mt-2 max-w-sm text-xs leading-5 text-[#858ea0]">
                  We're securely checking
                  your payment and preparing
                  your licensed files.
                </p>
              </div>
            </section>
          )}

          {/* PROCESSING */}
          {status === 'processing' && (
            <section className="p-6 sm:p-10">
              <div className="rounded-[24px] border border-[#172033]/[0.06] bg-[#eef3fb]/70 p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#d8d5ff] text-[#555089]">
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-[#293347]">
                      Payment verification is
                      still processing
                    </p>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-[#778195]">
                      Paystack has returned
                      you to the store. We're
                      waiting for the final
                      payment confirmation
                      before releasing your
                      files.
                    </p>

                    <button
                      type="button"
                      onClick={
                        loadDownloads
                      }
                      className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-[#18202d] px-5 text-[11px] font-extrabold text-white transition hover:bg-[#252f42]"
                    >
                      <RefreshCw
                        size={14}
                      />
                      Check again
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PROBLEM STATES */}
          {isProblem && (
            <section className="p-6 sm:p-10">
              <div className="rounded-[24px] border border-[#172033]/[0.06] bg-[#f3f5fa] p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#ffe7e5] text-[#a44848]">
                    <AlertCircle
                      size={19}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-[#293347]">
                      {status ===
                      'missing-token'
                        ? 'Secure access unavailable'
                        : status ===
                            'expired'
                          ? 'Downloads unavailable'
                          : 'Something went wrong'}
                    </p>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-[#778195]">
                      {message}
                    </p>

                    {status ===
                      'error' && (
                      <button
                        type="button"
                        onClick={
                          loadDownloads
                        }
                        className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-[#18202d] px-5 text-[11px] font-extrabold text-white transition hover:bg-[#252f42]"
                      >
                        <RefreshCw
                          size={14}
                        />
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* BOTTOM SECURITY NOTE */}
        <div className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] font-semibold text-[#929aaa]">
          <ShieldCheck size={13} />
          Secure payment verification and
          protected file delivery
        </div>
      </div>
    </main>
  )
}