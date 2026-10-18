import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPackage, getPackages } from '@/lib/packages'
import { SITE_NAME, SITE_URL, absoluteUrl, toMetaDescription } from '@/lib/site'
import CoverImage from '@/components/CoverImage'
import Gallery from './Gallery'
import styles from './PackageDetail.module.css'

// Cache Components needs at least one prerendered param. With no published packages yet, a placeholder
// slug is prerendered (it resolves to notFound()); real slugs are rendered on first visit and cached.
export async function generateStaticParams() {
  const packages = await getPackages()
  return packages.length > 0 ? packages.map((pkg) => ({ slug: pkg.slug })) : [{ slug: '_' }]
}

export async function generateMetadata({ params }: PageProps<'/tour-packages/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackage(slug)
  if (!pkg) return { title: 'Tour not found' }

  const description = toMetaDescription(
    pkg.summary || `${pkg.title}${pkg.location ? ` in ${pkg.location}` : ''}${pkg.duration ? `, ${pkg.duration}` : ''}.`,
  )
  const image = pkg.mainImage ? absoluteUrl(pkg.mainImage) : undefined

  return {
    title: pkg.title,
    description,
    alternates: { canonical: `/tour-packages/${pkg.slug}` },
    openGraph: {
      type: 'website',
      title: pkg.title,
      description,
      url: `/tour-packages/${pkg.slug}`,
      siteName: SITE_NAME,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: pkg.title, description, images: image ? [image] : undefined },
  }
}

export default function PackageDetailPage({ params }: PageProps<'/tour-packages/[slug]'>) {
  // params is read inside Suspense so slugs that weren't prerendered can be served from an App Shell and
  // cached after the first visit. A missing slug is answered with a real 404 by proxy.ts before this renders.
  return (
    <Suspense>
      <PackageDetail params={params} />
    </Suspense>
  )
}

async function PackageDetail({ params }: Pick<PageProps<'/tour-packages/[slug]'>, 'params'>) {
  const { slug } = await params
  const pkg = await getPackage(slug)
  if (!pkg) notFound()

  // JSON-LD for rich results. "<" is escaped so package text can't close the script tag.
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.summary || undefined,
    url: `${SITE_URL}/tour-packages/${pkg.slug}`,
    image: pkg.gallery.length > 0 ? pkg.gallery.map(absoluteUrl) : pkg.mainImage ? [absoluteUrl(pkg.mainImage)] : undefined,
    touristType: pkg.category,
    itinerary:
      pkg.itinerary.length > 0
        ? {
            '@type': 'ItemList',
            itemListElement: pkg.itinerary.map((day, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: day.label,
              description: day.description,
            })),
          }
        : undefined,
    provider: { '@type': 'TravelAgency', name: SITE_NAME, url: SITE_URL },
  }).replace(/</g, '\\u003c')

  const breadcrumbLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tour Packages', item: `${SITE_URL}/tour-packages` },
      { '@type': 'ListItem', position: 3, name: pkg.title, item: `${SITE_URL}/tour-packages/${pkg.slug}` },
    ],
  }).replace(/</g, '\\u003c')

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLd }} />

      <section className={styles.hero}>
        {pkg.mainImage && <CoverImage src={pkg.mainImage} sizes="100vw" preload behind />}
        <div className={styles.heroContent}>
          <Link href="/tour-packages" className={styles.backLink}>
            ← Back to Tour Packages
          </Link>
          <p className={styles.meta}>
            {pkg.location} · {pkg.duration}
          </p>
          <h1 className={styles.title}>{pkg.title}</h1>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.main}>
          <p className={styles.summary}>{pkg.summary}</p>

          <h2 className={styles.sectionTitle}>Sample itinerary</h2>
          <ol className={styles.itinerary}>
            {pkg.itinerary.map((day) => (
              <li key={day.label} className={styles.itineraryItem}>
                <span className={styles.itineraryLabel}>{day.label}</span>
                <span className={styles.itineraryDescription}>{day.description}</span>
              </li>
            ))}
          </ol>

          {pkg.gallery.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>Gallery</h2>
              <Gallery photos={pkg.gallery} title={pkg.title} />
            </>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <p className={styles.price}>{pkg.price ?? 'Custom pricing'}</p>
            <p className={styles.priceNote}>Per person, based on double occupancy.</p>
            <Link href={`/request-a-quote?destination=${encodeURIComponent(pkg.title)}`} className={styles.cta}>
              Request a Quote
            </Link>

            <div className={styles.divider} />

            <h3 className={styles.listTitle}>Inclusions</h3>
            <ul className={styles.list}>
              {pkg.inclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3 className={styles.listTitle}>Exclusions</h3>
            <ul className={styles.list}>
              {pkg.exclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}
