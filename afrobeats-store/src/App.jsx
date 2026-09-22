import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ArrowRight,
  Headphones,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'

import Navbar from './components/Navbar'
import BeatGrid from './components/BeatGrid'
import FilterSidebar from './components/FilterSidebar'
import BottomPlayer from './components/BottomPlayer'
import LicenseModal from './components/LicenseModal'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import Hero from './components/Hero'
import Services from './components/Services'

import PaymentSuccess from './components/PaymentSuccess'
import AdminPage from './components/AdminPage'

import { API_URL } from './config/api'

function App() {
  const [beats, setBeats] = useState([])
  const [beatsLoading, setBeatsLoading] =
    useState(true)
  const [beatsError, setBeatsError] =
    useState('')

  const [currentBeat, setCurrentBeat] =
    useState(null)

  const [isPlaying, setIsPlaying] =
    useState(false)

  const [search, setSearch] =
    useState('')

  const [genre, setGenre] =
    useState('All')

  const [selectedBeat, setSelectedBeat] =
    useState(null)

  const [selectedLicense, setSelectedLicense] =
    useState(null)

  const [cart, setCart] =
    useState([])

  const [isCartOpen, setIsCartOpen] =
    useState(false)

  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false)

  const [checkoutEmail, setCheckoutEmail] =
    useState('')

  const [isCheckoutLoading, setIsCheckoutLoading] =
    useState(false)

  const homeRef = useRef(null)
  const beatsRef = useRef(null)
  const servicesRef = useRef(null)
  const audioRef = useRef(null)

  // -------------------------
  // FETCH REAL BEATS
  // -------------------------

  useEffect(() => {
    async function fetchBeats() {
      try {
        setBeatsLoading(true)
        setBeatsError('')

        const response = await fetch(
          `${API_URL}/api/beats`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data?.message ||
              'Failed to load beats'
          )
        }

        setBeats(data.beats || [])
      } catch (error) {
        console.error(
          'Failed to fetch beats:',
          error
        )

        setBeatsError(
          error.message ||
            'Unable to load beats'
        )
      } finally {
        setBeatsLoading(false)
      }
    }

    fetchBeats()
  }, [])

  // -------------------------
  // FILTERS
  // -------------------------

  const genres = useMemo(() => {
    const uniqueGenres =
      beats
        .map((beat) => beat.genre)
        .filter(Boolean)

    return [
      'All',
      ...new Set(uniqueGenres),
    ]
  }, [beats])

  const filteredBeats =
    useMemo(() => {
      return beats.filter((beat) => {
        const matchesSearch =
          beat.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          beat.producer
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          beat.genre
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

        const matchesGenre =
          genre === 'All' ||
          beat.genre === genre

        return (
          matchesSearch &&
          matchesGenre
        )
      })
    }, [
      beats,
      search,
      genre,
    ])

  // -------------------------
  // NAVIGATION
  // -------------------------

  function scrollToSection(ref) {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  // -------------------------
  // PLAYER
  // -------------------------

  function handleTogglePlay(beat) {
    if (!beat?.previewUrl) {
      return
    }

    if (
      currentBeat?.id === beat.id
    ) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current
          ?.play()
          .catch(console.error)

        setIsPlaying(true)
      }

      return
    }

    setCurrentBeat(beat)
    setIsPlaying(true)

    setTimeout(() => {
      if (!audioRef.current) {
        return
      }

      audioRef.current.src =
        beat.previewUrl

      audioRef.current
        .play()
        .catch((error) => {
          console.error(
            'Audio playback failed:',
            error
          )

          setIsPlaying(false)
        })
    }, 0)
  }

  // -------------------------
  // LICENSE MODAL
  // -------------------------

  function handleSelectBeat(beat) {
    setSelectedBeat(beat)
    setSelectedLicense(null)
  }

  function handleCloseLicenseModal() {
    setSelectedBeat(null)
    setSelectedLicense(null)
  }

  function handleAddToCart(beat, license) {

      const cartItem = {
    cartId: `${beat.id}-${license.id}`,
    beat,
    license,
  }

    setCart((currentCart) => {
      const existingIndex =
        currentCart.findIndex(
          (item) =>
            item.beat.id === beat.id
        )

      if (existingIndex !== -1) {
        return currentCart.map((item, index) => index === existingIndex
            ? cartItem
            : item
        )
      }
      return [...currentCart, cartItem]
    })

    handleCloseLicenseModal()
    setIsCartOpen(true)
  }

function handleRemoveFromCart(cartId) {
  setCart((currentCart) =>
    currentCart.filter(
      (item) => item.cartId !== cartId
    )
  )
}

  // -------------------------
  // CHECKOUT
  // -------------------------

  function handleCheckout() {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  async function handleContinueToPayment() {
    if (isCheckoutLoading) {
      return
    }

    const checkoutPayload = {
      email: checkoutEmail.trim(),

      items: cart.map((item) => ({
        beatId: item.beat.id,
        licenseId:
          item.license.id,
      })),
    }

    try {
      setIsCheckoutLoading(true)

      const checkoutResponse =
        await fetch(`${API_URL}/api/checkout`, {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(
              checkoutPayload
            ),
          }
        )

      const checkoutData =
        await checkoutResponse.json()

      if (!checkoutResponse.ok) {
        throw new Error(
          checkoutData?.message ||
            'Checkout failed'
        )
      }

      const orderNumber =
        checkoutData.order
          .orderNumber

      // Keep this secret.
      // Do not place it in a URL.
      if (
        checkoutData.order
          .accessToken
      ) {
        sessionStorage.setItem(
          `order_access_${orderNumber}`,
          checkoutData.order
            .accessToken
        )
      }

      const paymentResponse =
        await fetch(
  `${API_URL}/api/payments/paystack/initialize`,
  {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              orderNumber,
            }),
          }
        )

      const paymentData =
        await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData?.message ||
            'Could not initialize payment'
        )
      }

      const authorizationUrl =
  paymentData?.payment?.authorizationUrl

