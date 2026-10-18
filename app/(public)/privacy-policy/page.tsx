import type { Metadata } from 'next'
import { getCompanyDetails } from '@/lib/company'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Enjoy Ka Dito collects, uses and protects the personal information you share with us.',
  alternates: { canonical: '/privacy-policy' },
}

export default async function PrivacyPolicy() {
  const company = await getCompanyDetails()
  const email = company.emails.find(Boolean)

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.intro}>
        Enjoy Ka Dito, operated by MCP Greenery Travel and Tours, respects your privacy and handles personal
        information in line with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).
      </p>

      <h2>Information we collect</h2>
      <p>
        When you send a quote request or contact us, we collect the details you enter: your name, email address,
        phone number, travel preferences, dates and number of travelers. We may also collect basic usage data
        (pages visited, device and browser type) through analytics.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your inquiry and prepare quotations and bookings.</li>
        <li>To arrange services with airlines, hotels and other suppliers on your behalf.</li>
        <li>To understand how the website is used and to improve it.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We share your information only with suppliers needed to fulfil your booking, or when required by law. We do
        not sell your personal information.
      </p>

      <h2>Analytics and cookies</h2>
      <p>
        We may use Google Analytics to measure website traffic. It uses cookies to collect anonymous usage
        statistics. You can block cookies in your browser settings or use Google&rsquo;s opt-out tools.
      </p>

      <h2>Retention and security</h2>
      <p>
        We keep inquiry and booking records only as long as needed for the purposes above or as required by law, and
        use reasonable safeguards to protect them.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask to access, correct or delete your personal information, or withdraw your consent, at any time
        {email ? (
          <>
            {' '}
            by writing to <a href={`mailto:${email}`}>{email}</a>.
          </>
        ) : (
          ' by contacting us through the Contact Us page.'
        )}
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time; the latest version is always on this page.</p>
    </main>
  )
}
