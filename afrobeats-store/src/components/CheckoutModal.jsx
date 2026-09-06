import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react'

export default function CheckoutModal({
  isOpen,
  cart,
  email,
  setEmail,
  onClose,
  onContinue,
  isLoading = false,
}) {
  if (!isOpen) {
    return null
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + item.license.priceNGN,
    0
  )

  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    )

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-5">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close checkout"
      />

      <div className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[28px] border border-white/[0.08] bg-[#0d0d10] shadow-2xl sm:max-w-lg sm:rounded-[28px]">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Checkout
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Complete your order
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close checkout"
          >
            <X
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </header>

        <div className="p-5 sm:p-6">
          {/* EMAIL */}
          <div>
            <label
              htmlFor="checkout-email"
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35"
            >
              Delivery email
            </label>

            <p className="mt-2 text-xs leading-5 text-white/35">
              Your order details and access
              to your purchased beat files
              will be associated with this
              email.
            </p>

            <div className="relative mt-4">
              <Mail
                size={16}
                strokeWidth={1.8}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="artist@email.com"
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 focus:bg-white/[0.05]"
              />
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Order summary
            </p>

            <div className="mt-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"
                >
                  <img
                    src={item.beat.image}
                    alt={item.beat.title}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {item.beat.title}
                    </p>

                    <p className="mt-1 text-[10px] text-white/30">
                      {item.license.name} License
                    </p>
                  </div>

                  <p className="shrink-0 text-xs font-semibold text-white">
                    ₦
                    {item.license.priceNGN.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-6 flex items-end justify-between border-t border-white/[0.07] pt-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                Total
              </p>

              <p className="mt-1 text-[10px] text-white/25">
                Server verified before payment
              </p>
            </div>

            <p className="text-2xl font-semibold tracking-[-0.03em] text-white">
              ₦{total.toLocaleString()}
            </p>
          </div>

          {/* SECURITY */}
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <ShieldCheck
              size={16}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-white/45"
            />

            <p className="text-[10px] leading-5 text-white/30">
              Your final order total and
              license details are verified
              securely by the server before
              payment.
            </p>
          </div>

          {/* CONTINUE */}
          <button
            type="button"
            onClick={onContinue}
            disabled={
              !emailIsValid ||
              isLoading ||
              cart.length === 0
            }
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-white/20"
          >
            {isLoading
              ? 'Preparing payment...'
              : 'Continue to payment'}

            {!isLoading && (
              <ArrowRight
                size={15}
                strokeWidth={1.8}
              />
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-white/20">
            <Lock
              size={11}
              strokeWidth={1.8}
            />

            Secure checkout
          </div>
        </div>
      </div>
    </div>
  )
}