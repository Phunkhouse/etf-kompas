import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { CONSENT_COOKIE, parseConsent } from '@/lib/consent'
import { CookieConsent } from './CookieConsent'

// jsdom has no modal dialogs; it only needs to track `open`.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})

function clearConsent() {
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/`
  document.documentElement.removeAttribute('data-consent')
}

// Renders the component and runs the inline script it ships, as a browser would.
function mount() {
  const view = render(<CookieConsent />)
  const script = view.container.querySelector('script')
  expect(script).not.toBeNull()
  // The real page runs the script once; a test mounts it many times, so the
  // document listeners it adds are collected and removed after each test.
  const add = document.addEventListener.bind(document)
  vi.spyOn(document, 'addEventListener').mockImplementation(
    (type: string, handler: EventListenerOrEventListenerObject) => {
      added.push([type, handler])
      add(type, handler)
    },
  )
  new Function(script!.textContent ?? '')()
  return view
}

const added: [string, EventListenerOrEventListenerObject][] = []
let events: { measurement: boolean; advertising: boolean }[] = []
const listener = (event: Event) => events.push((event as CustomEvent).detail)

beforeEach(() => {
  clearConsent()
  events = []
  window.addEventListener('kompas:consent', listener)
})

afterEach(() => {
  vi.restoreAllMocks()
  for (const [type, handler] of added.splice(0)) {
    document.removeEventListener(type, handler)
  }
  window.removeEventListener('kompas:consent', listener)
  clearConsent()
})

describe('CookieConsent', () => {
  it('offers accept and reject equally, plus the settings', () => {
    mount()
    expect(screen.getByRole('button', { name: 'Přijmout vše' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Odmítnout vše' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Nastavit' })).toBeTruthy()
  })

  it('does not set a cookie or the attribute before a choice', () => {
    mount()
    expect(parseConsent(document.cookie)).toBeNull()
    expect(document.documentElement.hasAttribute('data-consent')).toBe(false)
  })

  it('accept all stores measurement and advertising and announces it', async () => {
    mount()
    await userEvent.click(screen.getByRole('button', { name: 'Přijmout vše' }))
    expect(parseConsent(document.cookie)).toMatchObject({
      measurement: true,
      advertising: true,
    })
    expect(document.documentElement.getAttribute('data-consent')).toBe('set')
    expect(events).toEqual([{ measurement: true, advertising: true }])
  })

  it('reject all stores both off', async () => {
    mount()
    await userEvent.click(screen.getByRole('button', { name: 'Odmítnout vše' }))
    expect(parseConsent(document.cookie)).toMatchObject({
      measurement: false,
      advertising: false,
    })
    expect(events).toEqual([{ measurement: false, advertising: false }])
  })

  it('has both optional switches off until the visitor agrees', async () => {
    mount()
    await userEvent.click(screen.getByRole('button', { name: 'Nastavit' }))
    const necessary = screen.getByRole('switch', { name: 'Nezbytné' })
    expect((necessary as HTMLInputElement).checked).toBe(true)
    expect((necessary as HTMLInputElement).disabled).toBe(true)
    for (const name of ['Měření návštěvnosti', 'Reklama a remarketing']) {
      expect(
        (screen.getByRole('switch', { name }) as HTMLInputElement).checked,
      ).toBe(false)
    }
  })

  it('saves a granular choice from the settings', async () => {
    mount()
    await userEvent.click(screen.getByRole('button', { name: 'Nastavit' }))
    await userEvent.click(
      screen.getByRole('switch', { name: 'Měření návštěvnosti' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Uložit výběr' }))
    expect(parseConsent(document.cookie)).toMatchObject({
      measurement: true,
      advertising: false,
    })
    expect(events).toEqual([{ measurement: true, advertising: false }])
  })

  it('hides the bar before paint when a choice is already stored', () => {
    document.cookie = `${CONSENT_COOKIE}=v1-m0-a0-1760000000; Path=/`
    mount()
    expect(document.documentElement.getAttribute('data-consent')).toBe('set')
  })

  it('reopens the settings with the stored choice from a "Cookies" link', async () => {
    document.cookie = `${CONSENT_COOKIE}=v1-m1-a0-1760000000; Path=/`
    const { container } = mount()
    const link = document.createElement('a')
    link.href = '/zasady#cookies'
    link.setAttribute('data-consent-action', 'open')
    document.body.append(link)
    const click = vi.fn((event: Event) => event.defaultPrevented)
    link.addEventListener('click', click)
    await userEvent.click(link)
    expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(true)
    expect(
      (
        screen.getByRole('switch', {
          name: 'Měření návštěvnosti',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true)
    expect(
      (
        screen.getByRole('switch', {
          name: 'Reklama a remarketing',
        }) as HTMLInputElement
      ).checked,
    ).toBe(false)
    link.remove()
  })
})
