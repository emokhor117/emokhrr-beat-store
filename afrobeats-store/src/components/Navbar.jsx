import {
  Menu,
  ShoppingBag,
  UserRound,
} from 'lucide-react'

export default function Navbar({
  cartCount,
  onOpenCart,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0d]">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <div className="shrink-0">
            <span className="text-base font-black tracking-[0.15em] text-white sm:text-lg sm:tracking-[0.2em]">
              EMOKHRR
            </span>

            <span className="ml-2 hidden text-xs font-medium tracking-widest text-purple-400 sm:inline">
              BEATS
            </span>
          </div>

          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-widest text-slate-400 md:flex">
            <button
              type="button"
              className="transition hover:text-white"
            >
              Browse
            </button>

            <button
              type="button"
              className="transition hover:text-white"
            >
              Playlists
            </button>

            <button
              type="button"
              className="transition hover:text-white"
            >
              Services
            </button>

            <button
              type="button"
              className="transition hover:text-white"
            >
              Licenses
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="hidden items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-white sm:flex"
          >
            <UserRound size={16} />
            Account
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative rounded-lg p-2.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
            aria-label={`Open cart with ${cartCount} items`}
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="rounded-lg p-2.5 text-slate-300 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}