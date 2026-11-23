'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import CoverImage from '@/components/CoverImage'
import Icon from '@/components/Icon'
import { PACKAGE_CATEGORIES, type Package, type PackageCategory } from '@/types/package'
import styles from './TourPackages.module.css'

const FILTERS: Array<PackageCategory | 'All'> = ['All', ...PACKAGE_CATEGORIES]

type SortKey = 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc' | 'name'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration-asc', label: 'Duration: shortest' },
  { value: 'duration-desc', label: 'Duration: longest' },
  { value: 'name', label: 'Name: A to Z' },
]

// Price and duration are free text ("For as low as Php 119, 909 per person", "10Days & 9 Nights",
// "3D2N"), so take the first number in each. Unparseable values return null and sort last.
function parsePrice(price?: string): number | null {
  const match = price?.match(/\d[\d,\s]*(?:\.\d+)?/)
  if (!match) return null
  const value = Number(match[0].replace(/[,\s]/g, ''))
  return Number.isFinite(value) ? value : null
}

function parseDuration(duration?: string): number | null {
  const match = duration?.match(/\d+/)
  return match ? Number(match[0]) : null
}

function compareNullable(a: number | null, b: number | null, direction: 1 | -1): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return (a - b) * direction
}

// Receives the packages fetched on the server, so the cards are in the initial HTML for crawlers.
export default function TourPackages({ packages }: { packages: Package[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PackageCategory | 'All'>('All')
  const [sort, setSort] = useState<SortKey>('price-asc')

  const filteredPackages = useMemo(() => {
    const matches = packages.filter((pkg) => {
      const matchesFilter = filter === 'All' || pkg.category === filter
      const matchesQuery =
        query.trim() === '' ||
        pkg.title.toLowerCase().includes(query.toLowerCase()) ||
        (pkg.location ?? '').toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })

    switch (sort) {
      case 'price-asc':
      case 'price-desc':
        return [...matches].sort((a, b) =>
          compareNullable(parsePrice(a.price), parsePrice(b.price), sort === 'price-asc' ? 1 : -1),
        )
      case 'duration-asc':
      case 'duration-desc':
        return [...matches].sort((a, b) =>
          compareNullable(parseDuration(a.duration), parseDuration(b.duration), sort === 'duration-asc' ? 1 : -1),
        )
      case 'name':
        return [...matches].sort((a, b) => a.title.localeCompare(b.title))
    }
  }, [packages, query, filter, sort])

  return (
    <main>
      <section className={styles.intro}>
        <h1 className={styles.title}>
          <span className="h1-eyebrow">Philippine &amp; International Tour Packages</span>
          Find your next favourite place.
        </h1>
        <p className={styles.subtext}>
          Browse our sample escapes. Every trip can be refined around your dates, group, and travel style.
        </p>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <input
              type="search"
              aria-label="Search tour packages"
              placeholder="Search destination or package"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={styles.filters}>
            {FILTERS.map((label) => (
              <button
                key={label}
                type="button"
                className={label === filter ? `${styles.filterPill} ${styles.filterPillActive}` : styles.filterPill}
                onClick={() => setFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className={styles.sortBox}>
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className={styles.grid}>
        {filteredPackages.length === 0 && (
          <p className={styles.empty}>No tours match your search yet.</p>
        )}

        {filteredPackages.map((pkg) => (
          <Link key={pkg.slug} href={`/tour-packages/${pkg.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              {pkg.mainImage && (
                <CoverImage src={pkg.mainImage} alt={pkg.title} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" />
              )}
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>{pkg.title}</p>
              <p className={styles.cardMeta}>
                <span>
                  <Icon name="pin" className={styles.pin} />
                  {pkg.location}
                </span>
                <span>{pkg.duration}</span>
              </p>
              <p className={styles.cardPrice}>{pkg.price ?? 'Request a quote'}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
