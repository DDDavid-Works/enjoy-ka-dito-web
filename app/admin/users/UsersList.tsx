'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usersApi } from '@/lib/api'
import { useAuth } from '@/context/auth'
import type { User } from '@/types/user'
import { MODULES } from '@/types/modules'
import styles from '../hotels/HotelsList.module.css'

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { admin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    usersApi
      .list()
      .then((data) => {
        if (!cancelled) setUsers(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load users.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(user: User) {
    if (!confirm(`Delete "${user.name}"? This can't be undone.`)) return

    try {
      await usersApi.remove(user.id)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user.')
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <img src="/images/logo-square.png" alt="Enjoy Ka Dito" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <Link href="/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Users</h1>
          <button type="button" className={styles.newButton} onClick={() => router.push('/admin/users/new')}>
            + New User
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {!loading && users.length === 0 && !error && <p className={styles.empty}>No users yet.</p>}

        {users.length > 0 && (
          <table className={styles.table}>
            <colgroup>
              <col style={{ width: '22%' }} />
              <col style={{ width: '26%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '16%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Access</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.name}
                    {user.id === admin?.id && <span className={styles.badge}>You</span>}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.contactNumber || '—'}</td>
                  <td>
                    {user.modules.length === MODULES.length ? 'All modules' : `${user.modules.length} of ${MODULES.length} modules`}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
                        Edit
                      </button>
                      {user.id !== admin?.id && (
                        <button type="button" className={styles.delete} onClick={() => handleDelete(user)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
