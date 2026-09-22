import {
  Music2,
  SearchX,
} from 'lucide-react'

import BeatCard from './BeatCard'

export default function BeatGrid({
  beats,
  currentBeat,
  isPlaying,
  onTogglePlay,
  onSelect,
}) {
  if (beats.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-dashed border-[#18202d]/10 bg-white/40">
        <div className="max-w-[300px] px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#69768a] shadow-sm">
            <SearchX
              size={19}
              strokeWidth={1.7}
            />
          </div>

          <p className="mt-5 text-sm font-bold text-[#1c2533]">
            No beats found
          </p>

          <p className="mt-2 text-[11px] leading-5 text-[#7c8798]">
            Try changing your search,
            genre or selected tag.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* RESULT COUNT */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2
            size={14}
            strokeWidth={1.8}
            className="text-[#69768a]"
          />

          <p className="text-[10px] font-semibold text-[#69768a]">
            {beats.length}{' '}
            {beats.length === 1
              ? 'beat'
              : 'beats'}
          </p>
        </div>

        <p className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9aa4b3] sm:block">
          EMOKKHOR CATALOGUE
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {beats.map((beat) => (
          <BeatCard
            key={beat.id}
            beat={beat}
            isActive={
              currentBeat?.id ===
              beat.id
            }
            isPlaying={isPlaying}
            onTogglePlay={
              onTogglePlay
            }
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}