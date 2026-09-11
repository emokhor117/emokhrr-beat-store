import {
  useState,
} from 'react'

import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function AdminPage() {
  const [token, setToken] =
    useState(() =>
      sessionStorage.getItem(
        'emokhrr_admin_token'
      )
    )

  function handleLogin(newToken) {
    setToken(newToken)
  }

  function handleLogout() {
    sessionStorage.removeItem(
      'emokhrr_admin_token'
    )

    sessionStorage.removeItem(
      'emokhrr_admin_expires_in'
    )

    setToken(null)
  }

  if (!token) {
    return (
      <AdminLogin
        onLogin={handleLogin}
      />
    )
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
    />
  )
}