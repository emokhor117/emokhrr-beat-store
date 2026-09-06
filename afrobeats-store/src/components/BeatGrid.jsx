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
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015]">
        <div className="text-center">
          <p className="text-sm font-medium text-white/60">
            No beats found
          </p>

          <p className="mt-1 text-xs text-white/30">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {beats.map((beat) => (
        <BeatCard
          key={beat.id}
          beat={beat}
          isActive={
            currentBeat?.id === beat.id
          }
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}