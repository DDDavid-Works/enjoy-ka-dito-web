// Helpers for the rich-text (HTML) quotation notes. Older notes were saved as plain
// text, so anything without tags is treated as plain text and turned into paragraphs.

const HAS_TAGS = /<\/?[a-z][^>]*>/i

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Plain text or HTML in, HTML out ('' stays '').
export function notesToHtml(value: string | null | undefined): string {
  const text = value ?? ''
  if (!text.trim()) return ''
  if (HAS_TAGS.test(text)) return text
  return text
    .split(/\r?\n/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')
}

// True when the HTML has no visible text (e.g. "<p></p>" from an emptied editor).
export function isBlankHtml(html: string | null | undefined): boolean {
  return !(html ?? '').replace(/<[^>]*>/g, '').replace(/&nbsp;| /g, '').trim()
}

// What gets saved: '' for an empty editor, otherwise the HTML without trailing empty lines.
export function cleanRichText(html: string): string {
  return isBlankHtml(html) ? '' : html.trim().replace(/(<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>)+$/, '')
}
