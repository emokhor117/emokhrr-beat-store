import { useMemo, useRef, useState } from 'react'

import Navbar from './components/Navbar'
import FilterSidebar from './components/FilterSidebar'
import BeatGrid from './components/BeatGrid'
import BottomPlayer from './components/BottomPlayer'
import LicenseModal from './components/LicenseModal'
import CartDrawer from './components/CartDrawer'

import { beats } from './data/beats'
import { licenses } from './data/licenses'

export default function App() {
  // AUDIO
  const [currentBeat, setCurrentBeat] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // CATALOGUE
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')

  // LICENSE SELECTION
  const [selectedBeat, setSelectedBeat] = useState(null)
  const [selectedLicense, setSelectedLicense] = useState(null)

  // CART
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const audioRef = useRef(null)

  // ----------------------------
  // FILTERING
  // ----------------------------

  const filteredBeats = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return beats.filter((beat) => {
      const matchesGenre =
        genre === 'All' || beat.genre === genre

      const searchableText = [
        beat.title,
        beat.genre,
        beat.mood,
        beat.producer,
        beat.key,
        beat.bpm,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        normalizedSearch === '' ||
        searchableText.includes(normalizedSearch)

      return matchesGenre && matchesSearch
    })
  }, [search, genre])

  // ----------------------------
  // AUDIO PLAYER
  // ----------------------------

  const handleTogglePlay = async (beat) => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (currentBeat?.id === beat.id) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        try {
          await audio.play()
          setIsPlaying(true)
        } catch (error) {
          console.error('Could not play audio:', error)
          setIsPlaying(false)
        }
      }

      return
    }

    audio.pause()

    audio.src = beat.previewUrl
    audio.load()

    setCurrentBeat(beat)

    try {
      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Could not play audio:', error)
      setIsPlaying(false)
    }
  }

  // ----------------------------
  // LICENSE SELECTION
  // ----------------------------

  const handleSelectBeat = (beat) => {
    setSelectedBeat(beat)
    setSelectedLicense(null)
  }

  const handleCloseLicenseModal = () => {
    setSelectedBeat(null)
    setSelectedLicense(null)
  }

  // ----------------------------
  // CART
  // ----------------------------

  const handleAddToCart = () => {
    if (!selectedBeat || !selectedLicense) {
      return
    }

    /*
      One beat should only appear once in the cart.

      If the customer selects the same beat again with a
      different license, we update its license instead of
      creating a duplicate.
    */

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.beat.id === selectedBeat.id
      )

      if (existingItem) {
        return currentCart.map((item) =>
          item.beat.id === selectedBeat.id
            ? {
                ...item,
                license: selectedLicense,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          cartId: `${selectedBeat.id}-${selectedLicense.id}`,
          beat: selectedBeat,
          license: selectedLicense,
        },
      ]
    })

    setSelectedBeat(null)
    setSelectedLicense(null)

    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (cartId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.cartId !== cartId)
    )
  }

  // ----------------------------
  // CHECKOUT
  // ----------------------------

  const handleCheckout = () => {
    /*
      IMPORTANT:

      We are NOT sending prices to Paystack here.

      Later, React will send only something like:

      {
        items: [
          {
            beatId: "beat_001",
            licenseId: "premium"
          }
        ]
      }

      Our backend will look up the real prices.
    */

    const checkoutPayload = {
      items: cart.map((item) => ({
        beatId: item.beat.id,
        licenseId: item.license.id,
      })),
    }

    console.log('Checkout payload:', checkoutPayload)
  }

  // ----------------------------
  // UI
  // ----------------------------

  return (
    <div className="min-h-screen bg-[#ededf0] pb-20">
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="mx-auto flex max-w-[1500px] flex-col bg-[#f9f9fa] lg:min-h-[calc(100vh-64px)] lg:flex-row">
        <FilterSidebar
          search={search}
          setSearch={setSearch}
          genre={genre}
          setGenre={setGenre}
        />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-600">
                Beat Store
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                Browse beats
              </h1>

              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Listen to previews and choose the license that fits your
                release.
              </p>
            </div>

            <p className="text-xs font-medium text-slate-500">
              {filteredBeats.length}{' '}
              {filteredBeats.length === 1 ? 'beat' : 'beats'}
            </p>
          </div>

          <BeatGrid
            beats={filteredBeats}
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onSelect={handleSelectBeat}
          />
        </main>
      </div>

      {/* AUDIO ENGINE */}
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onPause={() => {
          if (!audioRef.current?.ended) {
            setIsPlaying(false)
          }
        }}
      />

      {/* PERSISTENT AUDIO PLAYER */}
      <BottomPlayer
        beat={currentBeat}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSelect={handleSelectBeat}
      />

      {/* LICENSE SELECTOR */}
      <LicenseModal
        beat={selectedBeat}
        licenses={licenses}
        selectedLicense={selectedLicense}
        setSelectedLicense={setSelectedLicense}
        onClose={handleCloseLicenseModal}
        onContinue={handleAddToCart}
      />

      {/* SHOPPING CART */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}