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
      {/* Dark overlay */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
      />

      {/* Cart */}
      <aside className="absolute right-0 top-0 flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-md">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <ShoppingBag size={19} />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Your cart
              </h2>

              <p className="text-xs text-slate-500">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ShoppingBag size={27} />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Your cart is empty
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Browse the store and select a license for a beat to add it
                to your cart.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white"
              >
                Browse beats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <article
                  key={item.cartId}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.beat.image}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">
                            {item.beat.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.beat.genre} · {item.beat.bpm} BPM
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(item.cartId)}
                          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.beat.title} from cart`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-end justify-between gap-3">
                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-600">
                          {item.license.name} License
                        </span>

                        <span className="text-sm font-black text-slate-900">
                          ₦{item.license.priceNGN.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Checkout section */}
        {cart.length > 0 && (
          <footer className="border-t border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total
              </span>

              <span className="text-2xl font-black text-slate-900">
                ₦{total.toLocaleString()}
              </span>
            </div>

            <div className="mb-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-purple-600"
              />

              <p className="text-[11px] leading-5 text-slate-500">
                Final prices and order details will be verified securely
                by our server before payment.
              </p>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-purple-500"
            >
              <CreditCard size={18} />
              Continue to checkout
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <Music2 size={12} />
              Digital licenses & beat delivery
            </div>
          </footer>
        )}
      </aside>
    </div>
  )
}