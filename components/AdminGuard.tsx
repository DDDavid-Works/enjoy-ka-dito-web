'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import type { ModuleKey } from '@/types/modules'

// Admin sections that need a module permission; everything else under /admin only needs a login.
const MODULE_BY_SECTION: Record<string, ModuleKey> = {
  packages: 'packages',
  inquiries: 'inquiries',
  hotels: 'hotels',
  company: 'company',
  quotations: 'quotations',
  users: 'users',
}

// Replaces react-router's <ProtectedRoute>. The token lives in localStorage, so this can only
// check on the client; the API enforces permissions on every request regardless.
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { admin, isReady } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isLogin = pathname === '/admin/login'
  const section = pathname.split('/')[2]
  const requiredModule = section ? MODULE_BY_SECTION[section] : undefined

  const redirectTo = !isReady || isLogin
    ? null
    : !admin
      ? '/admin/login'
      : requiredModule && !admin.modules?.includes(requiredModule)
        ? '/admin'
        : null

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo)
  }, [redirectTo, router])

  if (isLogin) return children
  if (!isReady || redirectTo) return null
  return children
}
