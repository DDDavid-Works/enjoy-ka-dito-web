// Keep in sync with AppModule in api/src/auth/modules.ts.
export const MODULES = [
  { key: 'inquiries', label: 'Inquiries' },
  { key: 'quotations', label: 'Quotations' },
  { key: 'packages', label: 'Tour Packages' },
  { key: 'hotels', label: 'Hotels & Resorts' },
  { key: 'company', label: 'Company Details' },
  { key: 'users', label: 'Users' },
] as const

export type ModuleKey = (typeof MODULES)[number]['key']
