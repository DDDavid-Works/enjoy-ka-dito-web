'use client'

import { useRef, useState } from 'react'
import { mediaApi } from '@/lib/api'
import fieldStyles from './PackageForm.module.css'
import styles from './ImageUploadField.module.css'

// Originals can be big (phone photos, the old website's ~10 MB images): they are shrunk here, in the browser,
// so the server only ever receives a small file. The server still refuses anything over 6 MB.
const MAX_ORIGINAL_BYTES = 40 * 1024 * 1024
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024
const MAX_WIDTH = 2000

async function shrinkForUpload(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, MAX_WIDTH / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const context = canvas.getContext('2d')
    if (!context) return file
    context.fillStyle = '#ffffff' // transparent PNGs become white instead of black
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file // the browser couldn't decode it: let the server decide (it rejects files over 6 MB)
  }
}

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
    if (file.size > MAX_ORIGINAL_BYTES) {
      setError('That file is over 40 MB. Choose a smaller one.')
      return
    }

    setUploading(true)
    try {
      const prepared = await shrinkForUpload(file)
      if (prepared.size > MAX_UPLOAD_BYTES) {
        setError('That image is still over 6 MB after shrinking. Choose a smaller one.')
        return
      }
      const uploaded = await mediaApi.upload(prepared)
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
