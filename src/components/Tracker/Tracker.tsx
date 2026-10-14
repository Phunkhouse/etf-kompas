import { trackingEnv } from '@/config/env'
import { CONSENT_COOKIE, CONSENT_VERSION } from '@/lib/consent'
import { trackClient } from '@/lib/track-client'

export const SESSION_COOKIE = 'kompas_sid'

// The first-party tracker of the landing page: one inline script (about 2 KB), no
// React client component, so it adds no framework JavaScript (note 0062). Put it
// after the page body, so the elements it watches already exist.
function buildScript() {
  return `(${trackClient.toString()})(${JSON.stringify('/api/event')},${JSON.stringify(CONSENT_COOKIE)},${CONSENT_VERSION},${JSON.stringify(SESSION_COOKIE)},${JSON.stringify(trackingEnv())})`
}

// The two tag ids are read when the page is built (`GA4_MEASUREMENT_ID`,
// `META_PIXEL_ID`); without them only the first-party events run.
export function Tracker() {
  return <script dangerouslySetInnerHTML={{ __html: buildScript() }} />
}
