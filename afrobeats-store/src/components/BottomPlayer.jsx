import {
  Pause,
  Play,
  ShoppingBag,
} from 'lucide-react'

const bars = [
  15, 31, 22, 45, 60, 30, 48, 72, 39, 63,
  88, 44, 61, 76, 35, 51, 84, 68, 42, 59,
  72, 91, 55, 74, 35, 62, 79, 49, 67, 85,
  53, 73, 92, 61, 42, 71, 84, 58, 77, 49,
  63, 90, 71, 43, 82, 65, 51, 73, 88, 57,
]

export default function BottomPlayer({
  beat,
  isPlaying,
  onTogglePlay,
  onSelect,
}) {
  if (!beat) {
    return null
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#0c0c0f]/95 text-white shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-[1600px] items-center px-3 sm:px-5 lg:px-8">
        {/* CURRENT BEAT */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-[280px]">
          <img
            src={beat.image}
            alt={beat.title}
            className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
          />

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white sm:text-sm">
              {beat.title}
            </p>

            <p className="mt-1 truncate text-[10px] font-medium text-white/35 sm:text-[11px]">
              {beat.producer}
            </p>
          </div>
        </div>

        {/* PLAYBACK */}
        <div className="flex shrink-0 items-center px-3 sm:px-6">
          <button
            type="button"
            onClick={() =>
              onTogglePlay(beat)
            }
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition duration-200 hover:scale-105 active:scale-95"
            aria-label={
              isPlaying
                ? `Pause ${beat.title}`
                : `Play ${beat.title}`
            }
          >
            {isPlaying ? (
              <Pause
                size={19}
                strokeWidth={2.2}
              />
            ) : (
              <Play
                size={19}
                strokeWidth={2.2}
                fill="currentColor"
                className="ml-0.5"
              />
            )}
          </button>
        </div>

        {/* WAVEFORM */}
        <div className="mx-2 hidden h-10 min-w-0 flex-1 items-center gap-[2px] overflow-hidden md:flex lg:mx-6">
          {bars.map(
            (height, index) => (
              <div
                key={index}
                className="min-w-[2px] flex-1 rounded-full bg-white/20"
                style={{
                  height: `${Math.max(
                    6,
                    height * 0.36
                  )}px`,
                }}
              />
            )
          )}
        </div>

        {/* BUY / LICENSE */}
        <div className="ml-auto shrink-0">
          <button
            type="button"
            onClick={() =>
              onSelect(beat)
            }
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 text-[11px] font-semibold text-white transition duration-200 hover:border-white hover:bg-white hover:text-black sm:px-4"
          >
            <ShoppingBag
              size={15}
              strokeWidth={1.9}
            />

            <span className="hidden sm:inline">
              From
            </span>

            <span>
              ₦
              {beat.priceNGN.toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}