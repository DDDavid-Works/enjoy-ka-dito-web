import type { Metadata } from 'next'
import Link from 'next/link'
import { getCompanyDetails } from '@/lib/company'
import styles from '../privacy-policy/page.module.css'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that apply when you use the Enjoy Ka Dito website and book travel with us.',
  alternates: { canonical: '/terms-and-conditions' },
}

export default async function TermsAndConditions() {
  const company = await getCompanyDetails()
  const email = company.emails.find(Boolean)
  const contact = email ? (
    <a href={`mailto:${email}`}>{email}</a>
  ) : (
    <Link href="/contact-us">our Contact Us page</Link>
  )

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Terms &amp; Conditions</h1>
      <p className={styles.updated}>Last updated: October 30, 2026</p>
      <p className={styles.intro}>
        These terms apply when you use this website and when you book travel with Enjoy Ka Dito, operated by MCP
        Greenery Travel and Tours (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By sending an inquiry or confirming a booking,
        you agree to them.
      </p>

      <h2>Quotations and prices</h2>
      <ul>
        <li>
          Prices on this website are for guidance only. Your written quotation states the exact price, what is
          included and excluded, and how long the quotation is valid.
        </li>
        <li>
          Airfares, hotel rates, taxes and exchange rates can change until your booking is confirmed and paid. If a
          supplier raises its price before then, we will tell you before going ahead.
        </li>
        <li>Services are subject to availability at the time of booking.</li>
      </ul>

      <h2>Bookings and payment</h2>
      <ul>
        <li>
          A booking is confirmed only once we receive the deposit or full payment stated in your quotation and send
          you a confirmation.
        </li>
        <li>
          The remaining balance must be paid by the due date in your quotation. If it isn&rsquo;t, we may cancel the
          booking and the cancellation charges below apply.
        </li>
        <li>
          Some fares and rates, such as promotional airfares, must be paid in full right away and cannot be refunded.
          Your quotation will say so.
        </li>
      </ul>

      <h2>Changes and cancellations by you</h2>
      <ul>
        <li>Please send any change or cancellation request to us in writing.</li>
        <li>
          Airlines, hotels and other suppliers apply their own change and cancellation rules, and we pass these
          charges on to you. Your quotation lists the charges that apply to your booking.
        </li>
        <li>
          We may also charge a service fee for processing changes or cancellations, as stated in your quotation.
        </li>
        <li>
          Refunds depend on what each supplier returns to us and can take as long as that supplier needs to process
          them. Unused services (for example a missed tour or a no-show) are not refundable.
        </li>
      </ul>

      <h2>Changes and cancellations by us or our suppliers</h2>
      <p>
        If we or a supplier must change or cancel a significant part of your trip, we will tell you as soon as
        possible and offer a comparable alternative or a refund of the amounts we are able to recover for the
        affected services.
      </p>

      <h2>Events outside our control</h2>
      <p>
        We are not responsible for delays, changes or cancellations caused by events outside our reasonable control,
        such as typhoons and other severe weather, natural disasters, government travel restrictions, strikes,
        epidemics, or flight cancellations and schedule changes made by airlines. In these cases we will help you
        rebook and recover what we can from suppliers.
      </p>

      <h2>Passports, visas and health requirements</h2>
      <ul>
        <li>
          You are responsible for having a valid passport (usually valid for at least six months after your return
          date), the right visas and any required health documents or vaccinations.
        </li>
        <li>
          We can give general guidance and assist with visa applications, but the decision rests with the embassy or
          immigration authority. Visa fees are not refundable if a visa is refused.
        </li>
        <li>
          Names on bookings must match your passport or valid ID exactly. Name corrections may be charged by the
          airline.
        </li>
      </ul>

      <h2>Travel insurance</h2>
      <p>
        We strongly recommend travel insurance that covers cancellation, medical costs and lost belongings. Some
        destinations require it for entry.
      </p>

      <h2>Our role and responsibility</h2>
      <ul>
        <li>
          We arrange flights, accommodation, transfers and tours as an agent for independent suppliers. Each supplier
          provides its service under its own terms and conditions.
        </li>
        <li>
          We take care in choosing suppliers and arranging your trip, but we are not liable for loss, injury, delay or
          damage caused by a supplier&rsquo;s acts or omissions, except where the law says otherwise.
        </li>
        <li>Nothing in these terms limits any right you have under the Consumer Act of the Philippines.</li>
      </ul>

      <h2>Your responsibilities</h2>
      <p>
        Please give us accurate and complete information, arrive on time for flights, transfers and tours, and
        follow the rules of each supplier and destination. Tell us before booking about any medical condition,
        mobility needs or dietary requirements that may affect your trip.
      </p>

      <h2>Use of this website</h2>
      <p>
        Content on this website, including text, logos and photos, belongs to us or is used under license, and may
        not be copied for commercial use without permission. We try to keep the information accurate, but tour
        details, schedules and prices can change.
      </p>

      <h2>Your personal information</h2>
      <p>
        We handle your personal information as described in our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>Complaints</h2>
      <p>
        If something goes wrong during your trip, please tell us and the supplier right away so it can be fixed on
        the spot. For complaints after your trip, write to {contact} and we will respond as soon as we can.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Republic of the Philippines.</p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version on this page when you confirm your booking is the one
        that applies to it.
      </p>
    </main>
  )
}
