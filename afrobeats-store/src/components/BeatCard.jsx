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
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#dde5ef] shadow-[0_14px_35px_rgba(39,53,76,0.08)]">
        <img
          src={beat.image || beat.artworkUrl}
          alt={beat.title}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.035]"
        />

        {/* OVERLAY */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827]/55 via-transparent to-transparent transition duration-300 ${
            isActive
              ? 'opacity-100'
              : 'opacity-40 md:opacity-30 md:group-hover:opacity-100'
          }`}
        />

        {/* GENRE */}
        {beat.genre && (
          <div className="absolute left-3.5 top-3.5">
            <span className="rounded-full border border-white/50 bg-white/80 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#39475b] shadow-sm backdrop-blur-md">
              {beat.genre}
            </span>
          </div>
        )}

        {/* PLAY */}
        <button
          type="button"
          onClick={() =>
            onTogglePlay(beat)
          }
          aria-label={
            isActive && isPlaying
              ? `Pause ${beat.title}`
              : `Play ${beat.title}`
          }
          className={`
            absolute left-1/2 top-1/2
            flex h-14 w-14
            -translate-x-1/2 -translate-y-1/2
            items-center justify-center
            rounded-full
            bg-white
            text-[#18202d]
            shadow-[0_15px_35px_rgba(15,23,42,0.25)]
            transition duration-200
            active:scale-95

            ${
              isActive
                ? 'scale-100 opacity-100'
                : `
                  scale-100 opacity-100
                  md:scale-90 md:opacity-0
                  md:group-hover:scale-100
                  md:group-hover:opacity-100
                `
            }
          `}
        >
          {isActive && isPlaying ? (
            <Pause
              size={20}
              strokeWidth={2}
            />
          ) : (
            <Play
              size={20}
              strokeWidth={2}
              fill="currentColor"
              className="ml-0.5"
            />
          )}
        </button>

        {/* PLAYING STATUS */}
        {isActive && (
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full border border-white/20 bg-[#18202d]/80 px-3 py-1.5 text-white backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              {isPlaying && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9c5ff] opacity-75" />
              )}

              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c9c5ff]" />
            </span>

            <span className="text-[8px] font-bold">
              {isPlaying
                ? 'Playing'
                : 'Paused'}
            </span>
          </div>
        )}
      </div>

      {/* INFORMATION */}
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold tracking-[-0.025em] text-[#18202d]">
              {beat.title}
            </h3>

            <p className="mt-1.5 truncate text-[10px] font-semibold text-[#8b96a7]">
              {[
                beat.bpm
                  ? `${beat.bpm} BPM`
                  : null,
                beat.key,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>

          {/* LICENSE */}
          <button
            type="button"
            onClick={() =>
              onSelect(beat)
            }
            disabled={
              beat.priceNGN == null
            }
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#18202d]/10 bg-white/65 px-3 py-2 text-[9px] font-bold text-[#253044] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#18202d] hover:bg-[#18202d] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag
              size={11}
              strokeWidth={2}
            />

            {beat.priceNGN != null ? (
              <span>
                ₦{' '}
                {beat.priceNGN.toLocaleString(
                  'en-NG'
                )}
              </span>
            ) : (
              <span>
                Unavailable
              </span>
            )}
          </button>
        </div>

        {/* MOOD */}
        {beat.mood && (
          <p className="mt-2.5 truncate text-[9px] font-medium text-[#a0a9b7]">
            {beat.mood}
          </p>
        )}
      </div>
    </article>
  )
}