import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from 'lucide-react'

import {
  useState,
} from 'react'

import { API_URL } from '../config/api'

export default function AdminLogin({
  onLogin,
}) {
  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        'Email and password are required.'
      )

      return
    }

    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/api/admin/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email:
              email.trim(),
            password,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to sign in'
        )
      }

      if (!data.token) {
        throw new Error(
          'Authentication token was not returned'
        )
      }

      sessionStorage.setItem(
        'emokhrr_admin_token',
        data.token
      )

      if (data.expiresIn) {
        sessionStorage.setItem(
          'emokhrr_admin_expires_in',
          String(data.expiresIn)
        )
      }

      onLogin(data.token)
    } catch (error) {
      console.error(
        'Admin login failed:',
        error
      )

      setError(
        error.message ||
          'Unable to sign in'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-12 font-['Manrope'] text-white">
      <div className="w-full max-w-[420px]">
        {/* BRAND */}
        <div className="mb-10 text-center">
          <p className="text-lg font-bold tracking-[0.16em] text-white">
            EMOKHRR
          </p>

          <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.24em] text-white/25">
            Admin
          </p>
        </div>

        <div className="rounded-[28px] border border-white/[0.08] bg-[#0d0d10] p-6 shadow-2xl sm:p-8">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/60">
              <LockKeyhole
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
              Admin login
            </h1>

            <p className="mt-2 text-xs leading-6 text-white/35">
              Sign in to manage beats,
              licenses, files and orders.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label
                htmlFor="admin-email"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30"
              >
                Email
              </label>

              <div className="relative mt-2">
                <Mail
                  size={15}
                  strokeWidth={1.8}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  placeholder="admin@email.com"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05]"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="admin-password"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30"
              >
                Password
              </label>

              <div className="relative mt-2">
                <LockKeyhole
                  size={15}
                  strokeWidth={1.8}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.05]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={16}
                    />
                  ) : (
                    <Eye
                      size={16}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
                <p className="text-xs leading-5 text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-xs font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              )}

              {isLoading
                ? 'Signing in...'
                : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}