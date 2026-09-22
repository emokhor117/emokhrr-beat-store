import {
  ArrowRight,
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
    (sum, item) =>
      sum + item.license.priceNGN,
    0
  )

  return (
    <div className="fixed inset-0 z-[100]">
      {/* OVERLAY */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-[#18202d]/30 backdrop-blur-[7px]"
      />

      {/* DRAWER */}
      <aside className="absolute right-0 top-0 flex h-full w-full flex-col overflow-hidden border-l border-white/70 bg-[#f3f6fb]/95 text-[#18202d] shadow-[-25px_0_80px_rgba(31,44,64,0.16)] backdrop-blur-2xl sm:max-w-[460px]">
        {/* DECORATIVE BACKGROUND */}
        <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#d8d5ff]/50 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#ccecf5]/45 blur-[90px]" />

        {/* HEADER */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-[#18202d]/[0.06] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5e7ff] text-[#5f6388]">
              <ShoppingBag
                size={17}
                strokeWidth={1.9}
              />

              {cart.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#f3f6fb] bg-[#18202d] px-1 text-[7px] font-extrabold text-white">
                  {cart.length > 99
                    ? '99+'
                    : cart.length}
                </span>
              )}
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa4b2]">
                Shopping bag
              </p>

              <h2 className="mt-1 text-[14px] font-extrabold tracking-[-0.025em] text-[#18202d]">
                Your cart
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#18202d]/[0.07] bg-white/60 text-[#7e899a] shadow-sm transition hover:border-[#18202d]/15 hover:bg-white hover:text-[#18202d]"
            aria-label="Close cart"
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </header>

        {/* ITEMS */}
        <div className="relative flex-1 overflow-y-auto p-5 sm:p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full bg-[#d9d6ff]/35 blur-2xl" />

                <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-[22px] border border-white/80 bg-white/60 text-[#78849a] shadow-[0_14px_35px_rgba(42,57,80,0.07)] backdrop-blur-xl">
                  <ShoppingBag
                    size={25}
                    strokeWidth={1.6}
                  />
                </div>
              </div>

              <h3 className="mt-6 text-[15px] font-extrabold tracking-[-0.025em] text-[#18202d]">
                Your cart is empty
              </h3>

              <p className="mt-2 max-w-[280px] text-[10px] font-medium leading-5 text-[#8995a6]">
                Find a beat you like,
                choose your license and
                it'll appear here.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 flex h-11 items-center justify-center gap-2 rounded-full bg-[#18202d] px-6 text-[10px] font-bold text-white shadow-[0_12px_30px_rgba(24,32,45,0.16)] transition hover:-translate-y-0.5 hover:bg-[#273246]"
              >
                Browse beats

                <ArrowRight
                  size={13}
                  strokeWidth={2}
                />
              </button>
            </div>
          ) : (
            <>
              {/* ITEM COUNT */}
              <div className="mb-4 flex items-center justify-between px-1">
                <p className="text-[9px] font-bold text-[#8b96a7]">
                  {cart.length}{' '}
                  {cart.length === 1
                    ? 'license'
                    : 'licenses'}{' '}
                  selected
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#adb5c0]">
                  EMOKKHOR
                </p>
              </div>

              {/* CART CARDS */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <article
                    key={item.cartId}
                    className="group relative overflow-hidden rounded-[22px] border border-white/80 bg-white/60 p-3.5 shadow-[0_10px_30px_rgba(42,57,80,0.045)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-[0_16px_38px_rgba(42,57,80,0.08)]"
                  >
                    <div className="flex gap-3.5">
                      {/* ARTWORK */}
                      <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[#dfe5ee]">
                        <img
                          src={
                            item.beat.image
                          }
                          alt={
                            item.beat.title
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18202d]/20 to-transparent" />
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-[12px] font-extrabold tracking-[-0.02em] text-[#18202d]">
                              {
                                item.beat
                                  .title
                              }
                            </h3>

                            <p className="mt-1.5 truncate text-[8px] font-semibold text-[#929cac]">
                              {[
                                item.beat
                                  .genre,
                                item.beat.bpm
                                  ? `${item.beat.bpm} BPM`
                                  : null,
                                item.beat
                                  .key,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  ' · '
                                )}
                            </p>
                          </div>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              onRemove(
                                item.cartId
                              )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#a1aab7] transition hover:bg-[#fff0f0] hover:text-[#d95c5c]"
                            aria-label={`Remove ${item.beat.title} from cart`}
                          >
                            <Trash2
                              size={14}
                              strokeWidth={
                                1.8
                              }
                            />
                          </button>
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-3">
                          {/* LICENSE BADGE */}
                          <span className="max-w-[120px] truncate rounded-full bg-[#e8e8ff] px-2.5 py-1.5 text-[7px] font-extrabold uppercase tracking-[0.1em] text-[#66668b]">
                            {
                              item.license
                                .name
                            }
                          </span>

                          {/* PRICE */}
                          <span className="shrink-0 text-[11px] font-extrabold tracking-[-0.02em] text-[#18202d]">
                            ₦
                            {item.license.priceNGN.toLocaleString(
                              'en-NG'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CHECKOUT */}
        {cart.length > 0 && (
          <footer className="relative shrink-0 border-t border-[#18202d]/[0.06] bg-white/55 p-5 backdrop-blur-2xl sm:p-6">
            {/* TOTAL */}
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa4b2]">
                  Order total
                </p>

                <p className="mt-1.5 text-[9px] font-semibold text-[#8995a6]">
                  {cart.length}{' '}
                  {cart.length === 1
                    ? 'license'
                    : 'licenses'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[8px] font-semibold text-[#9ba5b3]">
                  NGN
                </p>

                <span className="mt-0.5 block text-[25px] font-extrabold tracking-[-0.045em] text-[#18202d]">
                  ₦
                  {total.toLocaleString(
                    'en-NG'
                  )}
                </span>
              </div>
            </div>

            {/* SECURITY */}
            <div className="mb-4 flex items-start gap-3 rounded-[16px] border border-[#18202d]/[0.05] bg-[#eef1f7]/70 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e2e4ff] text-[#66668d]">
                <ShieldCheck
                  size={14}
                  strokeWidth={1.9}
                />
              </div>

              <div>
                <p className="text-[8px] font-bold text-[#566276]">
                  Secure checkout
                </p>

                <p className="mt-1 text-[8px] font-medium leading-4 text-[#909aaa]">
                  Pricing and license
                  details are verified by
                  the server before
                  payment.
                </p>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              type="button"
              onClick={onCheckout}
              className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#18202d] px-5 text-[10px] font-bold text-white shadow-[0_12px_30px_rgba(24,32,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#273246] hover:shadow-[0_16px_35px_rgba(24,32,45,0.22)] active:translate-y-0"
            >
              <CreditCard
                size={14}
                strokeWidth={1.9}
              />

              Continue to checkout

              <ArrowRight
                size={13}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

            {/* DELIVERY NOTE */}
            <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[8px] font-medium text-[#a1aab7]">
              <Music2
                size={10}
                strokeWidth={1.8}
              />

              Digital licenses & secure
              beat delivery
            </div>
          </footer>
        )}
      </aside>
    </div>
  )
}