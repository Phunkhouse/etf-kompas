import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CONSENT_COOKIE } from '@/lib/consent'
import { SESSION_COOKIE, Tracker } from './Tracker'

// Cases B-1 to B-9 of docs/PHASE-5-PLAN.md, with the real inline script. The page is a
// small stand-in with the elements the tracker watches.
type Sent = Record<string, unknown>
let sent: Sent[] = []
const observers: {
  callback: IntersectionObserverCallback
  target: Element | null
}[] = []
const originalDocumentAdd = document.addEventListener.bind(document)
const originalWindowAdd = window.addEventListener.bind(window)
const added: [string, EventListenerOrEventListenerObject, unknown][] = []
const addedWindow: [string, EventListenerOrEventListenerObject][] = []

async function readBlob(blob: Blob): Promise<Sent> {
  return JSON.parse(await blob.text()) as Sent
}

function mount(url = '/?utm_source=ig&fbclid=abc') {
  window.history.replaceState(null, '', url)
  document.body.innerHTML = `
    <main data-variant="b">
      <div data-track="calculator">
        <input type="hidden" name="monthly" value="5000" />
        <input type="hidden" name="years" value="10" />
        <input type="range" aria-label="Měsíčně" />
        <button type="button">20 let</button>
        <div data-track="result">výsledek</div>
      </div>
      <div id="formular">
        <form id="lead-form"><input type="hidden" name="sid" /><input type="hidden" name="ads" /><input type="hidden" name="fbp" /><input name="email" aria-label="e-mail" /></form>
      </div>
    </main>`
  const view = render(<Tracker />, {
    container: document.body.appendChild(document.createElement('div')),
  })
  const script = view.container.querySelector('script')
  vi.spyOn(document, 'addEventListener').mockImplementation(
    (
      type: string,
      handler: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) => {
      added.push([type, handler, options])
      originalDocumentAdd(type, handler, options)
    },
  )
  vi.spyOn(window, 'addEventListener').mockImplementation(
    (type: string, handler: EventListenerOrEventListenerObject) => {
      addedWindow.push([type, handler])
      originalWindowAdd(type, handler)
    },
  )
  new Function(script!.textContent ?? '')()
}

