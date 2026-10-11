import type { Metadata } from 'next'
import { getPackages } from '@/lib/packages'
import TourPackages from './TourPackages'

export const metadata: Metadata = {
  title: 'Tour Packages',
  description:
    'Browse local, international and corporate tour packages from Enjoy Ka Dito. Every trip can be tailored to your dates, group and travel style.',
  alternates: { canonical: '/tour-packages' },
}

export default async function Page() {
  const packages = await getPackages()
  return <TourPackages packages={packages} />
}
