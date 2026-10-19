// reCAPTCHA v3: loads Google's script on first use and returns a token for the API to verify.
// Returns undefined when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is unset (the API then skips the check too).
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

type Grecaptcha = {
  ready: (callback: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

let scriptLoaded: Promise<void> | null = null

function loadScript() {
  scriptLoaded ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptLoaded = null
      reject(new Error('Could not load the spam check. Please check your connection and try again.'))
    }
    document.head.appendChild(script)
  })
  return scriptLoaded
}

export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  if (!SITE_KEY || typeof window === 'undefined') return undefined

  await loadScript()
  const grecaptcha = (window as unknown as { grecaptcha: Grecaptcha }).grecaptcha
  await new Promise<void>((resolve) => grecaptcha.ready(resolve))
  return grecaptcha.execute(SITE_KEY, { action })
}
