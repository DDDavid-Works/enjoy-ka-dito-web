// Permanent redirects from the old WordPress site's page URLs (listed in its page-sitemap.xml, checked 2026-10-14)
// to the closest page on this site, so rankings and bookmarks carry over once enjoykadito.com points here.
// Paths are written without a trailing slash: Next.js strips it before matching.

const SERVICES = '/travel-services'
const TOURS = '/tour-packages'
const CORPORATE = '/corporate-team-building'

// [old path, new path]
export const LEGACY_PAGE_REDIRECTS: Array<[string, string]> = [
  ['/about', '/about-us'],
  ['/contact', '/contact-us'],
  ['/book-now', '/request-a-quote'],
  ['/faq', '/contact-us'],

  // Services
  ['/services', SERVICES],
  ['/visa-assistance', SERVICES],
  ['/travel-insurance', SERVICES],
  ['/passport-appointment', SERVICES],
  ['/hotel-reservation', SERVICES],
  ['/booking-and-ticketing', SERVICES],
  ['/land-arrangement', SERVICES],
  ['/cruise-packages', SERVICES],

  // Package listings
  ['/domestic-and-international-tour-packages', TOURS],
  ['/rates-and-packages', TOURS],
  ['/international-packages-2', TOURS],

  // Audience pages
  ['/team-building-package', CORPORATE],
  ['/team-building-packages', CORPORATE],
  ['/cebu-team-building-package', CORPORATE],
  ['/coron-team-building-package', CORPORATE],
  ['/hundred-islands-bolinao-team-building-package', CORPORATE],
  ['/hundred-islands-team-building-package', CORPORATE],
  ['/puerto-princesa-team-building-package', CORPORATE],
  ['/boracay-team-building-package', CORPORATE],
  ['/family-tour-enjoy-ka-dito', '/family-senior-tours'],
  ['/senior-travel-services-enjoy-ka-dito', '/family-senior-tours'],
  ['/international-foreign-tour-enjoy-ka-dito', '/philippines-inbound'],

  // Tours that exist as packages on this site
  ['/puerto-princesa-tour-package', `${TOURS}/puerto-princesa-package`],
  ['/enjoy-ka-dito-hundred-islands-tour-package', `${TOURS}/hundred-island-package`],
  ['/pangasinanbolinao-hundred-islandstour-package', `${TOURS}/hundred-island-package`],
  ['/enjoy-ka-dito-bolinao-package-for-groups', `${TOURS}/bolinao-package`],
  ['/south-cebu-tour-package', `${TOURS}/cebu-package`],
  ['/cebu-city-tour-package', `${TOURS}/cebu-package`],
  ['/boracay-tour-package', `${TOURS}/boracay-tour-package`],

  // Tours with no matching package yet: send to the listing
  ['/china-tour-packages', TOURS],
  ['/japan-tour-package', TOURS],
  ['/taiwan-tour-package', TOURS],
  ['/enjoy-ka-dito-tarlac-package', TOURS],
  ['/enjoy-ka-dito-ilocos-package-for-groups-with-van-transfer-manila-baler-manila', TOURS],
  ['/enjoy-ka-dito-puerto-galera-package-for-groups-with-boat-transfer-batangas-port-back-and-fort', TOURS],
  ['/enjoy-ka-dito-san-juan-la-union-package', TOURS],
  ['/siargao-4d3n-tour-package', TOURS],
  ['/siargao-tour-package', TOURS],
  ['/sagada-tour-package', TOURS],
  ['/coron-palawan-tour-package', TOURS],
  ['/el-nido-palawan-tour-package', TOURS],
  ['/baguio-city-tour-package', TOURS],
  ['/bataan-tour-package', TOURS],
  ['/batangas-tour-package-2', TOURS],
  ['/bohol-tour-package-2', TOURS],

  // Misc
  ['/more', '/'],
  ['/facebook', 'https://www.facebook.com/EnjoyKaDito'],
]

// Old pages with no equivalent here (they will 404 unless a decision is made): /weather-broadcast, /bulletin,
// /photo-gallery, /let-us-help-you-how, /more/testimonial, and the Shella Viray testimonial page.
// The ~1,425 news posts (/YYYY/MM/DD/slug), /category/*, /tag/* and /author/* are also undecided.
