import type { Metadata } from 'next'
import JsonLd, { breadcrumb } from '@/components/JsonLd'
import { getCompanyDetails } from '@/lib/company'
import ContactUs from './ContactUs'

export const metadata: Metadata = {
  title: 'Contact Our Philippine Travel Agency',
  description:
    'Questions about travel with Enjoy Ka Dito? Reach our Philippine-based team by email or phone for general inquiries, partnership proposals and feedback on trips.',
  alternates: { canonical: '/contact-us' },
}

export default async function Page() {
  const company = await getCompanyDetails()
  return (
    <>
      <JsonLd data={breadcrumb('Contact Us', '/contact-us')} />
      <ContactUs company={company} />
    </>
  )
}
