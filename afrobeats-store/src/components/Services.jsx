import {
  ArrowUpRight,
  AudioLines,
  Headphones,
  Sparkles,
} from 'lucide-react'

const services = [
  {
    number: '01',
    title: 'Custom Production',
    description:
      'Need something built specifically around your sound? Send references, your direction and the feeling you want to create.',
    icon: AudioLines,
    tag: 'Built from scratch',
  },
  {
    number: '02',
    title: 'Mix & Master',
    description:
      'Already recorded? Send your vocals and stems and get a polished, release-ready mix and master.',
    icon: Headphones,
    tag: 'Release ready',
  },
  {
    number: '03',
    title: 'Full Production',
    description:
      'From the first idea to the final master. Custom production, arrangement, mixing and mastering handled as one complete process.',
    icon: Sparkles,
    tag: 'Start to finish',
  },
]

const INSTAGRAM_URL =
  'https://www.instagram.com/emokkhor.od/'

export default function Services() {
  function openInstagram() {
    window.open(
      INSTAGRAM_URL,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <section className="relative overflow-hidden bg-[#eef3fb]">
      {/* BACKGROUND DETAILS */}
      <div className="pointer-events-none absolute -left-32 top-28 h-80 w-80 rounded-full bg-[#d8d5ff]/45 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#c9f3ee]/55 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* HEADING */}
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#7770bc]" />

              <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#806da0]">
                Work with ME
              </p>
            </div>

            <h2 className="max-w-3xl text-4xl font-extrabold tracking-[-0.055em] text-[#18202d] sm:text-5xl lg:text-6xl">
              Your record deserves
              <span className="text-[#7770bc]">
                {' '}
                more than a beat.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-md text-sm font-medium leading-7 text-[#7f899a]">
              Whether you need a sound built
              from scratch or a record taken
              across the finish line, we can
              work directly on your release.
            </p>

            <button
              type="button"
              onClick={openInstagram}
              className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#18202d] transition hover:text-[#7770bc]"
            >
              

              @emokkhor.od

              <ArrowUpRight
                size={14}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* SERVICES */}
        <div className="mt-14 overflow-hidden rounded-[30px] border border-[#172033]/[0.07] bg-white/55 shadow-[0_25px_70px_rgba(31,42,68,0.08)] backdrop-blur-xl sm:mt-16">
          {services.map(
            (service, index) => {
              const Icon = service.icon

              return (
                <div
                  key={service.title}
                  className={`group relative grid gap-6 px-5 py-7 transition duration-300 hover:bg-white/70 sm:px-7 lg:grid-cols-[70px_1fr_1fr_auto] lg:items-center lg:gap-8 lg:px-9 lg:py-9 ${
                    index !==
                    services.length - 1
                      ? 'border-b border-[#172033]/[0.07]'
                      : ''
                  }`}
                >
                  {/* NUMBER */}
                  <p className="hidden text-[10px] font-extrabold tracking-[0.18em] text-[#a0a9b8] lg:block">
                    {service.number}
                  </p>

                  {/* TITLE */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#172033]/[0.06] bg-[#f4f1ff] text-[#7168ae] transition duration-300 group-hover:scale-105">
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="mb-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#938ba5] lg:hidden">
                        {service.number}
                      </p>

                      <h3 className="text-lg font-extrabold tracking-[-0.035em] text-[#18202d] sm:text-xl">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <span className="mb-2 inline-flex rounded-full bg-[#edf0ff] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#746da1]">
                      {service.tag}
                    </span>

                    <p className="max-w-lg text-xs font-medium leading-6 text-[#7f899a]">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={openInstagram}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#18202d] px-5 text-[10px] font-extrabold text-white shadow-[0_10px_25px_rgba(24,32,45,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#7770bc] lg:w-auto"
                  >
                    Enquire

                    <ArrowUpRight
                      size={14}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              )
            }
          )}
        </div>

        {/* BOTTOM CALLOUT */}
        <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-[#172033]/[0.06] bg-[#18202d] px-6 py-6 text-white shadow-[0_18px_45px_rgba(24,32,45,0.12)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#c9c5ff]">
              Something else in mind?
            </p>

            <p className="mt-2 text-sm font-semibold text-white/70">
              Send the idea over and we can
              figure out what the record needs.
            </p>
          </div>

          <button
            type="button"
            onClick={openInstagram}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-[10px] font-extrabold text-[#18202d] transition duration-200 hover:scale-[1.02]"
          >
            

            DM on Instagram
          </button>
        </div>
      </div>
    </section>
  )
}