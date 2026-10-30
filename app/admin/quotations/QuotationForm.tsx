'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { hotelsApi, inquiriesApi, packagesApi, quotationsApi } from '@/lib/api'
import {
  cleanAccommodations,
  cleanExclusions,
  cleanInclusions,
  cleanOptionalTours,
} from '@/lib/quotationSections'
import { buildQuotationFromInquiry, sectionsFromPackage } from '@/lib/quotationPrefill'
import { cleanRichText } from '@/lib/richText'
import RichTextField from '@/components/RichTextField'
import type { Hotel } from '@/types/hotel'
import type { Package } from '@/types/package'
import type { Quotation, QuotationInput } from '@/types/quotation'
import QuotationAccommodationsEditor from '../packages/QuotationAccommodationsEditor'
import QuotationExclusionsEditor from '../packages/QuotationExclusionsEditor'
import QuotationInclusionsEditor from '../packages/QuotationInclusionsEditor'
import QuotationOptionalToursEditor from '../packages/QuotationOptionalToursEditor'
import styles from '../packages/PackageForm.module.css'

// Today as YYYY-MM-DD in the user's local time zone (what a date input expects).
function todayIso() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const EMPTY: QuotationInput = {
  title: '',
  customerName: '',
  quoteDate: null,
  remarks: '',
  inclusions: [],
  inclusionNotes: '',
  paymentNotes: '',
  accommodations: [],
  exclusions: [],
  optionalTours: [],
  importantNotes: '',
}

