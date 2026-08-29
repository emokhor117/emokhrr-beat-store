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
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          No beats match your search.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {beats.map((beat) => (
        <BeatCard
          key={beat.id}
          beat={beat}
          isActive={currentBeat?.id === beat.id}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}