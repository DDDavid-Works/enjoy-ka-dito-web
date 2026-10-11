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
]

export const metadata: Metadata = {
  title: 'Travel Services',
  description:
    'Flight ticketing, cruises, hotel reservations, land arrangements, passport appointments, travel insurance and visa assistance from a DOT-accredited Philippine travel agency.',
  alternates: { canonical: '/travel-services' },
}

export default function TravelServices() {
  return (
    <main>
      <section className={styles.intro}>
        <p className={styles.badge}>HOW WE HELP</p>
        <h1 className={styles.title}>Everything your trip needs, in one place.</h1>
        <p className={styles.subtext}>
          From tickets and hotels to visas and insurance — we handle the parts of travel planning that usually eat
          up your time.
        </p>
      </section>

      <section className={styles.grid}>
        {SERVICES.map((service, index) => (
          <div key={service.title} className={styles.card}>
            <p className={styles.index}>{String(index + 1).padStart(2, '0')}</p>
            <h2 className={styles.cardTitle}>{service.title}</h2>
            <p className={styles.cardText}>{service.description}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
