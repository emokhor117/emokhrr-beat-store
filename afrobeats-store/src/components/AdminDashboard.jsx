import {
  Archive,
  Boxes,
  CircleDollarSign,
  Disc3,
  FileAudio,
  Image,
  LayoutDashboard,
  LogOut,
  Music2,
  PackageOpen,
  Plus,
  Radio,
  RefreshCw,
  Settings2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  Waves,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import emokhrrLogo from '../assets/emokkhor-logo.png'
import AdminNewBeatModal from './AdminNewBeatModal'
import AdminManageBeatModal from './AdminManageBeatModal'

import { API_URL } from '../config/api'

const statusStyles = {
  ACTIVE: {
    label: 'Active',
    className:
      'bg-emerald-100 text-emerald-700 border-emerald-200',
  },

  DRAFT: {
    label: 'Draft',
    className:
      'bg-orange-100 text-orange-700 border-orange-200',
  },

  ARCHIVED: {
    label: 'Archived',
    className:
      'bg-slate-100 text-slate-600 border-slate-200',
  },

  EXCLUSIVE_SOLD: {
    label: 'Exclusive sold',
    className:
      'bg-violet-100 text-violet-700 border-violet-200',
  },
}

function StatusChip({
  status,
}) {
  const config =
    statusStyles[status] ||
    statusStyles.DRAFT

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${config.className}`}
    >
      {config.label}
    </span>
  )
}

function AssetPill({
  label,
  ready,
  icon: Icon,
}) {
  return (
    <div
      className={[
        'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold',
        ready
          ? 'border-violet-200 bg-violet-50 text-violet-700'
          : 'border-slate-200 bg-white text-slate-400',
      ].join(' ')}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
      />

      {label}
    </div>
  )
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  variant = 'light',
}) {
  const variants = {
    light:
      'border-[#d9d0f7] bg-[#faf9ff] text-[#18141f]',

    violet:
      'border-transparent bg-[#6236ff] text-white',

    orange:
      'border-transparent bg-[#ff9d42] text-[#24163d]',

    lavender:
      'border-[#d4c9ff] bg-[#ddd2ff] text-[#24163d]',
  }

  return (
    <article
      className={`relative overflow-hidden rounded-[24px] border p-5 sm:p-6 ${variants[variant]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${
              variant === 'violet'
                ? 'text-white/55'
                : 'text-[#6d6678]'
            }`}
          >
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            {value}
          </p>

          <p
            className={`mt-2 text-[11px] ${
              variant === 'violet'
                ? 'text-white/50'
                : 'text-[#7c7487]'
            }`}
          >
            {description}
          </p>
        </div>

        <div
          className={[
            'flex h-11 w-11 items-center justify-center rounded-2xl',
            variant === 'violet'
              ? 'bg-white/12 text-white'
              : variant === 'orange'
                ? 'bg-white/35 text-[#24163d]'
                : 'bg-white text-[#6236ff] shadow-sm',
          ].join(' ')}
        >
          <Icon
            size={20}
            strokeWidth={1.8}
          />
        </div>
      </div>
    </article>
  )
}

export default function AdminDashboard({
  onLogout,
}) {
  const [beats, setBeats] =
    useState([])

  const [
  isNewBeatOpen,
  setIsNewBeatOpen,
] = useState(false)

  const [isLoading, setIsLoading] =
    useState(true)

  const [
  selectedBeat,
  setSelectedBeat,
] = useState(null)

  const [error, setError] =
    useState('')

  const [activeSection, setActiveSection] =
    useState('overview')

  const token =
    sessionStorage.getItem(
      'emokhrr_admin_token'
    )

  async function loadBeats() {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/api/admin/beats`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const data =
        await response.json()

      if (response.status === 401) {
        sessionStorage.removeItem(
          'emokhrr_admin_token'
        )

        onLogout()

        return
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to load beats'
        )
      }

      setBeats(
        Array.isArray(data.beats)
          ? data.beats
          : []
      )
    } catch (error) {
      console.error(
        'Admin beat fetch failed:',
        error
      )

      setError(
        error.message ||
          'Unable to load beats'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBeats()
  }, [])

  const stats = useMemo(() => {
    const total =
      beats.length

    const active =
      beats.filter(
        (beat) =>
          beat.status === 'ACTIVE'
      ).length

    const drafts =
      beats.filter(
        (beat) =>
          beat.status === 'DRAFT'
      ).length

    const fullyLoaded =
      beats.filter((beat) => {
        const assets =
          beat.assets || {}

        return (
          assets.artwork &&
          assets.preview &&
          assets.mp3 &&
          assets.wav
        )
      }).length

    return {
      total,
      active,
      drafts,
      fullyLoaded,
    }
  }, [beats])

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'beats',
      label: 'Beats',
      icon: Music2,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: PackageOpen,
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: UploadCloud,
    },
  ]

  return (
    <div className="min-h-screen bg-[#eee9ff] font-['Manrope'] text-[#18141f]">
      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#bca8ff]/30 blur-3xl" />

        <div className="absolute right-[-80px] top-[180px] h-72 w-72 rounded-full bg-[#ffbd7d]/20 blur-3xl" />

        <div className="absolute bottom-[-100px] left-[40%] h-72 w-72 rounded-full bg-[#d8ccff]/35 blur-3xl" />
      </div>

      {/* TOP BAR */}
      <header className="relative z-20 border-b border-[#d9d0f7]/80 bg-[#f7f3ff]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1700px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={emokhrrLogo}
              alt="EMOKHRR"
              className="h-8 w-auto object-contain"
            />

            <span className="rounded-full border border-[#d8ccff] bg-white/70 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#6d5ab5]">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-semibold text-emerald-700 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Store live
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 items-center gap-2 rounded-full border border-[#d9d0f7] bg-white/70 px-4 text-[10px] font-semibold text-[#5f586a] transition hover:border-[#6236ff]/20 hover:bg-white hover:text-[#18141f]"
            >
              <LogOut
                size={14}
                strokeWidth={1.8}
              />

              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-[1700px]">
        {/* SIDEBAR */}
        <aside className="hidden min-h-[calc(100vh-78px)] w-[240px] shrink-0 border-r border-[#d8cff5] bg-[#f4efff]/70 p-5 backdrop-blur-xl lg:block">
          <nav className="space-y-1.5">
            {sidebarItems.map(
              (item) => {
                const Icon =
                  item.icon

                const selected =
                  activeSection ===
                  item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        item.id
                      )
                    }
                    className={[
                      'flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[11px] font-semibold transition',
                      selected
                        ? 'bg-[#6236ff] text-white shadow-[0_8px_24px_rgba(98,54,255,0.24)]'
                        : 'text-[#6f687a] hover:bg-white/60 hover:text-[#24163d]',
                    ].join(' ')}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.8}
                    />

                    {item.label}
                  </button>
                )
              }
            )}
          </nav>

          <div className="mt-8 rounded-[22px] border border-[#d8cff5] bg-white/60 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ddd2ff] text-[#6236ff]">
              <Sparkles
                size={16}
              />
            </div>

            <p className="mt-4 text-[11px] font-semibold text-[#24163d]">
              EMOKHRR Control Room
            </p>

            <p className="mt-2 text-[10px] leading-5 text-[#82798d]">
              Manage your catalogue,
              assets and sales from one
              place.
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
          {/* PAGE HEADER */}
          <section className="overflow-hidden rounded-[30px] border border-[#d7cdf5] bg-gradient-to-br from-[#faf9ff] via-[#f2ecff] to-[#e5dcff] p-6 shadow-[0_20px_50px_rgba(69,46,125,0.08)] sm:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff9d42]" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7d7192]">
                    EMOKHRR Admin
                  </p>
                </div>

                <h1 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#18141f] sm:text-4xl lg:text-5xl">
                  Your sound.
                  <br />
                  Your catalogue.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#746c7e]">
                  Manage releases,
                  uploads, pricing and
                  publishing from one
                  creative workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadBeats}
                  className="flex h-11 items-center gap-2 rounded-full border border-[#cfc3f6] bg-white/80 px-4 text-[10px] font-semibold text-[#625a70] transition hover:bg-white"
                >
                  <RefreshCw
                    size={14}
                  />

                  Refresh
                </button>

               <button
  type="button"
  onClick={() =>
    setIsNewBeatOpen(true)
  }
  className="flex h-11 items-center gap-2 rounded-full bg-[#6236ff] px-5 text-[10px] font-semibold text-white shadow-[0_10px_26px_rgba(98,54,255,0.28)] transition hover:bg-[#5127e8]"
