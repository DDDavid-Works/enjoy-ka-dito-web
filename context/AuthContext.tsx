'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type Admin } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
const STORAGE_KEY = 'ekd-admin-auth'

type StoredAuth = {
  accessToken: string
  admin: Admin
}

function readStoredAuth(): StoredAuth | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(null)
  // False until the saved session (if any) has been read and refreshed from the server.
  const [isReady, setIsReady] = useState(false)

  const logout = useCallback(() => {
    setAuth(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Browser storage isn't available while rendering on the server, so the saved session is read after mount.
  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const saved = readStoredAuth()
      if (!saved) {
        setIsReady(true)
        return
      }

      setAuth(saved)

      // The server's current copy of the user wins: permissions may have changed since the last visit.
      await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${saved.accessToken}` } })
        .then(async (response) => {
          if (cancelled) return
          if (response.status === 401) return logout()
          if (!response.ok) return
          const admin: Admin = await response.json()
          const next = { accessToken: saved.accessToken, admin }
          setAuth(next)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        })
        .catch(() => {}) // offline: keep the saved session
        .finally(() => {
          if (!cancelled) setIsReady(true)
        })
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [logout])

  async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message ?? 'Incorrect email or password.')
    }

    setAuth(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  return (
    <AuthContext.Provider value={{ admin: auth?.admin ?? null, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
