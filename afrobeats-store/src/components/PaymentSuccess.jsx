import {
  CheckCircle2,
  Download,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

export default function PaymentSuccess() {
  const [status, setStatus] =
    useState('loading')

  const [downloads, setDownloads] =
    useState([])

  const [orderData, setOrderData] =
    useState(null)

  const [message, setMessage] =
    useState('Confirming your payment...')

  const params =
    new URLSearchParams(
      window.location.search
    )

  const orderNumber =
    params.get('order')

  useEffect(() => {
    if (!orderNumber) {
      setStatus('error')
      setMessage(
        'No order number was provided.'
      )

      return
    }

    let cancelled = false

    async function loadDownloads() {
      const accessToken =
        sessionStorage.getItem(
          `order_access_${orderNumber}`
        )

      if (!accessToken) {
        if (!cancelled) {
          setStatus('missing-token')

          setMessage(
            'Your secure order access token is not available in this browser session.'
          )
        }

        return
      }

      try {
        setStatus('loading')

        setMessage(
          'Confirming your payment...'
        )

        const response = await fetch(
          `http://localhost:5000/api/orders/${encodeURIComponent(
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
            Payment redirect can happen
            just before the webhook has
            finished processing.
          */
          if (
            response.status === 409 ||
            response.status === 404
          ) {
            throw new Error(
              'PAYMENT_PROCESSING'
            )
          }

          throw new Error(
            data?.message ||
              'Unable to load your downloads'
          )
        }

        if (cancelled) {
          return
        }

        setOrderData(
          data.order || null
        )

        setDownloads(
          data.downloads ||
            data.grants ||
            []
        )

        setStatus('success')

        setMessage(
          'Your files are ready.'
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        if (
          error.message ===
          'PAYMENT_PROCESSING'
        ) {
          setStatus('processing')

          setMessage(
            'Your payment was received. We are finishing verification now.'
          )

          return
        }

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
    }

    loadDownloads()

    return () => {
      cancelled = true
    }
  }, [orderNumber])

  function retry() {
    window.location.reload()
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="text-[17px] font-bold tracking-[0.16em]">
            EMOKHRR
          </span>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0d0d10]">
          <div className="border-b border-white/[0.07] p-6 sm:p-9">
            {status ===
            'success' ? (
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
                    status ===
                      'loading'
                      ? 'animate-spin'
                      : ''
                  }
                />
              </div>
            )}

            <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {status ===
              'success'
                ? 'Payment successful'
                : status ===
                    'processing'
                  ? 'Payment processing'
                  : status ===
                      'missing-token'
                    ? 'Order access required'
                    : status ===
                        'error'
                      ? 'We could not load your order'
                      : 'Confirming payment'}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              {message}
            </p>

            {orderNumber && (
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/25">
                Order {orderNumber}
              </p>
            )}
          </div>

          {status ===
            'success' && (
            <div className="p-6 sm:p-9">
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-white/50"
                />

                <p className="text-xs leading-5 text-white/40">
                  These download
                  links are generated
                  securely and may
                  expire. If a link
                  expires, return to
                  this page to request
                  a new one while your
                  download access is
                  active.
                </p>
              </div>

              {downloads.length ===
              0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 text-center">
                  <p className="text-sm text-white/50">
                    No downloadable
                    files were returned
                    for this order.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {downloads.map(
                    (
                      download,
                      index
                    ) => {
                      const url =
                        download.url ||
                        download.downloadUrl ||
                        download.signedUrl

                      const label =
                        download.name ||
                        download.fileName ||
                        download.assetType ||
                        download.type ||
                        `Download ${
                          index + 1
                        }`

                      return (
                        <a
                          key={
                            download.id ||
                            `${label}-${index}`
                          }
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-white/[0.16] hover:bg-white/[0.045]"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {
                                label
                              }
                            </p>

                            <p className="mt-1 text-[11px] text-white/30">
                              Secure
                              download
                            </p>
                          </div>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black">
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
              )}

              {orderData && (
                <div className="mt-7 border-t border-white/[0.07] pt-6 text-xs text-white/30">
                  Purchase verified
                  securely by EMOKHRR
                  Beats.
                </div>
              )}
            </div>
          )}

          {(status ===
            'processing' ||
            status === 'error') && (
            <div className="border-t border-white/[0.07] p-6 sm:p-9">
              <button
                type="button"
                onClick={retry}
                className="flex h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-black"
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