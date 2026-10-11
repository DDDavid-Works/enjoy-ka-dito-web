'use client'

import { createContext, useContext } from 'react'
import type { ModuleKey } from '@/types/modules'

export type Admin = {
  id: string
  email: string
  name: string
  role: string
  modules: ModuleKey[]
}

export type AuthContextValue = {
  admin: Admin | null
  isReady: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
