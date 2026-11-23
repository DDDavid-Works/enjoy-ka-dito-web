import type { Metadata } from 'next'
import JsonLd, { breadcrumb } from '@/components/JsonLd'
import { getPackages } from '@/lib/packages'
import { SITE_URL } from '@/lib/site'
import TourPackages from './TourPackages'

export const metadata: Metadata = {
  title: 'Philippine & International Tour Packages',
  description:
    'Browse local, international and corporate tour packages from Enjoy Ka Dito. Every trip is tailored to your dates, group and style. Request a free quote today.',
  alternates: { canonical: '/tour-packages' },
}

export default async function Page() {
  const packages = await getPackages()
  return (
    <>
      <JsonLd
        data={[
          {
            '@type': 'ItemList',
            name: 'Tour packages',
            itemListElement: packages.map((pkg, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: pkg.title,
              url: `${SITE_URL}/tour-packages/${pkg.slug}`,
            })),
          },
          breadcrumb('Tour Packages', '/tour-packages'),
        ]}
      />
      <TourPackages packages={packages} />
    </>
  )
}
