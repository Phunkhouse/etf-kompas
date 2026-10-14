import { CONSENT_COOKIE, CONSENT_VERSION } from '@/lib/consent'
import { trackClient } from '@/lib/track-client'

export const SESSION_COOKIE = 'kompas_sid'

// The first-party tracker of the landing page: one inline script (about 2 KB), no
// React client component, so it adds no framework JavaScript (note 0062). Put it
// after the page body, so the elements it watches already exist.
const script = `(${trackClient.toString()})(${JSON.stringify('/api/event')},${JSON.stringify(CONSENT_COOKIE)},${CONSENT_VERSION},${JSON.stringify(SESSION_COOKIE)})`

export function Tracker() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
