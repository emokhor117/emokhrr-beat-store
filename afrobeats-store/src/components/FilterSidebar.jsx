import {
  Search,
  X,
} from 'lucide-react'

const tags = [
  'afrobeats',
  'dark r&b',
  'trap soul',
  'chill',
  'melodic',
  'afro fusion',
  'late night',
]

const filterOptions = [
  'All',
  'Afrobeats',
  'Afro-Fusion',
  'Dark R&B',
  'R&B',
  'Trap Soul',
  'Afro-R&B',
]

export default function FilterSidebar({
  search,
  setSearch,
  genre,
  setGenre,
}) {
  const hasFilters =
    search.trim() !== '' ||
    genre !== 'All'

  const clearFilters = () => {
    setSearch('')
    setGenre('All')
  }

  return (
    <aside className="w-full border-b border-white/[0.06] bg-[#09090b] lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="p-4 sm:p-6 lg:sticky lg:top-[72px] lg:p-6">

        {/* SEARCH */}
        <div>
          <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Search
          </label>

          <div className="relative">
            <Search
              size={15}
              strokeWidth={1.8}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search beats"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-9 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/[0.12] focus:border-white/25 focus:bg-white/[0.05]"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch('')
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                aria-label="Clear search"
              >
                <X
                  size={14}
                  strokeWidth={1.8}
                />
              </button>
            )}
          </div>
        </div>

        {/* GENRES */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Genre
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] font-medium text-white/35 transition hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-1">
            {filterOptions.map(
              (option) => {
                const active =
                  genre === option

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setGenre(option)
                    }
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                      active
                        ? 'bg-white text-black'
                        : 'text-white/45 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span>
                      {option}
                    </span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    )}
                  </button>
                )
              }
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-8 border-t border-white/[0.06]" />

        {/* TAGS */}
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Popular tags
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active =
                search
                  .trim()
                  .toLowerCase() ===
                tag.toLowerCase()

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSearch(
                      active
                        ? ''
                        : tag
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${
                    active
                      ? 'border-white bg-white text-black'
                      : 'border-white/[0.08] bg-white/[0.025] text-white/40 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}