// Tells every observer that its element is (or is not) in view.
function inView(selector: string, visible: boolean) {
  const target = document.querySelector(selector)!
  for (const observer of observers.filter((o) => o.target === target)) {
    observer.callback(
      [
        {
          isIntersecting: visible,
          intersectionRatio: visible ? 1 : 0,
          intersectionRect: { height: visible ? 600 : 0 },
          target,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    )
  }
}

const names = () => sent.map((event) => event.name)
const clear = () => {
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/`
  document.cookie = `${SESSION_COOKIE}=; Max-Age=0; Path=/`
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  clear()
  sent = []
  navigator.sendBeacon = vi.fn((_url: string | URL, data?: BodyInit | null) => {
    void readBlob(data as Blob).then((payload) => sent.push(payload))
    return true
  })
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      callback: IntersectionObserverCallback
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
      }
      observe(target: Element) {
        observers.push({ callback: this.callback, target })
      }
      disconnect() {}
      unobserve() {}
    },
  )
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('767'),
    media: query,
  }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  for (const [type, handler, options] of added.splice(0)) {
    document.removeEventListener(type, handler, options as boolean)
  }
  for (const [type, handler] of addedWindow.splice(0)) {
    window.removeEventListener(type, handler)
  }
  observers.length = 0
  clear()
})

const flush = async () => {
  await vi.advanceTimersByTimeAsync(0)
}

describe('Tracker', () => {
  it('B-1 sends page_view once on load with variant, campaign, device and the in-app flag', async () => {
    mount()
    await flush()
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({
      name: 'page_view',
      variant: 'b',
      utm_source: 'ig',
      fbclid: 'abc',
      device: 'phone',
      inAppBrowser: false,
      measurement: false,
    })
    expect(sent[0].sessionId).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('B-1 flags Instagram, Facebook and Messenger user agents', async () => {
    for (const agent of [
      'Mozilla/5.0 Instagram 300',
      'FBAN/FBIOS',
      'FBAV/450',
    ]) {
      sent = []
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(agent)
      mount()
      await flush()
      expect(sent[0].inAppBrowser).toBe(true)
      document.body.innerHTML = ''
    }
  })

  it('B-2 sets no cookie and writes no storage before measurement is agreed', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    mount()
    await flush()
    expect(document.cookie).not.toContain(SESSION_COOKIE)
    expect(setItem).not.toHaveBeenCalled()
  })

  it('B-2 the id differs on the next load', async () => {
    mount()
    await flush()
    const first = sent[0].sessionId
    sent = []
    mount()
    await flush()
    expect(sent[0].sessionId).not.toBe(first)
  })

  it('B-3 after measurement is agreed the cookie keeps the same id', async () => {
    mount()
    await flush()
    const id = sent[0].sessionId
    document.cookie = `${CONSENT_COOKIE}=v1-m1-a0-1760000000; Path=/`
    window.dispatchEvent(
      new CustomEvent('kompas:consent', {
        detail: { measurement: true, advertising: false },
      }),
    )
    expect(document.cookie).toContain(`${SESSION_COOKIE}=${id}`)
    sent = []
    mount()
    await flush()
    expect(sent[0].sessionId).toBe(id)
    expect(sent[0].measurement).toBe(true)
  })

  it('B-3 withdrawing consent removes the cookie', async () => {
    document.cookie = `${CONSENT_COOKIE}=v1-m1-a0-1760000000; Path=/`
    mount()
    await flush()
    expect(document.cookie).toContain(SESSION_COOKIE)
    document.cookie = `${CONSENT_COOKIE}=v1-m0-a0-1760000001; Path=/`
    window.dispatchEvent(
      new CustomEvent('kompas:consent', {
        detail: { measurement: false, advertising: false },
      }),
    )
    expect(document.cookie).not.toContain(SESSION_COOKIE)
  })

  it('B-4 a refusal still sends events, without a session cookie', async () => {
    document.cookie = `${CONSENT_COOKIE}=v1-m0-a0-1760000000; Path=/`
    mount()
    await flush()
    expect(names()).toEqual(['page_view'])
    expect(sent[0].measurement).toBe(false)
    expect(document.cookie).not.toContain(SESSION_COOKIE)
  })

  it('B-5 calc_start fires once however often the slider moves', async () => {
    mount()
    const slider = document.querySelector('input[type="range"]')!
    for (let i = 0; i < 3; i += 1)
      slider.dispatchEvent(new Event('input', { bubbles: true }))
    await userEvent.click(document.querySelector('button')!)
    await flush()
    expect(names().filter((n) => n === 'calc_start')).toHaveLength(1)
  })

  it('B-5 calc_result needs calc_start and one second in view, and fires once with the setup', async () => {
    mount()
    inView('[data-track="result"]', true)
    await vi.advanceTimersByTimeAsync(2000)
    expect(names()).not.toContain('calc_result')
    document
      .querySelector('input[type="range"]')!
      .dispatchEvent(new Event('input', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(900)
    expect(names()).not.toContain('calc_result')
    await vi.advanceTimersByTimeAsync(200)
    expect(names()).toContain('calc_result')
    expect(sent.find((e) => e.name === 'calc_result')).toMatchObject({
      monthly: 5000,
      years: 10,
    })
    inView('[data-track="result"]', false)
    inView('[data-track="result"]', true)
    await vi.advanceTimersByTimeAsync(2000)
    expect(names().filter((n) => n === 'calc_result')).toHaveLength(1)
  })

  it('B-5 leaving the view before one second cancels calc_result', async () => {
    mount()
    document
      .querySelector('input[type="range"]')!
      .dispatchEvent(new Event('input', { bubbles: true }))
    inView('[data-track="result"]', true)
    await vi.advanceTimersByTimeAsync(500)
    inView('[data-track="result"]', false)
    await vi.advanceTimersByTimeAsync(2000)
    expect(names()).not.toContain('calc_result')
  })

  it('B-6 gate_view and form_focus fire once each', async () => {
    mount()
    inView('#formular', true)
    inView('#formular', true)
    const email = document.querySelector<HTMLInputElement>(
      'input[name="email"]',
    )!
    email.focus()
    email.blur()
    email.focus()
    await flush()
    expect(names().filter((n) => n === 'gate_view')).toHaveLength(1)
    expect(names().filter((n) => n === 'form_focus')).toHaveLength(1)
  })

  it('B-7 ?debug=1 prints each event and sends the same', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    mount('/?debug=1')
    await flush()
    expect(log).toHaveBeenCalledWith(
      '[track]',
      expect.objectContaining({ name: 'page_view' }),
    )
    expect(sent).toHaveLength(1)
  })

  it('B-8 a failed request does not throw and is not retried in a loop', async () => {
    const fetchSpy = vi.fn(() => Promise.reject(new Error('offline')))
    vi.stubGlobal('fetch', fetchSpy)
    navigator.sendBeacon = vi.fn(() => false)
    expect(() => mount()).not.toThrow()
    await flush()
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('B-9 the events leave in the order of the funnel', async () => {
    mount()
    document
      .querySelector('input[type="range"]')!
      .dispatchEvent(new Event('input', { bubbles: true }))
    inView('[data-track="result"]', true)
    await vi.advanceTimersByTimeAsync(1100)
    inView('#formular', true)
    document.querySelector<HTMLInputElement>('input[name="email"]')!.focus()
    await flush()
    expect(names()).toEqual([
      'page_view',
      'calc_start',
      'calc_result',
      'gate_view',
      'form_focus',
    ])
  })

  it('puts the session id on the lead form at submit only when measurement is agreed', async () => {
    mount()
    const form = document.querySelector<HTMLFormElement>('#lead-form')!
    form.addEventListener('submit', (event) => event.preventDefault())
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect((form.elements.namedItem('sid') as HTMLInputElement).value).toBe('')
    document.cookie = `${CONSENT_COOKIE}=v1-m1-a0-1760000000; Path=/`
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect((form.elements.namedItem('sid') as HTMLInputElement).value).toMatch(
      /^[0-9a-f-]{36}$/,
    )
  })
})

// PR 3: GA4 and the Meta Pixel, cases T-1 to T-12 of docs/PHASE-5-PLAN.md. The two
// ids are set in the environment the page is "built" with; no vendor script is ever
// downloaded here, the tests only look at what the page adds and queues.
const GA = 'G-TEST123456'
const PIXEL = '1234567890'
type W = Window & {
  dataLayer?: IArguments[]
  fbq?: { queue: unknown[][] } & ((...args: unknown[]) => void)
}
const win = () => window as unknown as W
const layer = () =>
  (win().dataLayer ?? []).map((entry) => Array.from(entry) as unknown[])
const metaCalls = () => win().fbq?.queue ?? []
const vendorScripts = () =>
  Array.from(document.head.querySelectorAll('script')).map((tag) => tag.src)

const consent = (measurement: boolean, advertising: boolean) => {
  document.cookie = `${CONSENT_COOKIE}=v1-m${measurement ? 1 : 0}-a${advertising ? 1 : 0}-1760000000; Path=/`
  window.dispatchEvent(
    new CustomEvent('kompas:consent', { detail: { measurement, advertising } }),
  )
}

describe('Tracker with GA4 and the Pixel', () => {
  beforeEach(() => {
    vi.stubEnv('GA4_MEASUREMENT_ID', GA)
    vi.stubEnv('META_PIXEL_ID', PIXEL)
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    delete win().dataLayer
    delete win().fbq
    document.head.innerHTML = ''
  })

  it('T-1 with no ids nothing third-party is added, even after full consent', async () => {
    vi.stubEnv('GA4_MEASUREMENT_ID', '')
    vi.stubEnv('META_PIXEL_ID', '')
    mount()
    consent(true, true)
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toEqual([])
    expect(win().dataLayer).toBeUndefined()
    expect(win().fbq).toBeUndefined()
  })

  it('T-2 before a choice and after a refusal nothing is added and nothing exists', async () => {
    mount()
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toEqual([])
    expect(win().dataLayer).toBeUndefined()
    consent(false, false)
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toEqual([])
    expect(win().dataLayer).toBeUndefined()
    expect(win().fbq).toBeUndefined()
  })

  it('T-3 measurement only loads GA4 with Consent Mode in order, and not the Pixel', async () => {
    mount()
    consent(true, false)
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toEqual([
      `https://www.googletagmanager.com/gtag/js?id=${GA}`,
    ])
    const calls = layer()
    expect(calls[0]).toEqual([
      'consent',
      'default',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ])
    expect(calls[1]).toEqual([
      'consent',
      'update',
      {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ])
    expect(calls[2][0]).toBe('js')
    expect(calls[3]).toEqual(['config', GA, { send_page_view: false }])
    expect(calls[4].slice(0, 2)).toEqual(['event', 'page_view'])
    expect(win().fbq).toBeUndefined()
  })

  it('T-4 advertising only loads the Pixel with PageView, and not GA4', async () => {
    mount()
    consent(false, true)
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toEqual([
      'https://connect.facebook.net/en_US/fbevents.js',
    ])
    expect(metaCalls()).toEqual([
      ['init', PIXEL],
      ['track', 'PageView'],
    ])
    expect(win().dataLayer).toBeUndefined()
  })

  it('T-5 both loaded, and the update grants all four GA4 signals', async () => {
    mount()
    consent(true, true)
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toHaveLength(2)
    expect(layer()[1][2]).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  })

  it('T-6 each event reaches GA4 under its name, and the Pixel gets PageView and ViewContent only', async () => {
    mount()
    consent(true, true)
    document
      .querySelector('input[type="range"]')!
      .dispatchEvent(new Event('input', { bubbles: true }))
    inView('[data-track="result"]', true)
    await vi.advanceTimersByTimeAsync(1100)
    inView('#formular', true)
    document.querySelector<HTMLInputElement>('input[name="email"]')!.focus()
    await flush()
    const events = layer().filter((call) => call[0] === 'event')
    expect(events.map((call) => call[1])).toEqual([
      'page_view',
      'calc_start',
      'calc_result',
      'gate_view',
      'form_focus',
    ])
    expect(events[2][2]).toMatchObject({
      monthly: 5000,
      years: 10,
      variant: 'b',
      device: 'phone',
      in_app_browser: false,
    })
    expect(metaCalls()).toEqual([
      ['init', PIXEL],
      ['track', 'PageView'],
      ['track', 'ViewContent'],
    ])
  })

  it('T-7 a stored choice at load loads the vendors on idle and sends page_view once', async () => {
    document.cookie = `${CONSENT_COOKIE}=v1-m1-a1-1760000000; Path=/`
    mount()
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toHaveLength(2)
    expect(layer().filter((c) => c[0] === 'event')).toHaveLength(1)
    expect(metaCalls().filter((c) => c[1] === 'PageView')).toHaveLength(1)
  })

  it('T-8 withdrawing switches each vendor off and later events do not reach it', async () => {
    mount()
    consent(true, true)
    await vi.advanceTimersByTimeAsync(5000)
    consent(false, false)
    expect(
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA}`],
    ).toBe(true)
    const update = layer().at(-1)!
    expect(update.slice(0, 2)).toEqual(['consent', 'update'])
    expect(update[2]).toMatchObject({
      analytics_storage: 'denied',
      ad_storage: 'denied',
    })
    expect(metaCalls().at(-1)).toEqual(['consent', 'revoke'])
    const before = layer().length
    document
      .querySelector('input[type="range"]')!
      .dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    expect(layer()).toHaveLength(before)
  })

  it('T-9 a malformed id is ignored', async () => {
    vi.stubEnv('GA4_MEASUREMENT_ID', 'G-<script>')
    vi.stubEnv('META_PIXEL_ID', 'abc')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount()
    consent(true, true)
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toEqual([])
    expect(JSON.stringify(warn.mock.calls)).not.toContain('<script>')
  })

  it('T-10 loading is on idle, not at the moment of the choice', async () => {
    mount()
    consent(true, true)
    expect(vendorScripts()).toEqual([])
    await vi.advanceTimersByTimeAsync(5000)
    expect(vendorScripts()).toHaveLength(2)
  })

  it('T-11 events before consent are not replayed, only page_view', async () => {
    mount()
    document
      .querySelector('input[type="range"]')!
      .dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    consent(true, false)
    expect(
      layer()
        .filter((call) => call[0] === 'event')
        .map((call) => call[1]),
    ).toEqual(['page_view'])
  })

  it('T-12 the first-party events do not depend on the vendors', async () => {
    mount()
    consent(true, true)
    document
      .querySelector('input[type="range"]')!
      .dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    expect(names()).toEqual(['page_view', 'calc_start'])
  })
})

// PR 4: the lead, cases B-L1 to B-L5 of docs/PHASE-5-PLAN.md.
describe('Tracker: the lead', () => {
  const ID = '3b1f1c0e-6a52-4c1c-9d5e-0f7a1b2c3d4e'
  beforeEach(() => {
    vi.stubEnv('GA4_MEASUREMENT_ID', GA)
    vi.stubEnv('META_PIXEL_ID', PIXEL)
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    delete win().dataLayer
    delete win().fbq
    document.head.innerHTML = ''
  })

  // What the form's success state does: it puts the id on #formular.
  const showLead = async (id: string | null = ID) => {
    const gate = document.querySelector('#formular')!
    if (id) gate.setAttribute('data-lead-event-id', id)
    await flush()
  }
  const leads = () => layer().filter((call) => call[1] === 'generate_lead')
  const pixelLeads = () => metaCalls().filter((call) => call[1] === 'Lead')

  it('B-L1 sends generate_lead and Lead with the id, once each', async () => {
    mount()
    consent(true, true)
    await showLead()
    await showLead()
    document.querySelector('#formular')!.setAttribute('data-lead-event-id', ID)
    await flush()
    expect(leads()).toHaveLength(1)
    expect(leads()[0][2]).toMatchObject({ event_id: ID, variant: 'b' })
    expect(pixelLeads()).toEqual([['track', 'Lead', {}, { eventID: ID }]])
  })

  it('B-L2 only the vendors that are on get it', async () => {
    mount()
    await showLead()
    expect(win().dataLayer).toBeUndefined()
    expect(win().fbq).toBeUndefined()
  })

  it('B-L2 measurement only: GA4 and not the Pixel', async () => {
    mount()
    consent(true, false)
    await showLead()
    expect(leads()).toHaveLength(1)
    expect(win().fbq).toBeUndefined()
  })

  it('B-L2 advertising only: the Pixel and not GA4', async () => {
    mount()
    consent(false, true)
    await showLead()
    expect(pixelLeads()).toHaveLength(1)
    expect(win().dataLayer).toBeUndefined()
  })

  it('B-L3 no vendor event when the markup has no id', async () => {
    mount()
    consent(true, true)
    await showLead(null)
    expect(leads()).toHaveLength(0)
    expect(pixelLeads()).toHaveLength(0)
  })

  it('B-L3 and none after consent is withdrawn', async () => {
    mount()
    consent(true, true)
    await vi.advanceTimersByTimeAsync(1000)
    consent(false, false)
    await showLead()
    expect(leads()).toHaveLength(0)
    expect(pixelLeads()).toHaveLength(0)
  })

  it('B-L4 the browser never sends lead to the first-party endpoint', async () => {
    mount()
    consent(true, true)
    await showLead()
    await vi.advanceTimersByTimeAsync(1000)
    expect(names()).not.toContain('lead')
  })

  it('B-L5 ads is 1 and fbp is passed only when advertising is agreed', async () => {
    mount()
    const form = document.querySelector<HTMLFormElement>('#lead-form')!
    form.addEventListener('submit', (event) => event.preventDefault())
    const field = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement).value
    document.cookie = '_fbp=fb.1.1.2; Path=/'
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect(field('ads')).toBe('')
    expect(field('fbp')).toBe('')
    document.cookie = `${CONSENT_COOKIE}=v1-m1-a0-1760000000; Path=/`
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect(field('ads')).toBe('')
    document.cookie = `${CONSENT_COOKIE}=v1-m1-a1-1760000000; Path=/`
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect(field('ads')).toBe('1')
    expect(field('fbp')).toBe('fb.1.1.2')
    expect(field('sid')).toMatch(/^[0-9a-f-]{36}$/)
    document.cookie = '_fbp=; Max-Age=0; Path=/'
  })
})
