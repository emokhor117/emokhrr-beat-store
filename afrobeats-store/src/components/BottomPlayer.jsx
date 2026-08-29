import {
  Pause,
  Play,
  ShoppingCart,
  SkipBack,
  SkipForward,
  Volume2,
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
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-purple-600 bg-[#080809] text-white">
      <div className="flex h-20 items-center">
        <div className="flex h-full w-60 shrink-0 items-center gap-3 border-r border-white/10 px-4">
          <img
            src={beat.image}
            alt=""
            className="h-14 w-14 object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {beat.title}
            </p>

            <p className="truncate text-[10px] uppercase tracking-wide text-slate-400">
              {beat.producer}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 px-5">
          <SkipBack
            size={19}
            className="cursor-pointer text-slate-400 hover:text-white"
          />

          <button
            type="button"
            onClick={() => onTogglePlay(beat)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"
          >
            {isPlaying ? (
              <Pause size={19} />
            ) : (
              <Play size={19} className="ml-0.5" />
            )}
          </button>

          <SkipForward
            size={19}
            className="cursor-pointer text-slate-400 hover:text-white"
          />
        </div>

        <div className="hidden flex-1 items-center gap-[3px] overflow-hidden px-5 md:flex">
          {bars.map((height, index) => (
            <div
              key={index}
              className="min-w-[3px] flex-1 rounded-full bg-purple-600"
              style={{
                height: `${Math.max(10, height * 0.55)}px`,
              }}
            />
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-5 px-5">
          <button
            type="button"
            onClick={() => onSelect(beat)}
            className="flex items-center gap-2 text-xs font-bold"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">
              ₦{beat.priceNGN.toLocaleString()}
            </span>
          </button>

          <Volume2
            size={19}
            className="text-slate-300"
          />
        </div>
      </div>
    </footer>
  )
}