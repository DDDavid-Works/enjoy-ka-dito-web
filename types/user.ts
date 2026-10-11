import type { ModuleKey } from './modules'

export type User = {
  id: string
  name: string
  email: string
  contactNumber: string | null
  modules: ModuleKey[]
  createdAt: string
}

export type UserInput = {
  name: string
  email: string
  contactNumber: string
  modules: ModuleKey[]
}

export const MIN_PASSWORD_LENGTH = 8
