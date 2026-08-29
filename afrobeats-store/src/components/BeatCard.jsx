import {
  Pause,
  Play,
  ShoppingCart,
} from 'lucide-react'

export default function BeatCard({
  beat,
  isActive,
  isPlaying,
  onTogglePlay,
  onSelect,
}) {
  return (
    <article className="group overflow-hidden rounded-sm bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-slate-200">
        <img
          src={beat.image}
          alt={beat.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

        <button
          type="button"
          onClick={() => onTogglePlay(beat)}
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-white shadow-xl transition ${
            isActive
              ? 'scale-100 bg-purple-600'
              : 'scale-90 bg-black/60 opacity-0 group-hover:scale-100 group-hover:opacity-100'
          }`}
        >
          {isActive && isPlaying ? (
            <Pause size={23} />
          ) : (
            <Play size={23} className="ml-1" />
          )}
        </button>
      </div>

      <div className="p-3">
        <h3 className="truncate text-base font-bold text-slate-900">
          {beat.title}
        </h3>

        <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {beat.genre} · {beat.bpm} BPM · {beat.key}
        </p>

        <button
          type="button"
          onClick={() => onSelect(beat)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-[#0d0d0f] py-2.5 text-xs font-bold text-white transition hover:bg-purple-600"
        >
          <ShoppingCart size={14} />
          ₦{beat.priceNGN.toLocaleString()}
        </button>
      </div>
    </article>
  )
}