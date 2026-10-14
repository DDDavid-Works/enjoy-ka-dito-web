import type { Package, PackageInput } from '@/types/package'
import type { Inquiry, InquiryInput } from '@/types/inquiry'
import type { Hotel, HotelInput } from '@/types/hotel'
import type { Quotation, QuotationInput } from '@/types/quotation'
import type { CompanyDetails } from '@/types/company'
import type { User, UserInput } from '@/types/user'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
const STORAGE_KEY = 'ekd-admin-auth'

function getToken(): string | null {
  // Public pages call the API on the server, where there is no browser storage.
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored).accessToken ?? null
  } catch {
    return null
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T

  return response.json()
}

export const packagesApi = {
  list: () => request<Package[]>('/packages'),
  get: (slug: string) => request<Package>(`/packages/${slug}`),
  create: (data: PackageInput) =>
    request<Package>('/packages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<PackageInput>) =>
    request<Package>(`/packages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/packages/${id}`, { method: 'DELETE' }),
}

export const hotelsApi = {
  list: () => request<Hotel[]>('/hotels'),
  get: (id: string) => request<Hotel>(`/hotels/${id}`),
  create: (data: HotelInput) => request<Hotel>('/hotels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<HotelInput>) =>
    request<Hotel>(`/hotels/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/hotels/${id}`, { method: 'DELETE' }),
}

export const inquiriesApi = {
  create: (data: InquiryInput) =>
    request<Inquiry>('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request<Inquiry[]>('/inquiries'),
  get: (id: string) => request<Inquiry>(`/inquiries/${id}`),
  updateStatus: (id: string, status: Inquiry['status']) =>
    request<Inquiry>(`/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

export const quotationsApi = {
  list: () => request<Quotation[]>('/quotations'),
  get: (id: string) => request<Quotation>(`/quotations/${id}`),
  create: (data: QuotationInput) => request<Quotation>('/quotations', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<QuotationInput>) =>
    request<Quotation>(`/quotations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/quotations/${id}`, { method: 'DELETE' }),
}

export const authApi = {
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<void>('/auth/password', { method: 'PATCH', body: JSON.stringify(data) }),
}

export const usersApi = {
  list: () => request<User[]>('/users'),
  get: (id: string) => request<User>(`/users/${id}`),
  create: (data: UserInput & { password: string }) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<UserInput>) =>
    request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (id: string, data: { newPassword: string; currentPassword?: string }) =>
    request<void>(`/users/${id}/password`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
}

export const companyApi = {
  get: () => request<CompanyDetails>('/company-details'),
  update: (data: Partial<CompanyDetails>) =>
    request<CompanyDetails>('/company-details', { method: 'PATCH', body: JSON.stringify(data) }),
}

export type UploadedImage = { id: string; url: string; width: number; height: number; size: number }

export const mediaApi = {
  // Multipart upload: the browser sets the Content-Type (with the boundary), so this can't use request().
  async upload(file: File): Promise<UploadedImage> {
    const token = getToken()
    const body = new FormData()
    body.append('file', file)

    const response = await fetch(`${API_URL}/media`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? `Upload failed (${response.status})`)
    }

    return response.json()
  },
}
