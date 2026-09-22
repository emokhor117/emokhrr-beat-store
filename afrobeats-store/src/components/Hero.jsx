import {
  ArrowRight,
  Headphones,
  Pause,
  Play,
} from 'lucide-react'

export default function Hero({
  onExploreBeats,
  onServices,
  featuredBeat,
  onPlayFeatured,
  isFeaturedPlaying,
}) {
  const artwork =
    featuredBeat?.image ||
    featuredBeat?.artworkUrl

  return (
    <section className="relative overflow-hidden bg-[#eef3fb]">
      {/* BACKGROUND LIGHT */}
      <div className="pointer-events-none absolute left-[35%] top-[8%] h-[380px] w-[380px] rounded-full bg-[#dcd7ff]/55 blur-[110px] sm:h-[500px] sm:w-[500px]" />

      <div className="pointer-events-none absolute right-[-15%] top-[35%] h-[320px] w-[320px] rounded-full bg-[#d7f6f4]/70 blur-[100px] sm:h-[400px] sm:w-[400px]" />

      <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* HERO SHELL */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/45 shadow-[0_25px_80px_rgba(66,80,110,0.10)] backdrop-blur-xl sm:rounded-[28px]">
          <div className="grid lg:min-h-[610px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {/* COPY */}
            <div className="relative z-10 px-5 pb-8 pt-9 sm:px-10 sm:pb-12 sm:pt-12 lg:px-16 lg:py-20">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-[#687488] sm:text-[9px]">
                EMOKKHOR ORIGINALS
              </p>

              <h1 className="mt-4 max-w-[570px] text-[42px] font-semibold leading-[0.96] tracking-[-0.06em] text-[#151c28] min-[390px]:text-[48px] sm:mt-5 sm:text-[64px] lg:text-[clamp(4rem,5.8vw,6rem)]">
                Find your next
                <span className="block">
                  sound.
                </span>
              </h1>

              <p className="mt-5 max-w-[450px] text-[12px] font-medium leading-6 text-[#647083] sm:mt-7 sm:text-sm sm:leading-7">
                Original beats crafted for
                artists building records with
                character. Preview, choose your
                license and get your files
                instantly.
              </p>

              {/* CTA */}
              <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={onExploreBeats}
                  className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-[#18202d] px-3 text-[9px] font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#293446] sm:justify-start sm:gap-3 sm:px-5 sm:text-[10px]"
                >
                  Explore beats

                  <ArrowRight
                    size={13}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={onServices}
                  className="h-11 rounded-xl border border-[#172033]/[0.07] bg-white/40 px-3 text-[9px] font-extrabold text-[#354154] transition hover:bg-white/80 sm:border-transparent sm:bg-transparent sm:px-5 sm:text-[10px]"
                >
                  Production services
                </button>
              </div>

              {/* INFO */}
              <div className="mt-8 flex items-center gap-3 sm:mt-11">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#172033]/10 bg-white/60">
                  <Headphones
                    size={13}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold text-[#273142]">
                    Preview before you buy
                  </p>

                  <p className="mt-0.5 text-[8px] font-medium text-[#8792a3]">
                    Mastered & tagged store
                    previews
                  </p>
                </div>
              </div>
            </div>

            {/* FEATURED BEAT */}
            <div className="relative flex min-h-[390px] items-end justify-center self-stretch sm:min-h-[500px] lg:min-h-[610px]">
              {/* COLOURED ARCH */}
              <div className="absolute bottom-[-75px] left-1/2 h-[400px] w-[94%] -translate-x-1/2 rounded-t-[180px] bg-gradient-to-b from-[#d8d4ff] via-[#d7edf7] to-[#ccefe9] sm:bottom-[-90px] sm:h-[500px] sm:w-[82%] sm:rounded-t-[240px] lg:h-[560px]" />

              {/* ARTWORK */}
              <div className="relative z-10 w-[68%] max-w-[300px] sm:w-[65%] sm:max-w-[390px] lg:w-[72%] lg:max-w-[430px]">
                <div className="relative aspect-square overflow-hidden rounded-t-[150px] border border-white/70 bg-[#d9ddea] shadow-[0_30px_70px_rgba(51,61,85,0.18)] sm:rounded-t-[190px] lg:rounded-t-[210px]">
                  {artwork ? (
                    <img
                      src={artwork}
                      alt={
                        featuredBeat?.title ||
                        'Featured beat'
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d6d1f5] via-[#cce5ef] to-[#d3eee9]">
                      <Headphones
                        size={60}
                        strokeWidth={1}
                        className="text-[#68748b]/40"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#18202d]/45 via-transparent to-transparent" />

                  {featuredBeat?.previewUrl && (
                    <button
                      type="button"
                      onClick={onPlayFeatured}
                      className="absolute bottom-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#18202d] shadow-xl transition duration-200 hover:scale-105 active:scale-95 sm:bottom-6 sm:h-14 sm:w-14"
                      aria-label={
                        isFeaturedPlaying
                          ? 'Pause featured beat'
                          : 'Play featured beat'
                      }
                    >
                      {isFeaturedPlaying ? (
                        <Pause
                          size={17}
                          strokeWidth={2}
                        />
                      ) : (
                        <Play
                          size={17}
                          fill="currentColor"
                          className="ml-0.5"
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* MOBILE FEATURE LABEL */}
              {featuredBeat && (
                <div className="absolute left-4 top-4 z-20 max-w-[130px] rounded-xl border border-white/70 bg-white/80 px-3 py-2.5 shadow-[0_12px_30px_rgba(49,61,84,0.10)] backdrop-blur-xl sm:hidden">
                  <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#8a94a3]">
                    Featured
                  </p>

                  <p className="mt-1 truncate text-[10px] font-extrabold text-[#1e2735]">
                    {featuredBeat.title}
                  </p>
                </div>
              )}

              {/* MOBILE BPM */}
              {featuredBeat?.bpm && (
                <div className="absolute right-4 top-4 z-20 rounded-xl border border-white/70 bg-white/80 px-3 py-2.5 shadow-[0_12px_30px_rgba(49,61,84,0.10)] backdrop-blur-xl sm:hidden">
                  <p className="text-[7px] font-semibold text-[#8993a1]">
                    BPM
                  </p>

                  <p className="mt-0.5 text-[11px] font-extrabold text-[#202938]">
                    {featuredBeat.bpm}
                  </p>
                </div>
              )}

              {/* DESKTOP / TABLET CARDS */}
              {featuredBeat?.bpm && (
                <FloatingCard className="left-[5%] top-[29%] lg:left-[3%]">
                  <span>BPM</span>
                  <strong>
                    {featuredBeat.bpm}
                  </strong>
                </FloatingCard>
              )}

              {featuredBeat?.key && (
                <FloatingCard className="right-[4%] top-[42%]">
                  <span>Key</span>
                  <strong>
                    {featuredBeat.key}
                  </strong>
                </FloatingCard>
              )}

              {featuredBeat?.priceNGN != null && (
                <FloatingCard className="bottom-[13%] left-[4%] lg:left-[7%]">
                  <span>
                    Licenses from
                  </span>

                  <strong>
                    ₦
                    {featuredBeat.priceNGN.toLocaleString(
                      'en-NG'
                    )}
                  </strong>
                </FloatingCard>
              )}

              {featuredBeat && (
                <div className="absolute right-[4%] top-[15%] z-20 hidden max-w-[150px] rounded-xl border border-white/70 bg-white/75 px-4 py-3 shadow-[0_15px_40px_rgba(49,61,84,0.10)] backdrop-blur-xl sm:block">
                  <p className="text-[8px] font-semibold text-[#8a94a3]">
                    Featured beat
                  </p>

                  <p className="mt-1 truncate text-[11px] font-bold text-[#1e2735]">
                    {featuredBeat.title}
                  </p>

                  {featuredBeat.genre && (
                    <p className="mt-1 truncate text-[8px] font-medium text-[#8791a0]">
                      {featuredBeat.genre}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FloatingCard({
  children,
  className = '',
}) {
  return (
    <div
      className={`absolute z-20 hidden min-w-[110px] rounded-xl border border-white/80 bg-white/80 px-4 py-3 shadow-[0_15px_40px_rgba(49,61,84,0.11)] backdrop-blur-xl sm:block ${className}`}
    >
      <div className="flex flex-col">
        <span className="text-[8px] font-medium text-[#8993a1]">
          {children[0]}
        </span>

        <strong className="mt-1 text-[13px] font-bold tracking-[-0.03em] text-[#202938]">
          {children[1]}
        </strong>
      </div>
    </div>
  )
}