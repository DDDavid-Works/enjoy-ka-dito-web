import type { Metadata } from 'next'
import Link from 'next/link'
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
  const contact = email ? (
    <a href={`mailto:${email}`}>{email}</a>
  ) : (
    <Link href="/contact-us">our Contact Us page</Link>
  )

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: October 30, 2026</p>
      <p className={styles.intro}>
        Enjoy Ka Dito, operated by MCP Greenery Travel and Tours, respects your privacy and handles personal
        information in line with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173), its Implementing
        Rules and the issuances of the National Privacy Commission.
      </p>

      <h2>Who we are</h2>
      <p>
        MCP Greenery Travel and Tours is the personal information controller for this website
        {company.address ? <>, located at {company.address}</> : null}. Our Data Protection Officer can be reached at{' '}
        {contact}.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>What you send us:</strong> when you request a quote or contact us, the details you enter, such as
          your name, email address, phone number, company, country of residence, destinations, travel dates, number
          and type of travelers, budget and any message.
        </li>
        <li>
          <strong>Booking details:</strong> if you go ahead with a booking, the information suppliers need, such as
          travelers&rsquo; full names, dates of birth, passport or ID details, and any medical, mobility or dietary
          needs you choose to tell us. We ask for these only when the booking requires them.
        </li>
        <li>
          <strong>Website usage:</strong> if you accept analytics cookies, anonymous statistics about pages visited and
          device and browser type. See <a href="#cookies">Cookies</a> below.
        </li>
      </ul>
      <p>
        If you give us details about other travelers, such as family members, children or colleagues, please make
        sure they (or, for minors, their parent or guardian) agree to you sharing them.
      </p>

      <h2>How we use it and why</h2>
      <ul>
        <li>To reply to your inquiry and prepare quotations, with your consent when you submit a form.</li>
        <li>
          To make and manage your booking with airlines, hotels and other suppliers, because this is needed to
          fulfil our agreement with you.
        </li>
        <li>To keep accounting and tax records, because the law requires it.</li>
        <li>To protect our forms from spam and abuse, and to improve the website.</li>
      </ul>
      <p>We do not use your information for automated decision-making and we do not sell it.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li>Airlines, hotels, tour operators and other suppliers needed to fulfil your booking.</li>
        <li>Embassies or visa processing centers, when you ask us to help with a visa.</li>
        <li>
          Service providers that run this website and our communications for us, such as our hosting, email and
          analytics providers, under obligations to keep the information secure.
        </li>
        <li>Government authorities, when required by law.</li>
      </ul>
      <p>
        Some of these providers and suppliers store or process information outside the Philippines, for example when
        you book an international trip or because our hosting and email services run on servers abroad. We only work
        with providers that protect personal information to a standard comparable to Philippine law.
      </p>

      <h2 id="cookies">Cookies</h2>
      <p>
        This website uses Google Analytics to measure traffic only if you accept analytics cookies in the cookie
        banner. You can change your choice at any time through the &ldquo;Cookie Settings&rdquo; link in the footer.
        If you decline, no analytics cookies are set.
      </p>
      <p>
        Our forms are protected by Google reCAPTCHA to block spam. It analyses how the form is used and is subject
        to Google&rsquo;s <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/terms">Terms of Service</a>.
      </p>
      <p>
        The WhatsApp and Messenger chat buttons open those apps directly. Conversations there are also subject to
        Meta&rsquo;s privacy policies.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Inquiries that do not lead to a booking are deleted within two years of our last contact with you.</li>
        <li>
          Booking and payment records are kept for as long as Philippine tax and accounting rules require, then
          deleted.
        </li>
        <li>You can ask us to delete your inquiry earlier at any time.</li>
      </ul>

      <h2>How we protect it</h2>
      <p>
        The website uses encrypted connections (HTTPS), our admin area is password-protected and limited to staff who
        need it, and we share information with suppliers only as far as your booking requires. If a breach ever
        affects your information, we will notify you and the National Privacy Commission as the law requires.
      </p>

      <h2>Your rights</h2>
      <p>Under the Data Privacy Act, you have the right to:</p>
      <ul>
        <li>be informed about how your personal information is used;</li>
        <li>access the information we hold about you and get a copy of it;</li>
        <li>have inaccurate information corrected;</li>
        <li>object to processing, or withdraw your consent;</li>
        <li>have your information deleted or blocked;</li>
        <li>receive your information in a commonly used electronic format; and</li>
        <li>claim damages if you are harmed by inaccurate or unlawfully used information.</li>
      </ul>
      <p>
        To use any of these rights, write to our Data Protection Officer at {contact}. We will reply within 15
        working days. Withdrawing consent may mean we can no longer complete a booking in progress.
      </p>
      <p>
        If you are not satisfied with our response, you may file a complaint with the{' '}
        <a href="https://privacy.gov.ph">National Privacy Commission</a>.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. The latest version, with its date, is always on this page.
      </p>
    </main>
  )
}
