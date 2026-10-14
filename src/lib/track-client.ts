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
//
// GA4 and the Meta Pixel (PR 3): nothing from either vendor is requested before its
// category is agreed. "Měření návštěvnosti" loads GA4 (Consent Mode v2: default
// denied, then update with the choice); "Reklama a remarketing" loads the Pixel and
// turns on GA4's advertising signals. The script tag is added on idle. A withdrawal
// switches the vendor off for the rest of the page load. Without an id the vendor
// is never loaded.
export function trackClient(
  endpoint: string,
  consentCookie: string,
  consentVersion: number,
  sidCookie: string,
  vendors: { ga4: string | null; pixel: string | null },
) {
  const doc = document
  const params = new URLSearchParams(location.search)
  const debug = params.get('debug') === '1'

  const cookie = (name: string) => {
    const match = new RegExp('(?:^|;\\s*)' + name + '=([^;]*)').exec(doc.cookie)
    return match ? match[1] : null
  }

  const choice = () => {
    const match = /^v(\d+)-m([01])-a([01])-\d+$/.exec(
      cookie(consentCookie) || '',
    )
    return match && Number(match[1]) === consentVersion
      ? { measurement: match[2] === '1', advertising: match[3] === '1' }
      : null
  }
  const agreed = () => {
    const current = choice()
    return !!current && current.measurement
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

  // ---- GA4 and the Meta Pixel ------------------------------------------------
  const w = window as unknown as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  let gaStarted = false
  let gaOn = false
  let metaStarted = false
  let metaOn = false

  const idle = (run: () => void) => {
    if ('requestIdleCallback' in window)
      requestIdleCallback(run, { timeout: 2000 })
    else setTimeout(run, 200)
  }
  const addScript = (src: string) => {
    const tag = doc.createElement('script')
    tag.async = true
    tag.src = src
    doc.head.appendChild(tag)
  }
  // The standard gtag shape: gtag.js reads `arguments` objects from dataLayer.
  const gtag: (...args: unknown[]) => void = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments)
  }
  const grant = (on: boolean) => (on ? 'granted' : 'denied')
  const signals = (measurement: boolean, advertising: boolean) => ({
    analytics_storage: grant(measurement),
    ad_storage: grant(advertising),
    ad_user_data: grant(advertising),
    ad_personalization: grant(advertising),
  })
  const props = (extra?: Record<string, unknown>) => {
    const out: Record<string, unknown> = {
      variant: main && main.getAttribute('data-variant') === 'b' ? 'b' : 'a',
      device,
      in_app_browser: inAppBrowser,
    }
    if (extra) Object.assign(out, extra)
    return out
  }

  // Called at load and on every choice. Never requests anything for a category that
  // is not agreed, and switches a vendor off when its category is withdrawn.
  const apply = () => {
    const current = choice()
    const measurement = !!current && current.measurement
    const advertising = !!current && current.advertising

    if (vendors.ga4) {
      if (measurement && !gaStarted) {
        gaStarted = true
        gaOn = true
        w.dataLayer = w.dataLayer || []
        gtag('consent', 'default', signals(false, false))
        gtag('consent', 'update', signals(true, advertising))
        gtag('js', new Date())
        gtag('config', vendors.ga4, { send_page_view: false })
        // the page the visitor agreed on is being viewed now
        gtag('event', 'page_view', props())
        idle(() =>
          addScript(
            'https://www.googletagmanager.com/gtag/js?id=' +
              encodeURIComponent(vendors.ga4 as string),
          ),
        )
      } else if (gaStarted) {
        w['ga-disable-' + vendors.ga4] = !measurement
        gtag('consent', 'update', signals(measurement, advertising))
        gaOn = measurement
      }
    }

    if (vendors.pixel) {
      if (advertising && !metaStarted) {
        metaStarted = true
        metaOn = true
        type Fbq = {
          (...args: unknown[]): void
          callMethod?: (...args: unknown[]) => void
          queue: unknown[][]
          loaded: boolean
          version: string
        }
        const fbq: Fbq = function (...args: unknown[]) {
          if (fbq.callMethod) fbq.callMethod(...args)
          else fbq.queue.push(args)
        } as Fbq
        fbq.queue = []
        fbq.loaded = true
        fbq.version = '2.0'
        w.fbq = fbq
        w._fbq = fbq
        w.fbq('init', vendors.pixel)
        w.fbq('track', 'PageView')
        idle(() => addScript('https://connect.facebook.net/en_US/fbevents.js'))
      } else if (metaStarted) {
        w.fbq('consent', advertising ? 'grant' : 'revoke')
        metaOn = advertising
      }
    }
  }

  // One first-party event, forwarded to the vendors whose category is on. page_view
  // is sent by `apply` when a vendor starts, so it is not sent twice.
  const forward = (name: string, extra?: Record<string, unknown>) => {
    if (name === 'page_view') return
    if (gaOn) gtag('event', name, props(extra))
    if (metaOn && name === 'calc_result') w.fbq('track', 'ViewContent')
  }
  // ----------------------------------------------------------------------------

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
    try {
      forward(name, extra)
    } catch {
      // a vendor never breaks the page or the first-party count
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
  apply()
  window.addEventListener('kompas:consent', () => {
    try {
      apply()
    } catch {
      // a vendor never breaks the page
    }
  })

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
      // Advertising agreed: tell the server (it may send the lead to Meta) and pass the
      // Pixel's browser id when there is one.
      const ads =
        form && (form.elements.namedItem('ads') as HTMLInputElement | null)
      const fbp =
        form && (form.elements.namedItem('fbp') as HTMLInputElement | null)
      const on = !!choice() && choice()!.advertising
      if (ads) ads.value = on ? '1' : ''
      if (fbp) fbp.value = on ? cookie('_fbp') || '' : ''
    },
    true,
  )

  // The lead (PR 4): the success state of the form carries the id the server made.
  // The vendors get the browser side of it, with that id so they can drop the
  // server's copy of the same conversion. The first-party `lead` is the server's.
  const leads: Record<string, boolean> = {}
  const watchLead = () => {
    const mark = doc.querySelector('[data-lead-event-id]')
    const id = mark && mark.getAttribute('data-lead-event-id')
    if (!id || leads[id]) return
    leads[id] = true
    try {
      if (gaOn) gtag('event', 'generate_lead', props({ event_id: id }))
      if (metaOn) w.fbq('track', 'Lead', {}, { eventID: id })
    } catch {
      // a vendor never breaks the page
    }
  }
  if (typeof MutationObserver !== 'undefined' && main) {
    new MutationObserver(watchLead).observe(main, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-lead-event-id'],
    })
  }

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
