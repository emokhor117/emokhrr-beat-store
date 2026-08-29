import { ChevronRight, Search } from 'lucide-react'

const tags = [
  'afrobeats',
  'dark r&b',
  'trap soul',
  'chill',
  'melodic',
  'afro fusion',
  'late night',
]

export default function FilterSidebar({
  search,
  setSearch,
  genre,
  setGenre,
}) {
  const filterOptions = [
    'All',
    'Afrobeats',
    'Afro-Fusion',
    'Dark R&B',
    'R&B',
    'Trap Soul',
    'Afro-R&B',
  ]

  return (
    <aside className="w-full border-r border-black/5 bg-[#f3f3f4] p-5 lg:w-64 lg:shrink-0">
      <div className="relative">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search beats..."
          className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-400"
        />
      </div>

      <div className="mt-7">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">
          Filter by
        </p>

        <select
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          Mood
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          BPM
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="my-7 border-t border-slate-300" />

      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700">
          Popular tags
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearch(tag)}
              className="rounded-md bg-purple-600 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-purple-500"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}