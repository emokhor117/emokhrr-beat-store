import {
  Pause,
  Play,
  ShoppingBag,
} from 'lucide-react'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import WaveSurfer from 'wavesurfer.js'

function formatTime(seconds = 0) {
  if (!Number.isFinite(seconds)) {
    return '0:00'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(
    seconds % 60
  )

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

export default function BottomPlayer({
  beat,
  isPlaying,
  onTogglePlay,
  onSelect,
  audioRef,
}) {
  const waveformContainerRef =
    useRef(null)

  const waveSurferRef =
    useRef(null)

  const [currentTime, setCurrentTime] =
    useState(0)

  const [duration, setDuration] =
    useState(0)

  const [waveformReady, setWaveformReady] =
    useState(false)

  /*
   * Create the waveform for the currently
   * selected beat.
   *
   * IMPORTANT:
   * WaveSurfer uses the SAME <audio>
   * element owned by App.jsx.
   */
  useEffect(() => {
    const audio =
      audioRef?.current

    const container =
      waveformContainerRef.current

    if (
      !beat?.previewUrl ||
      !audio ||
      !container
    ) {
      return
    }

    setCurrentTime(
      audio.currentTime || 0
    )

    setDuration(
      Number.isFinite(audio.duration)
        ? audio.duration
        : 0
    )

    setWaveformReady(false)

    const wavesurfer =
      WaveSurfer.create({
        container,

        media: audio,

        url: beat.previewUrl,

        height: 44,

        waveColor:
          'rgba(24, 32, 45, 0.16)',

        progressColor:
          '#18202d',

        cursorColor:
          '#7770bc',

        cursorWidth: 2,

        barWidth: 2,
        barGap: 2,
        barRadius: 2,

        normalize: true,

        interact: true,

        dragToSeek: true,
      })

    waveSurferRef.current =
      wavesurfer

    const handleReady = (
      waveformDuration
    ) => {
      setDuration(
        waveformDuration ||
          audio.duration ||
          0
      )

      setWaveformReady(true)
    }

    const handleTimeUpdate = (
      time
    ) => {
      setCurrentTime(time)
    }

    const handleAudioDuration =
      () => {
        if (
          Number.isFinite(
            audio.duration
          )
        ) {
          setDuration(
            audio.duration
          )
        }
      }

    wavesurfer.on(
      'ready',
      handleReady
    )

    wavesurfer.on(
      'timeupdate',
      handleTimeUpdate
    )

    audio.addEventListener(
      'loadedmetadata',
      handleAudioDuration
    )

    audio.addEventListener(
      'durationchange',
      handleAudioDuration
    )

    return () => {
      audio.removeEventListener(
        'loadedmetadata',
        handleAudioDuration
      )

      audio.removeEventListener(
        'durationchange',
        handleAudioDuration
      )

      wavesurfer.destroy()

      waveSurferRef.current = null
    }
  }, [
    beat?.id,
    beat?.previewUrl,
    audioRef,
  ])

  if (!beat) {
    return null
  }

  const artwork =
    beat.artworkUrl ||
    beat.image

  const price =
    beat.priceNGN != null
      ? `₦${beat.priceNGN.toLocaleString()}`
      : 'Licenses'

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#172033]/[0.07] bg-[#f5f8fc]/90 text-[#18202d] shadow-[0_-16px_50px_rgba(23,32,51,0.10)] backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[88px] max-w-[1600px] items-center gap-3 px-3 py-3 sm:px-5 lg:gap-5 lg:px-8">
        {/* CURRENT BEAT */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-[260px]">
          <div className="relative shrink-0">
            {artwork ? (
              <img
                src={artwork}
                alt={beat.title}
                className="h-12 w-12 rounded-[14px] object-cover shadow-sm sm:h-14 sm:w-14"
              />
            ) : (
              <div className="h-12 w-12 rounded-[14px] bg-[#e2e7f0] sm:h-14 sm:w-14" />
            )}

            {isPlaying && (
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#f5f8fc] bg-[#18202d]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold text-[#18202d] sm:text-sm">
              {beat.title}
            </p>

            <p className="mt-1 truncate text-[10px] font-semibold text-[#8a93a5] sm:text-[11px]">
              {beat.producer}
            </p>
          </div>
        </div>

        {/* PLAY */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#18202d] text-white shadow-[0_10px_25px_rgba(24,32,45,0.18)] transition duration-200 hover:scale-105 hover:bg-[#252f42] active:scale-95"
            aria-label={
              isPlaying
                ? `Pause ${beat.title}`
                : `Play ${beat.title}`
            }
          >
            {isPlaying ? (
              <Pause
                size={18}
                strokeWidth={2.2}
              />
            ) : (
              <Play
                size={18}
                strokeWidth={2.2}
                fill="currentColor"
                className="ml-0.5"
              />
            )}
          </button>
        </div>

        {/* REAL WAVEFORM */}
        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <span className="w-10 shrink-0 text-right text-[10px] font-bold tabular-nums text-[#8a93a5]">
            {formatTime(currentTime)}
          </span>

          <div className="relative min-w-0 flex-1">
            {!waveformReady && (
              <div className="pointer-events-none absolute inset-0 flex items-center">
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#18202d]/10">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-[#b9b4ee]" />
                </div>
              </div>
            )}

            <div
              ref={
                waveformContainerRef
              }
              className={`w-full cursor-pointer overflow-hidden transition-opacity duration-300 ${
                waveformReady
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            />
          </div>

          <span className="w-10 shrink-0 text-[10px] font-bold tabular-nums text-[#8a93a5]">
            {formatTime(duration)}
          </span>
        </div>

        {/* BUY */}
        <div className="ml-auto shrink-0">
          <button
            type="button"
            onClick={() =>
              onSelect(beat)
            }
            disabled={
              beat.priceNGN == null
            }
            className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#172033]/[0.08] bg-white/75 px-3 text-[11px] font-extrabold text-[#283246] shadow-sm transition duration-200 hover:border-[#18202d] hover:bg-[#18202d] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
          >
            <ShoppingBag
              size={15}
              strokeWidth={2}
            />

            <span className="hidden lg:inline">
              From
            </span>

            <span>{price}</span>
          </button>
        </div>
      </div>
    </footer>
  )
}