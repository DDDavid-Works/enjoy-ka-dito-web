'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usersApi } from '@/lib/api'
import { useAuth } from '@/context/auth'
import { MIN_PASSWORD_LENGTH, type UserInput } from '@/types/user'
import { MODULES, type ModuleKey } from '@/types/modules'
import styles from '../hotels/HotelForm.module.css'

const EMPTY: UserInput = { name: '', email: '', contactNumber: '', modules: [] }

export default function UserForm() {
  const { id } = useParams<{ id?: string }>()
  const isEditing = Boolean(id)
  const router = useRouter()
  const { admin } = useAuth()
  const isSelf = isEditing && admin?.id === id

  const [form, setForm] = useState<UserInput>(EMPTY)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Separate state for the password changer so it doesn't mix with the details form.
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [pwSubmitting, setPwSubmitting] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditing || !id) return

    usersApi
      .get(id)
      .then((user) =>
        setForm({ name: user.name, email: user.email, contactNumber: user.contactNumber ?? '', modules: user.modules }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load user.'))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  function updateField<K extends keyof UserInput>(key: K, value: UserInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleModule(key: ModuleKey, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      modules: checked ? [...prev.modules, key] : prev.modules.filter((m) => m !== key),
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isEditing) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setSubmitting(true)
    const details = {
      name: form.name.trim(),
      email: form.email.trim(),
      contactNumber: form.contactNumber.trim(),
      modules: form.modules,
    }

    try {
      if (isEditing && id) {
        await usersApi.update(id, details)
        setSuccess('User saved successfully.')
      } else {
        await usersApi.create({ ...details, password })
        router.push('/admin/users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault()
    if (!id) return
    setPwError(null)
    setPwSuccess(null)

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPwError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPwError('Passwords do not match.')
      return
    }

    setPwSubmitting(true)
    try {
      await usersApi.changePassword(id, {
        newPassword,
        ...(isSelf ? { currentPassword } : {}),
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setPwSuccess('Password changed successfully.')
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to change password.')
    } finally {
      setPwSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <img src="/images/logo-square.png" alt="Enjoy Ka Dito" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <Link href="/admin/users" className={styles.backLink}>
          ← Back to Users
        </Link>

        <h1 className={styles.title}>{isEditing ? 'Edit User' : 'New User'}</h1>

        <form className={styles.form} onSubmit={handleSubmit} onChange={() => setSuccess(null)}>
          <div className={styles.field}>
            <label htmlFor="user-name">Full Name</label>
            <input id="user-name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="user-email">Email</label>
              <input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="user-contact">Contact Number (optional)</label>
              <input
                id="user-contact"
                value={form.contactNumber}
                onChange={(e) => updateField('contactNumber', e.target.value)}
                placeholder="e.g. +63 900 000 0000"
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Module access</div>
            <p className={styles.hint}>Tick the modules this user can open. Unticked modules are hidden and blocked.</p>
            {MODULES.map((m) => {
              // Own Users access can't be removed, or you'd lock yourself out.
              const lockedOn = isSelf && m.key === 'users'
              return (
                <label key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                  <input
                    type="checkbox"
                    checked={form.modules.includes(m.key)}
                    disabled={lockedOn}
                    onChange={(e) => toggleModule(m.key, e.target.checked)}
                  />
                  {m.label}
                  {lockedOn && <span className={styles.hint}>(required for your own account)</span>}
                </label>
              )
            })}
          </div>

          {!isEditing && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="user-password">Password</label>
                <input
                  id="user-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="user-confirm">Confirm Password</label>
                <input
                  id="user-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <p className={styles.success} role="status">
              {success}
            </p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create User'}
            </button>
            <button type="button" className={styles.cancel} onClick={() => router.push('/admin/users')}>
              Cancel
            </button>
          </div>
        </form>

        {isEditing && (
          <form
            className={styles.form}
            style={{ marginTop: 40 }}
            onSubmit={handlePasswordSubmit}
            onChange={() => setPwSuccess(null)}
          >
            <div className={styles.sectionTitle}>Change Password</div>
            <p className={styles.hint}>
              {isSelf
                ? 'Enter your current password to set a new one.'
                : `Set a new password for ${form.name || 'this user'}. They'll use it the next time they log in.`}
            </p>

            {isSelf && (
              <div className={styles.field}>
                <label htmlFor="user-current-password">Current Password</label>
                <input
                  id="user-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="user-new-password">New Password</label>
                <input
                  id="user-new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="user-confirm-new-password">Confirm New Password</label>
                <input
                  id="user-confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {pwError && <p className={styles.error}>{pwError}</p>}
            {pwSuccess && (
              <p className={styles.success} role="status">
                {pwSuccess}
              </p>
            )}

            <div className={styles.actions}>
              <button type="submit" className={styles.submit} disabled={pwSubmitting}>
                {pwSubmitting ? 'Changing…' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
