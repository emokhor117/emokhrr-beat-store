import {
  Menu,
  ShoppingBag,
} from 'lucide-react'

import logo from '../assets/emokkhor-logo.png'

export default function Navbar({
  cartCount,
  onOpenCart,
  onHome,
  onBeats,
  onServices,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#172033]/[0.06] bg-[#f5f8fc]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <button
          type="button"
          onClick={onHome}
          aria-label="EMOKKHOR home"
          className="flex shrink-0 items-center"
        >
          <img
            src={logo}
            alt="EMOKKHOR"
            className="h-[30px] w-auto object-contain mix-blend-multiply sm:h-[34px]"
          />
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavButton onClick={onHome}>
            Home
          </NavButton>

          <NavButton onClick={onBeats}>
            Beats
          </NavButton>

          <NavButton onClick={onServices}>
            Services
          </NavButton>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex h-10 items-center gap-2.5 rounded-lg border border-[#172033]/15 bg-transparent px-4 text-[#18202d] transition hover:bg-white"
            aria-label={`Open cart with ${cartCount} items`}
          >
            <ShoppingBag
              size={15}
              strokeWidth={1.8}
            />

            <span className="hidden text-[11px] font-semibold sm:inline">
              Cart
            </span>

            {cartCount > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#18202d] px-1 text-[8px] font-bold text-white">
                {cartCount > 99
                  ? '99+'
                  : cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#18202d] transition hover:bg-white md:hidden"
            aria-label="Open menu"
          >
            <Menu
              size={19}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </header>
  )
}

function NavButton({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] font-semibold text-[#536071] transition hover:text-[#151c28]"
    >
      {children}
    </button>
  )
}