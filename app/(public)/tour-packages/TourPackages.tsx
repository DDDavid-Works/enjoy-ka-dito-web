'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import CoverImage from '@/components/CoverImage'
import { PACKAGE_CATEGORIES, type Package, type PackageCategory } from '@/types/package'
import styles from './TourPackages.module.css'

const FILTERS: Array<PackageCategory | 'All'> = ['All', ...PACKAGE_CATEGORIES]

// Receives the packages fetched on the server, so the cards are in the initial HTML for crawlers.
export default function TourPackages({ packages }: { packages: Package[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PackageCategory | 'All'>('All')

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesFilter = filter === 'All' || pkg.category === filter
      const matchesQuery =
        query.trim() === '' ||
        pkg.title.toLowerCase().includes(query.toLowerCase()) ||
        (pkg.location ?? '').toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [packages, query, filter])

  return (
    <main>
      <section className={styles.intro}>
        <p className={styles.badge}>TRAVEL, YOUR WAY</p>
        <h1 className={styles.title}>Find your next favourite place.</h1>
        <p className={styles.subtext}>
          Browse our sample escapes. Every trip can be refined around your dates, group, and travel style.
        </p>

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <input
              type="text"
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
        </div>
      </section>

      <section className={styles.grid}>
        {filteredPackages.length === 0 && (
          <p className={styles.empty}>No tours match your search yet.</p>
        )}

        {filteredPackages.map((pkg) => (
          <Link key={pkg.slug} href={`/tour-packages/${pkg.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              {pkg.mainImage && <CoverImage src={pkg.mainImage} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" />}
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>{pkg.title}</p>
              <p className={styles.cardMeta}>
                {pkg.location} · {pkg.duration}
              </p>
              <p className={styles.cardPrice}>{pkg.price ?? 'Request a Quote'}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
