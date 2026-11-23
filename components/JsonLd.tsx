import { SITE_NAME, SITE_URL } from '@/lib/site'

// Renders schema.org structured data. "<" is escaped so page text can't close the script tag.
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return items.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...item }).replace(/</g, '\\u003c') }}
    />
  ))
}

// Home › <name> breadcrumb for a top-level page.
export function breadcrumb(name: string, path: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  }
}

// A service the agency offers, linked to the agency as its provider.
export function service(name: string, description: string, path: string, areaServed: string[] = ['Philippines']) {
  return {
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${path}`,
    serviceType: 'Travel agency services',
    areaServed: areaServed.map((area) => ({ '@type': 'Place', name: area })),
    provider: { '@type': 'TravelAgency', name: SITE_NAME, url: SITE_URL },
  }
}