export default function QuotationForm() {
  const { id } = useParams<{ id?: string }>()
  const isEditing = Boolean(id)
  const router = useRouter()
  const searchParams = useSearchParams()
  // Set when arriving from an inquiry's "Create Quotation" button.
  const inquiryId = isEditing ? null : searchParams.get('inquiry')

  // New quotations default to today's date; it can be changed or cleared.
  const [form, setForm] = useState<QuotationInput>(() => ({ ...EMPTY, quoteDate: isEditing ? null : todayIso() }))
  const [savedTitle, setSavedTitle] = useState('')
  const [basedOn, setBasedOn] = useState<Quotation['package']>(null)
  const [fromInquiry, setFromInquiry] = useState<Quotation['inquiry']>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [prefilledFrom, setPrefilledFrom] = useState<string | null>(null)
  // The last title this form generated from a package. While the title still equals it, the
  // title is "automatic" and follows the selected package; once you type your own, it stays.
  const autoTitle = useRef('')

  useEffect(() => {
    let cancelled = false

    hotelsApi
      .list()
      .then((data) => !cancelled && setHotels(data))
      .catch(() => {})

    if (!isEditing) {
      packagesApi
        .list()
        .then((data) => !cancelled && setPackages(data))
        .catch(() => {})
    }

    return () => {
      cancelled = true
    }
  }, [isEditing])

  // Start from an inquiry: fill the form with what it tells us, but save nothing.
  useEffect(() => {
    if (!inquiryId) return
    let cancelled = false

    async function prefill(inquiryId: string) {
      const inquiry = await inquiriesApi.get(inquiryId)
      const pkg = inquiry.package ? await packagesApi.get(inquiry.package.slug).catch(() => null) : null
      if (cancelled) return

      const prefill = buildQuotationFromInquiry(inquiry, pkg)
      autoTitle.current = prefill.title
      setForm((prev) => ({ ...prev, ...prefill }))
      setPrefilledFrom(inquiry.name)
    }

    prefill(inquiryId).catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load the inquiry.')
    })

    return () => {
      cancelled = true
    }
  }, [inquiryId])

  useEffect(() => {
    if (!id) return

    quotationsApi
      .get(id)
      .then((quotation) => {
        setSavedTitle(quotation.title)
        setBasedOn(quotation.package ?? null)
        setFromInquiry(quotation.inquiry ?? null)
        setForm({
          title: quotation.title,
          customerName: quotation.customerName ?? '',
          quoteDate: quotation.quoteDate ?? null,
          remarks: quotation.remarks ?? '',
          inclusions: quotation.inclusions,
          inclusionNotes: quotation.inclusionNotes ?? '',
          paymentNotes: quotation.paymentNotes ?? '',
          accommodations: quotation.accommodations,
          exclusions: quotation.exclusions,
          optionalTours: quotation.optionalTours,
          importantNotes: quotation.importantNotes ?? '',
        })
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load quotation.'))
      .finally(() => setLoading(false))
  }, [id])

  function updateField<K extends keyof QuotationInput>(key: K, value: QuotationInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Copy a package's quotation details into this quotation (replaces what's below).
  function startFromPackage(packageId: string) {
    const pkg = packages.find((p) => p.id === packageId)
    const titleIsAutomatic = !form.title.trim() || form.title === autoTitle.current

    if (!pkg) {
      if (titleIsAutomatic) autoTitle.current = ''
      setForm((prev) => ({ ...prev, packageId: undefined, title: titleIsAutomatic ? '' : prev.title }))
      return
    }

    const generatedTitle = `${pkg.title} Quotation`
    if (titleIsAutomatic) autoTitle.current = generatedTitle

    setForm((prev) => ({
      ...prev,
      packageId: pkg.id,
      title: titleIsAutomatic ? generatedTitle : prev.title,
      ...sectionsFromPackage(pkg),
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setSubmitting(true)

    const payload: QuotationInput = {
      ...form,
      title: form.title.trim(),
      customerName: form.customerName.trim(),
      remarks: form.remarks.trim(),
      inclusions: cleanInclusions(form.inclusions, { dropParentPrices: true }),
      inclusionNotes: cleanRichText(form.inclusionNotes),
      paymentNotes: cleanRichText(form.paymentNotes),
      accommodations: cleanAccommodations(form.accommodations),
      exclusions: cleanExclusions(form.exclusions),
      optionalTours: cleanOptionalTours(form.optionalTours),
      importantNotes: cleanRichText(form.importantNotes),
    }

    try {
      if (isEditing && id) {
        const saved = await quotationsApi.update(id, payload)
        // Stay on the page: sync the cleaned values (the name comes back proper-cased) and confirm the save.
        setForm({ ...payload, customerName: saved.customerName })
        setSavedTitle(payload.title)
        setSuccess('Quotation saved successfully.')
      } else {
        await quotationsApi.create(payload)
        router.push('/admin/quotations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quotation.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <img src="/images/logo-square.png" alt="Enjoy Ka Dito" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <Link href="/admin/quotations" className={styles.backLink}>
          ← Back to Quotations
        </Link>

        <h1 className={isEditing ? `${styles.title} ${styles.titleWithName}` : styles.title}>
          {isEditing ? 'Edit Quotation' : 'New Quotation'}
        </h1>
        {isEditing && <p className={styles.packageName}>{savedTitle}</p>}

        {prefilledFrom && (
          <p className={styles.hint}>
            Prefilled from the inquiry by {prefilledFrom}. Nothing is saved until you click Create Quotation.
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit} onChange={() => setSuccess(null)}>
          <div className={styles.field}>
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. El Nido Island Escape — Santos Family"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Prepared For</label>
            <input
              value={form.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              placeholder="Who is this quotation for?"
            />
          </div>

          <div className={styles.field}>
            <label>Quote Date</label>
            <input
              type="date"
              value={form.quoteDate ?? ''}
              onChange={(e) => updateField('quoteDate', e.target.value || null)}
            />
          </div>

          <div className={styles.field}>
            <label>Remarks</label>
            <textarea
              value={form.remarks}
              onChange={(e) => updateField('remarks', e.target.value)}
              placeholder="Notes about this quotation"
              rows={4}
            />
          </div>

          {!isEditing && (
            <div className={styles.field}>
              <label>Start from a package (optional)</label>
              <select value={form.packageId ?? ''} onChange={(e) => startFromPackage(e.target.value)}>
                <option value="">Blank quotation</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
              <p className={styles.hint}>
                Copies that package&rsquo;s quotation details below, replacing anything already entered. Changes here never
                affect the package.
              </p>
            </div>
          )}

          {isEditing && basedOn && (
            <p className={styles.hint}>
              Started from <Link href={`/admin/packages/${basedOn.id}/edit`}>{basedOn.title}</Link>
            </p>
          )}

          {isEditing && fromInquiry && (
            <p className={styles.hint}>
              Created from the inquiry by {fromInquiry.name} (see <Link href="/admin/inquiries">Inquiries</Link>)
            </p>
          )}

          <QuotationInclusionsEditor
            showTotals
            value={form.inclusions}
            onChange={(next) => updateField('inclusions', next)}
            notes={form.inclusionNotes}
            onNotesChange={(next) => updateField('inclusionNotes', next)}
            notesLabel="Tour Notes"
            richNotes
          >
            <div className={`${styles.field} ${styles.notesField}`}>
              <label>Payment Notes</label>
              <RichTextField
                ariaLabel="Payment Notes"
                value={form.paymentNotes}
                onChange={(next) => updateField('paymentNotes', next)}
                placeholder="e.g. 50% down payment to confirm the booking; full payment 30 days before travel."
              />
            </div>
          </QuotationInclusionsEditor>
          <QuotationAccommodationsEditor
            value={form.accommodations}
            hotels={hotels}
            hideInternalNote
            onChange={(next) => updateField('accommodations', next)}
          />
          <QuotationExclusionsEditor
            hideInternalNote
            value={form.exclusions}
            onChange={(next) => updateField('exclusions', next)}
          />
          <QuotationOptionalToursEditor
            hideInternalNote
            value={form.optionalTours}
            onChange={(next) => updateField('optionalTours', next)}
          />
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Important Notes</div>
            <div className={styles.field}>
              <RichTextField
                ariaLabel="Important Notes"
                value={form.importantNotes}
                onChange={(next) => updateField('importantNotes', next)}
                placeholder="e.g. Rates are subject to change without prior notice until the booking is confirmed."
              />
            </div>
          </div>

          {/* Stays on screen while scrolling, so the form can be saved from anywhere. */}
          <div className={styles.stickyFooter}>
            {error && <p className={styles.error}>{error}</p>}
            {success && (
              <p className={styles.success} role="status">
                {success}
              </p>
            )}

            <div className={styles.actions}>
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Quotation'}
              </button>
              <button type="button" className={styles.cancel} onClick={() => router.push('/admin/quotations')}>
                Cancel
              </button>
              {isEditing && id && (
                <button
                  type="button"
                  className={styles.cancel}
                  title="Exports the saved version of this quotation"
                  onClick={() => window.open(`/admin/quotations/${id}/print`, '_blank')}
                >
                  Export PDF
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
