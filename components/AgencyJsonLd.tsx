import { getCompanyDetails } from '@/lib/company'
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/lib/site'

// TravelAgency structured data, rendered on the home page only.
export default async function AgencyJsonLd() {
  const company = await getCompanyDetails()

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    legalName: 'MCP Greenery Travel and Tours',
    url: SITE_URL,
    logo: absoluteUrl('/images/logo-square.png'),
    image: absoluteUrl('/images/hero-islands.jpg'),
    email: company.email || undefined,
    telephone: company.contactNumbers[0] || undefined,
    address: company.address ? { '@type': 'PostalAddress', streetAddress: company.address, addressCountry: 'PH' } : undefined,
    areaServed: 'PH',
    sameAs: [
      'https://www.facebook.com/EnjoyKaDito',
      'https://www.instagram.com/enjoykadito/',
      'https://www.tiktok.com/@enjoykaditotravels',
    ],
  }).replace(/</g, '\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
}
