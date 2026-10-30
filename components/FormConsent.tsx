import Link from 'next/link'
import styles from './FormConsent.module.css'

// Shown above every inquiry form's submit button so visitors know how their details are used before sending.
export default function FormConsent() {
  return (
    <p className={styles.consent}>
      By submitting, you agree that we may use your details to reply and prepare your trip, as described in our{' '}
      <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>.
    </p>
  )
}
