'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { packagesApi } from '@/lib/api'
import type { Package } from '@/types/package'
import styles from './PackagesList.module.css'

export default function PackagesList() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    packagesApi
      .list()
      .then((data) => {
        if (!cancelled) setPackages(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load packages.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(pkg: Package) {
    if (!confirm(`Delete "${pkg.title}"? This can't be undone.`)) return

    try {
      await packagesApi.remove(pkg.id)
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete package.')
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
          <h1 className={styles.title}>Tour Packages</h1>
          <button
            type="button"
            className={styles.newButton}
            onClick={() => router.push('/admin/packages/new')}
          >
            + New Package
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {!loading && packages.length === 0 && !error && (
          <p className={styles.empty}>No packages yet. Create your first one.</p>
        )}

        {packages.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.title}</td>
                  <td>{pkg.category}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        pkg.status === 'published' ? styles.badgePublished : styles.badgeDraft
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td>{new Date(pkg.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => router.push(`/admin/packages/${pkg.id}/edit`)}>
                        Edit
                      </button>
                      <button type="button" className={styles.delete} onClick={() => handleDelete(pkg)}>
                        Delete
                      </button>
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
