import {
  LoaderCircle,
  Music2,
  Plus,
  X,
} from 'lucide-react'

import {
  useState,
} from 'react'

import { API_URL } from '../config/api'

const initialForm = {
  title: '',
  producer: 'EMOKHRR',
  genre: '',
  mood: '',
  bpm: '',
  musicalKey: '',
  durationSec: '',
}

export default function AdminNewBeatModal({
  isOpen,
  onClose,
  onCreated,
}) {
  const [form, setForm] =
    useState(initialForm)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState('')

  if (!isOpen) {
    return null
  }

  function updateField(
    field,
    value
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetForm() {
    setForm(initialForm)
    setError('')
  }

  function handleClose() {
    if (isSubmitting) {
      return
    }

    resetForm()
    onClose()
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    if (!form.title.trim()) {
      setError(
        'Beat title is required.'
      )

      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const token =
        sessionStorage.getItem(
          'emokhrr_admin_token'
        )

      const payload = {
        title:
          form.title.trim(),

        producer:
          form.producer.trim() ||
          'EMOKHRR',

        genre:
          form.genre.trim() ||
          null,

        mood:
          form.mood.trim() ||
          null,

        bpm:
          form.bpm
            ? Number(form.bpm)
            : null,

        musicalKey:
          form.musicalKey.trim() ||
          null,

        durationSec:
          form.durationSec
            ? Number(
                form.durationSec
              )
            : null,
      }

      const response = await fetch(
        `${API_URL}/api/admin/beats`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to create beat'
        )
      }

      onCreated(
        data.beat
      )

      resetForm()
      onClose()
    } catch (error) {
      console.error(
        'Beat creation failed:',
        error
      )

      setError(
        error.message ||
          'Unable to create beat'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      {/* OVERLAY */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close new beat form"
        className="absolute inset-0 h-full w-full bg-[#24163d]/35 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="relative z-10 max-h-[94vh] w-full overflow-y-auto rounded-t-[30px] border border-[#d4c9f6] bg-[#faf9ff] shadow-[0_24px_80px_rgba(64,38,110,0.24)] sm:max-w-2xl sm:rounded-[30px]">
        {/* HEADER */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e1d9f5] bg-[#faf9ff]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6236ff] text-white shadow-[0_8px_24px_rgba(98,54,255,0.24)]">
              <Music2
                size={19}
              />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a8195]">
                Catalogue
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#18141f]">
                New beat
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cef2] bg-white text-[#766e82] transition hover:border-[#bfaeff] hover:text-[#6236ff]"
          >
            <X
              size={18}
            />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* TITLE */}
            <div className="sm:col-span-2">
              <label
                htmlFor="beat-title"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]"
              >
                Beat title *
              </label>

              <input
                id="beat-title"
                type="text"
                value={form.title}
                onChange={(
                  event
                ) =>
                  updateField(
                    'title',
                    event.target
                      .value
                  )
                }
                placeholder="Night Shift"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition placeholder:text-[#aca4b6] focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
              />
            </div>

            {/* PRODUCER */}
            <div>
              <label
                htmlFor="beat-producer"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]"
              >
                Producer
              </label>

              <input
                id="beat-producer"
                type="text"
                value={
                  form.producer
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'producer',
                    event.target
                      .value
                  )
                }
                className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
              />
            </div>

            {/* GENRE */}
            <div>
              <label
                htmlFor="beat-genre"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]"
              >
                Genre
              </label>

              <input
                id="beat-genre"
                type="text"
                value={form.genre}
                onChange={(
                  event
                ) =>
                  updateField(
                    'genre',
                    event.target
                      .value
                  )
                }
                placeholder="Dark R&B"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition placeholder:text-[#aca4b6] focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
              />
            </div>

            {/* MOOD */}
            <div>
              <label
                htmlFor="beat-mood"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]"
              >
                Mood
              </label>

              <input
                id="beat-mood"
                type="text"
                value={form.mood}
                onChange={(
                  event
                ) =>
                  updateField(
                    'mood',
                    event.target
                      .value
                  )
                }
                placeholder="Late Night"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition placeholder:text-[#aca4b6] focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
              />
            </div>

            {/* BPM */}
            <div>
              <label
                htmlFor="beat-bpm"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]"
              >
                BPM
              </label>

              <input
                id="beat-bpm"
                type="number"
                min="1"
                max="400"
                value={form.bpm}
                onChange={(
                  event
                ) =>
                  updateField(
                    'bpm',
                    event.target
                      .value
                  )
                }
                placeholder="138"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition placeholder:text-[#aca4b6] focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
              />
            </div>

            {/* KEY */}
            <div>
              <label
                htmlFor="beat-key"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]"
              >
                Musical key
              </label>

              <input
                id="beat-key"
                type="text"
                value={
                  form.musicalKey
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'musicalKey',
                    event.target
                      .value
                  )
                }
                placeholder="F# Minor"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition placeholder:text-[#aca4b6] focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
              />
            </div>

            {/* DURATION */}
            <div>
              <label
                htmlFor="beat-duration"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#81778c]"
              >
                Duration (seconds)
              </label>

              <input
                id="beat-duration"
                type="number"
                min="1"
                value={
                  form.durationSec
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'durationSec',
                    event.target
                      .value
                  )
                }
                placeholder="173"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d8cef2] bg-white px-4 text-sm text-[#18141f] outline-none transition placeholder:text-[#aca4b6] focus:border-[#6236ff]/50 focus:ring-4 focus:ring-[#6236ff]/[0.07]"
              />
            </div>
          </div>

          {/* INFO */}
          <div className="mt-6 rounded-2xl border border-[#d9cef5] bg-[#eee9ff] p-4">
            <p className="text-[10px] font-semibold text-[#6236ff]">
              Beat will be created
              as a draft.
            </p>

            <p className="mt-1 text-[10px] leading-5 text-[#776e83]">
              You'll configure
              license pricing,
              upload artwork,
              preview audio and
              deliverable files
              before publishing.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={
                isSubmitting
              }
              className="h-11 rounded-full border border-[#d5cbef] bg-white px-5 text-[10px] font-semibold text-[#665d73] transition hover:border-[#bba8f5] hover:text-[#6236ff]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#6236ff] px-6 text-[10px] font-semibold text-white shadow-[0_10px_26px_rgba(98,54,255,0.25)] transition hover:bg-[#5127e8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Plus
                  size={14}
                />
              )}

              {isSubmitting
                ? 'Creating...'
                : 'Create beat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}