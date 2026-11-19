// Error text for the public inquiry forms: what didn't happen, why, and a way to still reach us.
// `what` names the thing being sent, e.g. 'quote request' or 'trip details'.
// Pass `onContactPage` where the phone and email are already shown next to the form.
export function formErrorMessage(error: unknown, what: string, onContactPage = false): string {
  const reason = error instanceof Error && error.message ? error.message : 'Try again in a moment.'
  const verb = what.endsWith('s') ? 'weren’t' : 'wasn’t'
  const where = onContactPage ? 'the details on this page' : 'the details on the Contact page'
  return `Your ${what} ${verb} sent. ${reason} If it keeps happening, call or email us using ${where}.`
}
