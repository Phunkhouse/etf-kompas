// The first-party tracker, as plain browser code. Like the cookie bar it is written
// into one inline <script> (`Tracker`), not imported by the React tree, so it adds no
// framework JavaScript (note 0062). Keep it self-contained: no imports, no outer
// variables, nothing a compiler would turn into a helper.
//
// Events (SPEC §9, docs/PHASE-5-PLAN.md "PR 2"): page_view on load; calc_start on
// the first change in `[data-track="calculator"]`; calc_result once the result
// (`[data-track="result"]`) has been in view for one second after calc_start;
// gate_view when `#formular` is half in view; form_focus when the e-mail field is
// focused. Each fires once per page load. `lead` is written by the server.
//
// Before the visitor agrees to measurement there is no cookie and no storage: the
// session id lives in memory for this page load. After they agree it is kept in the
// session cookie `sidCookie`, and withdrawn consent removes the cookie. The id goes
// to the lead form only then (a hidden `sid` field, set when the form is submitted).
// `?debug=1` prints each event to the console.
export function trackClient(
  endpoint: string,
  consentCookie: string,
  consentVersion: number,
  sidCookie: string,
) {
  const doc = document
  const params = new URLSearchParams(location.search)
  const debug = params.get('debug') === '1'

  const cookie = (name: string) => {
    const match = new RegExp('(?:^|;\\s*)' + name + '=([^;]*)').exec(doc.cookie)
    return match ? match[1] : null
  }

  const agreed = () => {
    const match = /^v(\d+)-m([01])-a[01]-\d+$/.exec(cookie(consentCookie) || '')
    return !!match && Number(match[1]) === consentVersion && match[2] === '1'
  }

  const uuid = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6] & 15) | 64
    bytes[8] = (bytes[8] & 63) | 128
    const hex = Array.from(bytes, (byte) =>
      ('0' + byte.toString(16)).slice(-2),
    ).join('')
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-')
  }

  const stored = cookie(sidCookie)
  const sid =
    agreed() && stored && /^[0-9a-f-]{36}$/.test(stored) ? stored : uuid()

  // The id is kept in a cookie only while measurement is agreed.
  const persist = () => {
    doc.cookie = agreed()
      ? sidCookie +
        '=' +
        sid +
        '; Path=/; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '')
      : sidCookie + '=; Max-Age=0; Path=/'
  }
  if (agreed() || stored) persist()
  window.addEventListener('kompas:consent', persist)

  const main = doc.querySelector('main[data-variant]')
  const device = matchMedia('(max-width: 767px)').matches ? 'phone' : 'desktop'
  const inAppBrowser = /Instagram|FBAN|FBAV/.test(navigator.userAgent)

  const send = (name: string, extra?: Record<string, unknown>) => {
    const payload: Record<string, unknown> = {
      sessionId: sid,
      name,
      variant: main && main.getAttribute('data-variant') === 'b' ? 'b' : 'a',
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      device,
      inAppBrowser,
      measurement: agreed(),
    }
    if (name === 'page_view') payload.fbclid = params.get('fbclid')
    if (extra) Object.assign(payload, extra)
    if (debug) console.log('[track]', payload)
    try {
      const body = JSON.stringify(payload)
      const queued =
        navigator.sendBeacon &&
        navigator.sendBeacon(
          endpoint,
          new Blob([body], { type: 'application/json' }),
        )
      if (!queued) {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      }
    } catch {
      // measuring never breaks the page
    }
  }

  const fired: Record<string, boolean> = {}
  const once = (name: string, extra?: () => Record<string, unknown>) => {
    if (fired[name]) return false
    fired[name] = true
    send(name, extra ? extra() : undefined)
    return true
  }

  let started = false
  let resultVisible = false
  let resultTimer: ReturnType<typeof setTimeout> | null = null

  const value = (name: string) => {
    const field = doc.querySelector(
      'input[type="hidden"][name="' + name + '"]',
    ) as HTMLInputElement | null
    return field ? Number(field.value) : NaN
  }

  // calc_result: the result has been in view for one second after calc_start.
  const armResult = () => {
    if (fired.calc_result || resultTimer || !started || !resultVisible) return
    resultTimer = setTimeout(() => {
      resultTimer = null
      if (resultVisible) {
        once('calc_result', () => ({
          monthly: value('monthly'),
          years: value('years'),
        }))
      }
    }, 1000)
  }

  const start = () => {
    if (once('calc_start')) {
      started = true
      armResult()
    }
  }

  send('page_view')
  fired.page_view = true

  doc.addEventListener('input', (event) => {
    const target = event.target as Element | null
    if (target && target.closest('[data-track="calculator"]')) start()
  })
  doc.addEventListener('click', (event) => {
    const target = event.target as Element | null
    const button = target && target.closest('button')
    if (button && button.closest('[data-track="calculator"]')) start()
  })
  doc.addEventListener('focusin', (event) => {
    const target = event.target as HTMLInputElement | null
    if (target && target.matches('input[name="email"]')) once('form_focus')
  })
  // The session id goes to the lead only when measurement is agreed.
  doc.addEventListener(
    'submit',
    (event) => {
      const form = event.target as HTMLFormElement | null
      const field =
        form && (form.elements.namedItem('sid') as HTMLInputElement | null)
      if (field) field.value = agreed() ? sid : ''
    },
    true,
  )

  if (typeof IntersectionObserver !== 'undefined') {
    const result = doc.querySelector('[data-track="result"]')
    if (result) {
      new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            resultVisible =
              entry.isIntersecting && entry.intersectionRatio >= 0.5
            if (resultVisible) armResult()
            else if (resultTimer) {
              clearTimeout(resultTimer)
              resultTimer = null
            }
          }
        },
        { threshold: [0, 0.5, 1] },
      ).observe(result)
    }
    const gate = doc.getElementById('formular')
    if (gate) {
      const watcher = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (
              entry.isIntersecting &&
              (entry.intersectionRatio >= 0.5 ||
                entry.intersectionRect.height >= innerHeight / 2)
            ) {
              once('gate_view')
              watcher.disconnect()
            }
          }
        },
        { threshold: [0.1, 0.25, 0.5, 0.75, 1] },
      )
      watcher.observe(gate)
    }
  }
}
