import type { Metadata } from 'next'
import styles from './page.module.css'

const SERVICES = [
  {
    title: 'Booking & Ticketing',
    description: 'Flight bookings and ticketing for domestic and international trips, handled end-to-end.',
  },
  {
    title: 'Cruises',
    description: 'Ocean cruises for travelers who want to explore beyond the usual destinations.',
  },
  {
    title: 'Tour Packages',
    description: 'All-in domestic and international packages for teams, families, and friends.',
  },
  {
    title: 'Hotel Reservations',
    description: 'Accommodation booked through our network of hotel partners worldwide.',
  },
  {
    title: 'Land Arrangement',
    description: 'Transfers and ground transportation to get you to your destination.',
  },
  {
    title: 'Passport Appointment',
    description: "Passport applications and renewals scheduled so you don't miss your trip.",
  },
  {
    title: 'Travel Insurance',
    description: "Coverage for the unexpected, so a hiccup doesn't derail your trip.",
  },
  {
    title: 'Visa Assistance',
    description: 'Visa applications for local and foreign travelers, guided start to finish.',
  },
  {
    title: 'Corporate Team Building & Company Outings',
    description:
      'Customized programs based on team size, objectives, dates, and budget. Packages can include resort stays, meals, transfers, team activities, and facilitators through partners.',
  },
  {
    title: 'Company Retreats & Incentive Trips',
    description:
      'Leadership retreats, planning sessions, and reward trips with venue sourcing, upgraded accommodations, group meals, and optional tours.',
  },
  {
    title: 'Airfare & Accommodation Arrangements',
    description:
      'Flight arrangements, group airfare requests, hotel and resort reservations, and room upgrades. Available as standalone services or as part of a package.',
  },
  {
    title: 'Tours & Transfers',
    description:
      'Day tours, island hopping, airport and seaport transfers, and private vans or buses, depending on the destination.',
  },
  {
    title: 'Corporate Travel Arrangements',
    description:
      'Coordinated travel arrangements for businesses and organizations, including flight bookings, hotel accommodations, transportation, and customized itineraries for corporate travelers and groups.',
  },
  {
    title: 'Event & Onsite Coordination',
    description:
      'Travel and event coordination for company gatherings, meetings, and group activities, including venue arrangements, transportation, accommodation, and onsite assistance through our partners.',
  },
  {
    title: 'Customized Group & Private Tours',
    description:
      'Tailor-made itineraries for families, friends, and private groups, with options for sightseeing, island hopping, and local experiences.',
  },
]

export const metadata: Metadata = {
  title: 'Travel Services',
  description:
    'Flight ticketing, hotel reservations, tours and transfers, corporate team building, company retreats, event coordination, passport, insurance and visa assistance from a DOT-accredited Philippine travel agency.',
  alternates: { canonical: '/travel-services' },
}

export default function TravelServices() {
  return (
    <main>
      <section className={styles.intro}>
        <h1 className={styles.title}>Everything your trip needs, in one place.</h1>
        <p className={styles.subtext}>
          From tickets and hotels to visas and insurance — we handle the parts of travel planning that usually eat
          up your time.
        </p>
      </section>

      <section className={styles.grid}>
        {SERVICES.map((service) => (
          <div key={service.title} className={styles.card}>
            <h2 className={styles.cardTitle}>{service.title}</h2>
            <p className={styles.cardText}>{service.description}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
