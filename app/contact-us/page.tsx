import type { Metadata } from 'next'
import { getCompanyDetails } from '@/lib/company'
import ContactUs from './ContactUs'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Questions about travel with Enjoy Ka Dito? Reach our Philippine-based team for general inquiries, partnerships and feedback.',
  alternates: { canonical: '/contact-us' },
}

export default async function Page() {
  const company = await getCompanyDetails()
  return <ContactUs company={company} />
}
