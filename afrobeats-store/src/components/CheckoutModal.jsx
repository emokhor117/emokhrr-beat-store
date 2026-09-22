import {
  ArrowRight,
  Check,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
  X,
} from 'lucide-react'

function formatNGN(amount) {
  if (amount == null) return '—'

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function CheckoutModal({
  isOpen,
  cart,
  email,
  setEmail,
  onClose,
  onContinue,
  isLoading = false,
}) {
  if (!isOpen) return null

  const total = cart.reduce(
    (sum, item) => sum + (item.license?.priceNGN ?? 0),
    0
  )

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const canContinue =
    cart.length > 0 &&
    emailIsValid &&
    !isLoading

  function handleSubmit(event) {
    event.preventDefault()

    if (!canContinue) return

    onContinue()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-6">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close checkout"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#172033]/25 backdrop-blur-md"
      />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-[12%] top-[12%] h-72 w-72 rounded-full bg-[#d8d5ff]/55 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[8%] right-[10%] h-72 w-72 rounded-full bg-[#c9f3ee]/55 blur-[100px]" />

      {/* Modal */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-[#f8fbff]/95 shadow-[0_30px_100px_rgba(23,32,51,0.18)] backdrop-blur-2xl">
        <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <section className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-[#d8d5ff]/30 blur-[90px]" />

            <div className="relative">
              {/* Header */}
              <div className="mb-9 flex items-start justify-between gap-6">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#172033]/[0.07] bg-white/70 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#596276]">
                    <LockKeyhole size={13} />
                    Secure checkout
                  </div>

                  <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-[#18202d] sm:text-4xl">
                    Almost yours.
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#697386] sm:text-[15px]">
                    Enter your email to continue to payment and receive access
                    to your licensed beat files.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#172033]/[0.07] bg-white/75 text-[#18202d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close checkout"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="checkout-email"
                    className="mb-2.5 block text-sm font-bold text-[#283246]"
                  >
                    Email address
                  </label>

                  <div
                    className={`flex items-center gap-3 rounded-[18px] border bg-white/80 px-4 transition focus-within:bg-white focus-within:ring-4 ${
                      email.length > 0 && !emailIsValid
                        ? 'border-red-300 focus-within:border-red-300 focus-within:ring-red-100'
                        : 'border-[#172033]/10 focus-within:border-[#8c86d8] focus-within:ring-[#d8d5ff]/35'
                    }`}
                  >
                    <Mail
                      size={19}
                      className="shrink-0 text-[#7c8598]"
                    />

                    <input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="h-14 min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#18202d] outline-none placeholder:text-[#9ba4b5] disabled:cursor-not-allowed"
                    />

                    {emailIsValid && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18202d] text-white">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {email.length > 0 && !emailIsValid && (
                    <p className="mt-2 text-xs font-semibold text-red-500">
                      Enter a valid email address.
                    </p>
                  )}

                  <p className="mt-3 text-xs leading-5 text-[#8992a3]">
                    Make sure this address is correct. It will be associated
                    with your order.
                  </p>
                </div>

                {/* Trust cards */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/80 bg-white/60 p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#d8d5ff]/70 text-[#343056]">
                      <ShieldCheck size={18} />
                    </div>

                    <p className="text-sm font-extrabold text-[#283246]">
                      Server verified
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#7c8598]">
                      Beat prices and license selections are verified by our
                      server before payment.
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/80 bg-white/60 p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#c9f3ee] text-[#234a47]">
                      <LockKeyhole size={17} />
                    </div>

                    <p className="text-sm font-extrabold text-[#283246]">
                      Secure payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#7c8598]">
                      Payment is completed securely through Paystack.
                    </p>
                  </div>
                </div>

                {/* Desktop CTA */}
                <button
                  type="submit"
                  disabled={!canContinue}
                  className="mt-8 hidden h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#18202d] px-6 text-sm font-extrabold text-white shadow-[0_15px_35px_rgba(24,32,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#252f42] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 lg:flex"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Preparing payment...
                    </>
                  ) : (
                    <>
                      Continue to payment
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT — ORDER SUMMARY */}
          <aside className="relative border-t border-[#172033]/[0.06] bg-[#e9eef8]/70 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-[#d8d5ff]/40 blur-[80px]" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#858da0]">
                    Your order
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-[#18202d]">
                    Order summary
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[#18202d] shadow-sm">
                  <ShoppingBag size={19} />
                </div>
              </div>

              {/* Cart items */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/65 p-3"
                  >
                    <div className="h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[15px] bg-[#dfe5ef]">
                      {item.beat?.artworkUrl ? (
                        <img
                          src={item.beat.artworkUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#8d96a7]">
                          <ShoppingBag size={18} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-[#20293a]">
                        {item.beat?.title || 'Beat'}
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-[#858da0]">
                        {item.license?.name || item.license?.code || 'License'}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-extrabold text-[#20293a]">
                      {formatNGN(item.license?.priceNGN)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="mt-6 border-t border-[#172033]/10 pt-6">
                <div className="flex items-center justify-between text-sm text-[#727c8f]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#4c5669]">
                    {formatNGN(total)}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8b94a5]">
                      Total
                    </p>
                    <p className="mt-1 text-xs text-[#9aa2b1]">
                      NGN
                    </p>
                  </div>

                  <p className="text-3xl font-extrabold tracking-[-0.045em] text-[#18202d]">
                    {formatNGN(total)}
                  </p>
                </div>
              </div>

              {/* Payment badge */}
              <div className="mt-6 flex items-center gap-3 rounded-[18px] border border-[#172033]/[0.06] bg-[#f8fbff]/75 px-4 py-3.5">
                <ShieldCheck
                  size={18}
                  className="shrink-0 text-[#555089]"
                />

                <p className="text-xs font-semibold leading-5 text-[#697386]">
                  Final pricing is verified by the EMOKKHOR server before you
                  are redirected to Paystack.
                </p>
              </div>

              {/* Mobile CTA */}
              <button
                type="button"
                onClick={onContinue}
                disabled={!canContinue}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#18202d] px-6 text-sm font-extrabold text-white shadow-[0_15px_35px_rgba(24,32,45,0.18)] transition hover:bg-[#252f42] disabled:cursor-not-allowed disabled:opacity-40 lg:hidden"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Preparing payment...
                  </>
                ) : (
                  <>
                    Continue to payment
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}