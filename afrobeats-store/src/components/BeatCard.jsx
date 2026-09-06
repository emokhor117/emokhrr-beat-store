import {
  Pause,
  Play,
  ShoppingBag,
} from 'lucide-react'

export default function BeatCard({
  beat,
  isActive,
  isPlaying,
  onTogglePlay,
  onSelect,
}) {
  return (
    <article className="group">
      {/* ARTWORK */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#151518]">
        <img
          src={beat.image}
          alt={beat.title}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.035]"
        />

        {/* DARK HOVER OVERLAY */}
        <div
          className={`absolute inset-0 transition duration-300 ${
            isActive
              ? 'bg-black/25'
              : 'bg-black/0 group-hover:bg-black/35'
          }`}
        />

        {/* PLAY BUTTON */}
        <button
          type="button"
          onClick={() => onTogglePlay(beat)}
          aria-label={
            isActive && isPlaying
              ? `Pause ${beat.title}`
              : `Play ${beat.title}`
          }
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-200 ${
            isActive
              ? 'scale-100 opacity-100'
              : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
          }`}
        >
          {isActive && isPlaying ? (
            <Pause
              size={21}
              strokeWidth={2}
            />
          ) : (
            <Play
              size={21}
              strokeWidth={2}
              className="ml-0.5"
              fill="currentColor"
            />
          )}
        </button>

        {/* ACTIVE INDICATOR */}
        {isActive && (
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />

            <span className="text-[10px] font-medium text-white">
              {isPlaying
                ? 'Playing'
                : 'Paused'}
            </span>
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
              {beat.title}
            </h3>

            <p className="mt-1 truncate text-[11px] font-medium text-white/35">
              {beat.genre}
              {' · '}
              {beat.bpm} BPM
              {' · '}
              {beat.key}
            </p>
          </div>

          {/* LICENSE / BUY */}
          <button
            type="button"
            onClick={() => onSelect(beat)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.05] px-3.5 py-2 text-[11px] font-semibold text-white transition duration-200 hover:border-white hover:bg-white hover:text-black"
          >
            <ShoppingBag
              size={13}
              strokeWidth={2}
            />

           {beat.priceNGN != null ? (
  <span>
    From ₦
    {beat.priceNGN.toLocaleString(
      'en-NG'
    )}
  </span>
) : (
  <span>Unavailable</span>
)}
          </button>
        </div>

        {/* OPTIONAL MOOD */}
        {beat.mood && (
          <p className="mt-2 truncate text-[11px] text-white/25">
            {beat.mood}
          </p>
        )}
      </div>
    </article>
  )
}