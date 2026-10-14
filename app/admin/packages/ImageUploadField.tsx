'use client'

import { useRef, useState } from 'react'
import { mediaApi } from '@/lib/api'
import fieldStyles from './PackageForm.module.css'
import styles from './ImageUploadField.module.css'

const MAX_BYTES = 25 * 1024 * 1024

type Props = {
  label: string
  value: string
  onChange: (url: string) => void
}

// An image stored on this site: pick a file and it is resized and saved by the API; the saved address goes into the
// field. The address can still be edited or pasted by hand (e.g. an image hosted elsewhere).
export default function ImageUploadField({ label, value, onChange }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setNote(null)

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPEG, PNG or WebP image.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('That file is over 25 MB. Choose a smaller one.')
      return
    }

    setUploading(true)
    try {
      const uploaded = await mediaApi.upload(file)
      onChange(uploaded.url)
      setNote(`Uploaded and resized to ${uploaded.width} × ${uploaded.height} (${Math.round(uploaded.size / 1024)} KB). Save the package to keep it.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  return (
    <div className={fieldStyles.field}>
      <label>{label}</label>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value ? <img src={value} alt="" className={styles.preview} /> : <div className={styles.empty}>No image yet</div>}

      <div className={styles.actions}>
        <button type="button" className={styles.button} disabled={uploading} onClick={() => fileInput.current?.click()}>
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
        {value && !uploading && (
          <button type="button" className={styles.remove} onClick={() => onChange('')}>
            Remove
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {note && <p className={styles.status}>{note}</p>}

      <span className={styles.urlLabel}>Or paste an image address</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://…" />
    </div>
  )
}