if (!authorizationUrl) {
  throw new Error(
    'Paystack authorization URL was not returned'
  )
}

window.location.href =
  authorizationUrl

      /*
        Do not redirect yet until
        we confirm the exact field
        your backend returns.

        It may be:
        paymentData.authorization_url

        or:
        paymentData.data.authorization_url

        We'll inspect the response
        first.
      */
    } catch (error) {
      console.error(
        'Checkout error:',
        error
      )

      alert(
        error.message ||
          'Something went wrong'
      )
    } finally {
      setIsCheckoutLoading(false)
    }
  }


const pathname =
  window.location.pathname

if (
  pathname ===
  '/payment-success'
) {
  return <PaymentSuccess />
}

if (
  pathname === '/admin' ||
  pathname.startsWith(
    '/admin/'
  )
) {
  return <AdminPage />
}

  return (
    <div className="min-h-screen bg-[#eef3fb] text-[#18202d]">
      <Navbar
  cartCount={cart.length}
  onOpenCart={() =>
    setIsCartOpen(true)
  }
  onHome={() =>
    scrollToSection(homeRef)
  }
  onBeats={() =>
    scrollToSection(beatsRef)
  }
  onServices={() =>
    scrollToSection(servicesRef)
  }
/>

      {/* HERO */}

      {/* HERO */}

<section
  ref={homeRef}
  className="scroll-mt-24"
>
  <Hero
    onExploreBeats={() =>
      scrollToSection(beatsRef)
    }
    onServices={() =>
      scrollToSection(servicesRef)
    }
    featuredBeat={
      beats.length > 0
        ? beats[0]
        : null
    }
    onPlayFeatured={() => {
      if (beats[0]) {
        handleTogglePlay(
          beats[0]
        )
      }
    }}
    isFeaturedPlaying={
      currentBeat?.id ===
        beats[0]?.id &&
      isPlaying
    }
  />
</section>

      {/* BEAT STORE */}

      <section
        ref={beatsRef}
        className="scroll-mt-24 bg-[#f8f6ff]"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#806da0]">
      The catalogue
    </p>

    <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-[#24183d] sm:text-5xl">
      Pick your next
      <span className="text-[#6c43f3]">
        {' '}record.
      </span>
    </h2>
  </div>

  <p className="max-w-[330px] text-xs leading-6 text-[#8b7e98]">
    Preview the catalogue and choose the
    license that fits your release.
  </p>
</div>
          </div>

          {beatsLoading ? (
            <div className="py-20 text-center text-zinc-400">
              Loading beats...
            </div>
          ) : beatsError ? (
            <div className="py-20 text-center">
              <p className="text-zinc-400">
                {beatsError}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
              <FilterSidebar
                search={search}
                setSearch={setSearch}
                genre={genre}
                setGenre={setGenre}
                genres={genres}
              />

              <BeatGrid
                beats={filteredBeats}
                currentBeat={
                  currentBeat
                }
                isPlaying={
                  isPlaying
                }
                onTogglePlay={
                  handleTogglePlay
                }
                onSelect={
                  handleSelectBeat
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}

      <section
  ref={servicesRef}
  className="scroll-mt-24"
>
  <Services />
</section>

      {currentBeat?.previewUrl && (
        <audio
  ref={audioRef}
  src={currentBeat.previewUrl}
  preload="metadata"
  onPlay={() =>
    setIsPlaying(true)
  }
  onPause={() =>
    setIsPlaying(false)
  }
  onEnded={() =>
    setIsPlaying(false)
  }
/>
      )}

      <BottomPlayer
  beat={currentBeat}
  isPlaying={isPlaying}
  audioRef={audioRef}
  onTogglePlay={() => {
    if (currentBeat) {
      handleTogglePlay(
        currentBeat
      )
    }
  }}
  onSelect={(beat) => {
    handleSelectBeat(beat)
  }}
/>

      <LicenseModal
  beat={selectedBeat}
  licenses={selectedBeat?.licenses || []}
  selectedLicense={selectedLicense}
  setSelectedLicense={setSelectedLicense}
  onClose={handleCloseLicenseModal}
  onContinue={() => {
    if (
      selectedBeat &&
      selectedLicense
    ) {
      handleAddToCart(
        selectedBeat,
        selectedLicense
      )
    }
  }}
/>
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() =>
          setIsCartOpen(false)
        }
        onRemove={
          handleRemoveFromCart
        }
        onCheckout={
          handleCheckout
        }
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        email={checkoutEmail}
        setEmail={
          setCheckoutEmail
        }
        onClose={() =>
          setIsCheckoutOpen(
            false
          )
        }
        onContinue={
          handleContinueToPayment
        }
        isLoading={
          isCheckoutLoading
        }
      />
    </div>
  )
}

export default App