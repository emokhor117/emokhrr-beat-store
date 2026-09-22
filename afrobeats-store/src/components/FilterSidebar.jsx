import {
  Search,
  SlidersHorizontal,
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

export default function FilterSidebar({
  search,
  setSearch,
  genre,
  setGenre,
  genres = [],
}) {
  const hasFilters =
    search.trim() !== '' ||
    genre !== 'All'

  function clearFilters() {
    setSearch('')
    setGenre('All')
  }

  return (
    <aside className="w-full lg:w-[230px] lg:shrink-0">
      <div className="rounded-[24px] border border-white/70 bg-white/55 p-4 shadow-[0_15px_40px_rgba(42,57,80,0.06)] backdrop-blur-xl sm:p-5 lg:sticky lg:top-[100px]">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4e7ff] text-[#59617f]">
              <SlidersHorizontal
                size={13}
                strokeWidth={2}
              />
            </div>

            <p className="text-[10px] font-bold text-[#263144]">
              Find your sound
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[9px] font-bold text-[#8c97a8] transition hover:text-[#18202d]"
            >
              Clear
            </button>
          )}
        </div>

        {/* SEARCH */}
        <div>
          <label
            htmlFor="beat-search"
            className="mb-2.5 block text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa4b2]"
          >
            Search
          </label>

          <div className="relative">
            <Search
              size={13}
              strokeWidth={1.8}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8995a6]"
            />

            <input
              id="beat-search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search beats"
              className="h-11 w-full rounded-xl border border-[#18202d]/[0.07] bg-[#f5f7fb]/80 pl-10 pr-9 text-[10px] font-semibold text-[#253044] outline-none transition placeholder:text-[#a3adba] hover:border-[#18202d]/10 focus:border-[#8c89d9]/50 focus:bg-white focus:ring-4 focus:ring-[#aaa7ed]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch('')
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba5b3] transition hover:text-[#18202d]"
                aria-label="Clear search"
              >
                <X
                  size={13}
                />
              </button>
            )}
          </div>
        </div>

        {/* GENRE */}
        <div className="mt-7">
          <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa4b2]">
            Genre
          </p>

          <div className="space-y-1">
            {genres.map(
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
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[10px] font-semibold transition ${
                      active
                        ? 'bg-[#18202d] text-white shadow-[0_8px_20px_rgba(24,32,45,0.14)]'
                        : 'text-[#788496] hover:bg-[#edf1f7] hover:text-[#253044]'
                    }`}
                  >
                    <span>
                      {option}
                    </span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c9c5ff]" />
                    )}
                  </button>
                )
              }
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-6 border-t border-[#18202d]/[0.06]" />

        {/* TAGS */}
        <div>
          <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.18em] text-[#9aa4b2]">
            Popular tags
          </p>

          <div className="flex flex-wrap gap-1.5">
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
                  className={`rounded-full border px-2.5 py-1.5 text-[8px] font-semibold transition ${
                    active
                      ? 'border-[#18202d] bg-[#18202d] text-white'
                      : 'border-[#18202d]/[0.07] bg-[#f5f7fb]/70 text-[#8b96a6] hover:border-[#a7a3e4] hover:bg-[#ecebff] hover:text-[#565d80]'
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