>
  <Plus size={15} />
  New beat
</button>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total beats"
              value={stats.total}
              description="All catalogue entries"
              icon={Disc3}
              variant="light"
            />

            <StatCard
              label="Active"
              value={stats.active}
              description="Published on your store"
              icon={Radio}
              variant="violet"
            />

            <StatCard
              label="Drafts"
              value={stats.drafts}
              description="Still being prepared"
              icon={SlidersHorizontal}
              variant="orange"
            />

            <StatCard
              label="Delivery ready"
              value={stats.fullyLoaded}
              description="Core assets uploaded"
              icon={Boxes}
              variant="lavender"
            />
          </section>

          {/* BEATS HEADER */}
          <section className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8b8198]">
                  Catalogue
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#18141f]">
                  Your beats
                </h2>
              </div>

              <p className="text-[10px] text-[#8f879a]">
                {beats.length}{' '}
                {beats.length === 1
                  ? 'beat'
                  : 'beats'}
              </p>
            </div>

            {/* LOADING */}
            {isLoading && (
              <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-[26px] border border-[#d9d0f7] bg-white/55">
                <div className="text-center">
                  <RefreshCw
                    size={22}
                    className="mx-auto animate-spin text-[#6236ff]"
                  />

                  <p className="mt-4 text-xs text-[#7a7285]">
                    Loading your catalogue...
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}
            {!isLoading &&
              error && (
                <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 p-6">
                  <p className="text-sm font-semibold text-red-700">
                    Couldn't load beats
                  </p>

                  <p className="mt-2 text-xs text-red-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={
                      loadBeats
                    }
                    className="mt-4 rounded-full bg-red-600 px-4 py-2 text-[10px] font-semibold text-white"
                  >
                    Try again
                  </button>
                </div>
              )}

            {/* EMPTY */}
            {!isLoading &&
              !error &&
              beats.length ===
                0 && (
                <div className="mt-6 flex min-h-[340px] items-center justify-center rounded-[26px] border border-dashed border-[#cfc4ee] bg-white/45 p-8 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ddd2ff] text-[#6236ff]">
                      <Music2
                        size={23}
                      />
                    </div>

                    <h3 className="mt-5 text-sm font-semibold text-[#24163d]">
                      No beats yet
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-[#82798d]">
                      Create your first
                      beat and begin
                      building your
                      catalogue.
                    </p>
                  </div>
                </div>
              )}

            {/* BEAT LIST */}
            {!isLoading &&
              !error &&
              beats.length > 0 && (
                <div className="mt-6 space-y-4">
                  {beats.map(
                    (beat) => (
                      <article
                        key={
                          beat.id
                        }
                        className="group overflow-hidden rounded-[26px] border border-[#d9d0f7] bg-[#faf9ff]/90 p-4 shadow-[0_10px_28px_rgba(71,50,120,0.05)] transition hover:-translate-y-0.5 hover:border-[#bfaeff] hover:shadow-[0_18px_40px_rgba(71,50,120,0.09)] sm:p-5"
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          {/* LEFT */}
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#6236ff] via-[#8668ff] to-[#ff9d42] text-white shadow-md">
                              <Music2
                                size={24}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-semibold tracking-[-0.02em] text-[#18141f]">
                                  {
                                    beat.title
                                  }
                                </h3>

                                <StatusChip
                                  status={
                                    beat.status
                                  }
                                />
                              </div>

                              <p className="mt-2 text-[10px] text-[#7f7689]">
                                {beat.genre ||
                                  'No genre'}

                                {beat.bpm
                                  ? ` · ${beat.bpm} BPM`
                                  : ''}

                                {beat.key
                                  ? ` · ${beat.key}`
                                  : ''}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <AssetPill
                                  label="Art"
                                  ready={
                                    beat
                                      .assets
                                      ?.artwork
                                  }
                                  icon={
                                    Image
                                  }
                                />

                                <AssetPill
                                  label="Preview"
                                  ready={
                                    beat
                                      .assets
                                      ?.preview
                                  }
                                  icon={
                                    Waves
                                  }
                                />

                                <AssetPill
                                  label="MP3"
                                  ready={
                                    beat
                                      .assets
                                      ?.mp3
                                  }
                                  icon={
                                    FileAudio
                                  }
                                />

                                <AssetPill
                                  label="WAV"
                                  ready={
                                    beat
                                      .assets
                                      ?.wav
                                  }
                                  icon={
                                    FileAudio
                                  }
                                />

                                <AssetPill
                                  label="Stems"
                                  ready={
                                    beat
                                      .assets
                                      ?.stems
                                  }
                                  icon={
                                    Archive
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                            <div className="rounded-2xl bg-[#f1ecff] px-4 py-3">
                              <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#9187a1]">
                                From
                              </p>

                              <p className="mt-1 text-sm font-semibold text-[#6236ff]">
                                {beat.lowestPriceNGN
                                  ? `₦${beat.lowestPriceNGN.toLocaleString(
                                      'en-NG'
                                    )}`
                                  : 'Not priced'}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-[#fff3e7] px-4 py-3">
                              <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a47f5e]">
                                Licenses
                              </p>

                              <p className="mt-1 text-sm font-semibold text-[#8a5524]">
                                {
                                  beat
                                    .licenses
                                    ?.length
                                }
                              </p>
                            </div>

                            <button
  type="button"
  onClick={() =>
    setSelectedBeat(beat)
  }
  className="flex h-11 items-center gap-2 rounded-full border border-[#cfc3f6] bg-white px-4 text-[10px] font-semibold text-[#4f4660] transition hover:border-[#6236ff]/30 hover:text-[#6236ff]"
>
  <Settings2
    size={14}
  />

  Manage
</button>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
          </section>
        </main>
      </div>
      <AdminNewBeatModal
  isOpen={isNewBeatOpen}
  onClose={() =>
    setIsNewBeatOpen(false)
  }
  onCreated={() => {
    setIsNewBeatOpen(false)
    loadBeats()
  }}
/>

<AdminManageBeatModal
  beat={selectedBeat}
  isOpen={Boolean(selectedBeat)}
  onClose={() =>
    setSelectedBeat(null)
  }
  onUpdated={async () => {
    await loadBeats()
  }}
/>
    </div>
  )
}