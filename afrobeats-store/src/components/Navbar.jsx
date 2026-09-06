import {
  Menu,
  ShoppingBag,
} from 'lucide-react'

export default function Navbar({
  cartCount,
  onOpenCart,
  onHome,
  onBeats,
  onServices,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onHome}
          className="shrink-0"
          aria-label="EMOKHRR home"
        >
          <span className="text-[17px] font-bold tracking-[0.16em] text-white sm:text-lg">
            EMOKKHOR
          </span>
        </button>

        <nav className="hidden items-center gap-9 md:flex">
          <button
            type="button"
            onClick={onHome}
            className="text-[13px] font-medium text-white/45 transition hover:text-white"
          >
            Home
          </button>

          <button
            type="button"
            onClick={onBeats}
            className="text-[13px] font-medium text-white/45 transition hover:text-white"
          >
            Beats
          </button>

          <button
            type="button"
            onClick={onServices}
            className="text-[13px] font-medium text-white/45 transition hover:text-white"
          >
            Services
          </button>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex h-10 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-white/70 transition hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white"
            aria-label={`Open cart with ${cartCount} items`}
          >
            <ShoppingBag
              size={17}
              strokeWidth={1.8}
            />

            <span className="hidden text-xs font-medium sm:inline">
              Cart
            </span>

            {cartCount > 0 && (
              <span className="flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-white px-1.5 text-[9px] font-bold text-black">
                {cartCount > 99
                  ? '99+'
                  : cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/65 transition hover:bg-white/[0.06] hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu
              size={20}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </header>
  )
}