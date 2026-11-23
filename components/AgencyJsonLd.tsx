import { getCompanyDetails } from '@/lib/company'
import { toInternationalNumber } from '@/lib/phone'
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/lib/site'

// Splits an address typed as "..., Town, Province 1234" so search engines can read the town, province and
// postcode. Anything that doesn't end that way is kept whole as the street address.
function toPostalAddress(address: string) {
  const parts = address.split(',').map((part) => part.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const tail = parts.at(-1)?.match(/^(.*?)\s*(\d{4})?$/)
  if (parts.length < 3 || !tail) {
    return { '@type': 'PostalAddress', streetAddress: parts.join(', '), addressCountry: 'PH' }
  }
  return {
    '@type': 'PostalAddress',
    streetAddress: parts.slice(0, -2).join(', '),
    addressLocality: parts.at(-2),
    addressRegion: tail[1] || undefined,
    postalCode: tail[2],
    addressCountry: 'PH',
  }
}

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
    email: company.emails[0] || undefined,
    telephone: company.contactNumbers[0] ? toInternationalNumber(company.contactNumbers[0]) : undefined,
    address: company.address ? toPostalAddress(company.address) : undefined,
    areaServed: 'PH',
    sameAs: [
      'https://www.facebook.com/EnjoyKaDito',
      'https://www.instagram.com/enjoykadito/',
      'https://www.tiktok.com/@enjoykaditotravels',
    ],
  }).replace(/</g, '\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
}
