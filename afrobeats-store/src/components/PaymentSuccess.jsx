import {
  CheckCircle2,
  Download,
  LoaderCircle,
  Music2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

const API_URL = 'http://localhost:5000'

const assetLabels = {
  MP3_UNMASTERED: {
    title: 'MP3',
    description: 'Unmastered MP3',
  },

  WAV_UNMASTERED: {
    title: 'WAV',
    description: 'Unmastered WAV',
  },

  STEMS_ZIP: {
    title: 'Track Stems',
    description: 'Individual track stems',
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

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-12 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* BRAND */}
        <div className="mb-10 text-center">
          <span className="text-[17px] font-bold tracking-[0.16em]">
            EMOKHRR
          </span>

          <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-white/25">
            Beats
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0d0d10]">
          {/* STATUS HEADER */}
          <div className="border-b border-white/[0.07] p-6 sm:p-9">
            {status === 'success' ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <CheckCircle2
                  size={24}
                  strokeWidth={2}
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-white/60">
                <LoaderCircle
                  size={24}
                  strokeWidth={1.8}
                  className={
                    status === 'loading'
                      ? 'animate-spin'
                      : ''
                  }
                />
              </div>
            )}

            <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {status === 'success'
                ? 'Payment successful'
                : status ===
                    'processing'
                  ? 'Payment processing'
                  : status ===
                      'missing-token'
                    ? 'Order access required'
                    : status ===
                        'expired'
                      ? 'Downloads unavailable'
                      : status ===
                          'error'
                        ? 'We could not load your order'
                        : 'Confirming payment'}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              {message}
            </p>

            {orderNumber && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
                  Order {orderNumber}
                </span>

                {orderStatus ===
                  'PAID' && (
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50">
                    Paid
                  </span>
                )}
              </div>
            )}
          </div>

          {/* DOWNLOADS */}
          {status === 'success' && (
            <div className="p-6 sm:p-9">
              <div className="mb-7 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-white/50"
                />

                <p className="text-xs leading-5 text-white/40">
                  Your files are
                  delivered through
                  secure temporary
                  links. If a link
                  expires, use Refresh
                  links below to
                  generate fresh ones
                  while your order
                  access remains
                  active.
                </p>
              </div>

              <div className="space-y-7">
                {purchasedBeats.map(
                  (beat) => (
                    <section
                      key={beat.beatId}
                    >
                      {/* BEAT */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-white/30">
                          <Music2
                            size={13}
                            strokeWidth={
                              1.8
                            }
                          />

                          <span className="text-[9px] font-medium uppercase tracking-[0.16em]">
                            Purchased
                            Beat
                          </span>
                        </div>

                        <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em]">
                          {
                            beat.beatTitle
                          }
                        </h2>

                        <span className="mt-2 inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                          {
                            beat.licenseName
                          }{' '}
                          License
                        </span>
                      </div>

                      {/* FILES */}
                      <div className="space-y-2">
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
                              }

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
                                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-white/[0.16] hover:bg-white/[0.045]"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white">
                                    {
                                      info.title
                                    }
                                  </p>

                                  <p className="mt-1 text-[11px] text-white/30">
                                    {
                                      info.description
                                    }
                                  </p>
                                </div>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition group-hover:scale-[1.03]">
                                  <Download
                                    size={
                                      17
                                    }
                                    strokeWidth={
                                      2
                                    }
                                  />
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

              <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] leading-5 text-white/25">
                  Signed links expire
                  after 5 minutes.
                </p>

                <button
                  type="button"
                  onClick={
                    loadDownloads
                  }
                  className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-[10px] font-semibold text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <RefreshCw
                    size={13}
                  />

                  Refresh links
                </button>
              </div>
            </div>
          )}

          {/* PROCESSING / ERROR */}
          {(status ===
            'processing' ||
            status === 'error') && (
            <div className="border-t border-white/[0.07] p-6 sm:p-9">
              <button
                type="button"
                onClick={
                  loadDownloads
                }
                className="flex h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-black transition hover:bg-white/90"
              >
                <RefreshCw
                  size={15}
                />

                Check again
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}