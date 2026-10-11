'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { hotelsApi } from '@/lib/api'
import { formatStarRating, type Hotel } from '@/types/hotel'
import styles from './HotelsList.module.css'

const PAGE_SIZE = 25

export default function HotelsList() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [jumpValue, setJumpValue] = useState('')
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    hotelsApi
      .list()
      .then((data) => {
        if (!cancelled) setHotels(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load hotels.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(hotel: Hotel) {
    if (!confirm(`Delete "${hotel.name}"? This can't be undone.`)) return

    try {
      await hotelsApi.remove(hotel.id)
      setHotels((prev) => prev.filter((h) => h.id !== hotel.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete hotel.')
    }
  }

  const regions = useMemo(() => [...new Set(hotels.map((h) => h.region))].sort(), [hotels])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return hotels.filter(
      (h) => (!region || h.region === region) && (!query || h.name.toLowerCase().includes(query)),
    )
  }, [hotels, search, region])

  const isFiltering = search.trim() !== '' || region !== ''

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageHotels = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function goToPage(value: number) {
    setPage(Math.min(totalPages, Math.max(1, value)))
  }

  function handleJumpSubmit(event: FormEvent) {
    event.preventDefault()
    const value = Number(jumpValue)
    if (Number.isFinite(value) && value >= 1) goToPage(value)
    setJumpValue('')
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
          <h1 className={styles.title}>Hotels & Resorts</h1>
          <button type="button" className={styles.newButton} onClick={() => router.push('/admin/hotels/new')}>
            + New Hotel
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {!loading && hotels.length === 0 && !error && (
          <p className={styles.empty}>No hotels yet. Add your first partner property.</p>
        )}

        {hotels.length > 0 && (
          <div className={styles.filters}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search hotel name"
              aria-label="Search hotel name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
            <select
              className={styles.regionSelect}
              aria-label="Filter by region"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <span className={styles.resultCount}>
              {isFiltering ? `${filtered.length} of ${hotels.length}` : hotels.length} hotels
            </span>
          </div>
        )}

        {hotels.length > 0 && filtered.length === 0 && <p className={styles.empty}>No hotels match your filters.</p>}

        {filtered.length > 0 && (
          <table className={styles.table}>
            <colgroup>
              <col style={{ width: '26%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Hotel Name</th>
                <th>Region/Province</th>
                <th>Star Rating</th>
                <th>Contact Person</th>
                <th>Contact Numbers</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.region}</td>
                  <td>
                    <span className={styles.badge}>{formatStarRating(hotel.starRating)}</span>
                  </td>
                  <td>{hotel.contactPerson || '—'}</td>
                  <td>{hotel.contactNumbers || '—'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => router.push(`/admin/hotels/${hotel.id}/edit`)}>
                        Edit
                      </button>
                      <button type="button" className={styles.delete} onClick={() => handleDelete(hotel)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button type="button" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
              ← Prev
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages} · {filtered.length} hotels
            </span>
            <button type="button" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
              Next →
            </button>
            <form className={styles.jumpForm} onSubmit={handleJumpSubmit}>
              <label htmlFor="jump-to-page">Go to</label>
              <input
                id="jump-to-page"
                type="number"
                min={1}
                max={totalPages}
                placeholder={String(currentPage)}
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
              />
              <button type="submit">Go</button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
