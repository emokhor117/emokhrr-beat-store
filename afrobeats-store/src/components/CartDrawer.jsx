import {
  CreditCard,
  Music2,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'

export default function CartDrawer({
  isOpen,
  cart,
  onClose,
  onRemove,
  onCheckout,
}) {
  if (!isOpen) {
    return null
  }

  const total = cart.reduce(
    (sum, item) => sum + item.license.priceNGN,
    0
  )

  return (
    <div className="fixed inset-0 z-[100]">
      {/* OVERLAY */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/75 backdrop-blur-sm"
      />

      {/* DRAWER */}
      <aside className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-white/[0.08] bg-[#0d0d10] text-white shadow-2xl sm:max-w-[440px]">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/70">
              <ShoppingBag
                size={18}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Your cart
              </h2>

              <p className="mt-0.5 text-[11px] text-white/35">
                {cart.length}{' '}
                {cart.length === 1
                  ? 'item'
                  : 'items'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close cart"
          >
            <X
              size={18}
              strokeWidth={1.8}
            />
          </button>
        </header>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/30">
                <ShoppingBag
                  size={26}
                  strokeWidth={1.6}
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                Your cart is empty
              </h3>

              <p className="mt-2 max-w-[280px] text-xs leading-5 text-white/35">
                Browse the beat store and choose a license to add a beat
                to your cart.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 h-10 rounded-full bg-white px-5 text-xs font-semibold text-black transition hover:bg-white/90"
              >
                Browse beats
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <article
                  key={item.cartId}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:border-white/[0.12]"
                >
                  <div className="flex gap-3.5">
                    <img
                      src={item.beat.image}
                      alt={item.beat.title}
                      className="h-[76px] w-[76px] shrink-0 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-white">
                            {item.beat.title}
                          </h3>

                          <p className="mt-1 truncate text-[10px] text-white/30">
                            {item.beat.genre}
                            {' · '}
                            {item.beat.bpm} BPM
                            {item.beat.key
                              ? ` · ${item.beat.key}`
                              : ''}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onRemove(item.cartId)
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.06] hover:text-red-400"
                          aria-label={`Remove ${item.beat.title} from cart`}
                        >
                          <Trash2
                            size={15}
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50">
                          {item.license.name}
                        </span>

                        <span className="text-xs font-semibold text-white">
                          ₦
                          {item.license.priceNGN.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* CHECKOUT */}
        {cart.length > 0 && (
          <footer className="border-t border-white/[0.07] bg-[#0d0d10] p-5 sm:p-6">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                  Total
                </p>

                <p className="mt-1 text-[11px] text-white/25">
                  {cart.length}{' '}
                  {cart.length === 1
                    ? 'license'
                    : 'licenses'}
                </p>
              </div>

              <span className="text-2xl font-semibold tracking-[-0.03em] text-white">
                ₦{total.toLocaleString()}
              </span>
            </div>

            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
              <ShieldCheck
                size={16}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-white/50"
              />

              <p className="text-[10px] leading-5 text-white/30">
                Order pricing and license details are verified securely
                before payment.
              </p>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-[0.99]"
            >
              <CreditCard
                size={16}
                strokeWidth={1.8}
              />

              Continue to checkout
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-white/20">
              <Music2
                size={11}
                strokeWidth={1.7}
              />

              Digital licenses & secure beat delivery
            </div>
          </footer>
        )}
      </aside>
    </div>
  )
}