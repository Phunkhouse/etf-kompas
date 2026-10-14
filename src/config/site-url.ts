// The public address of the site, for the share image and other absolute links in the
// page head. It is read while the page is built, so it must never throw: a value that
// does not parse used to fail the whole build (first Vercel deploy, 2026-10-14). An
// address without a scheme gets `https://`; anything else unusable falls back to the
// local one with a warning that names the variable and never shows its value.
const LOCAL = 'http://localhost:3000'

export function siteUrl(
  source: Record<string, string | undefined> = process.env,
): URL {
  const raw = source.SITE_URL?.trim()
  if (!raw) return new URL(LOCAL)
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
  const candidate = hasScheme ? raw : `https://${raw}`
  try {
    const url = new URL(candidate)
    if (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname
    ) {
      if (!hasScheme) {
        console.warn('SITE_URL has no https:// in front; it was added.')
      }
      return new URL(url.origin)
    }
  } catch {
    // falls through to the warning
  }
  console.warn(
    'SITE_URL is not a valid web address; the local address is used instead.',
  )
  return new URL(LOCAL)
}
