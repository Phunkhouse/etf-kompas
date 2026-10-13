import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MobileMenu } from './MobileMenu'

// jsdom has <dialog> but not showModal() and close(); these stand in for the
// browser's: showModal() opens it, close() closes it and fires "close".
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '')
})
const close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
})

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = showModal
  HTMLDialogElement.prototype.close = close
})
afterEach(() => {
  showModal.mockClear()
  close.mockClear()
})

const openMenu = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
  return screen.getByRole('dialog')
}

describe('MobileMenu: the button', () => {
  it('is a button labelled "Menu" that says the menu is closed', () => {
    render(<MobileMenu />)
    const button = screen.getByRole('button', { name: 'Menu' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-haspopup')).toBe('dialog')
  })

  it('keeps the panel out of the page until it is opened', () => {
    render(<MobileMenu />)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('link', { name: 'Jak počítáme' })).toBeNull()
  })

  it("opens the panel with the browser's modal dialog, and says it is expanded", async () => {
    render(<MobileMenu />)
    await openMenu()
    expect(showModal).toHaveBeenCalledTimes(1)
    expect(
      screen
        .getByRole('button', { name: 'Menu' })
        .getAttribute('aria-expanded'),
    ).toBe('true')
  })
})

describe('MobileMenu: the panel', () => {
  it('is a dialog named "Menu"', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    expect(dialog.getAttribute('aria-label')).toBe('Menu')
  })

  it('has the three page sections as large links, in this order', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    const nav = within(dialog).getByRole('navigation', { name: 'Stránky' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      'Jak počítáme',
      'Odkud máme čísla',
      'Časté dotazy',
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '#jak-pocitame',
      '#odkud-mame-cisla',
      '#caste-dotazy',
    ])
  })

  it('has the three small links: policy, cookies, contact', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    const nav = within(dialog).getByRole('navigation', { name: 'Právní' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      'Zásady zpracování',
      'Cookies',
      'Kontakt',
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/zasady',
      '/zasady#cookies',
      '/zasady#kdo-zpracovava',
    ])
  })

  it('has the main button "Poslat mi srovnání", which goes to the form', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    expect(
      within(dialog)
        .getByRole('link', { name: 'Poslat mi srovnání' })
        .getAttribute('href'),
    ).toBe('#formular')
  })

  it('has the wordmark and a "Zavřít" button at the top', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    expect(within(dialog).getByRole('img', { name: 'ETF Kompas' })).toBeTruthy()
    expect(within(dialog).getByRole('button', { name: 'Zavřít' })).toBeTruthy()
  })
})

describe('MobileMenu: on another page (base "/")', () => {
  it('points the page links and the main button at the landing page, and leaves the legal links as they are', async () => {
    render(<MobileMenu base="/" />)
    const dialog = await openMenu()
    const pages = within(
      within(dialog).getByRole('navigation', { name: 'Stránky' }),
    ).getAllByRole('link')
    expect(pages.map((l) => l.getAttribute('href'))).toEqual([
      '/#jak-pocitame',
      '/#odkud-mame-cisla',
      '/#caste-dotazy',
    ])
    expect(
      within(dialog)
        .getByRole('link', { name: 'Poslat mi srovnání' })
        .getAttribute('href'),
    ).toBe('/#formular')
    const legal = within(
      within(dialog).getByRole('navigation', { name: 'Právní' }),
    ).getAllByRole('link')
    expect(legal.map((l) => l.getAttribute('href'))).toEqual([
      '/zasady',
      '/zasady#cookies',
      '/zasady#kdo-zpracovava',
    ])
  })
})

describe('MobileMenu: closing', () => {
  it('closes with the "Zavřít" button', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Zavřít' }),
    )
    expect(close).toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(
      screen
        .getByRole('button', { name: 'Menu' })
        .getAttribute('aria-expanded'),
    ).toBe('false')
  })

  it('closes when a link is tapped, so the page behind is not left covered', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    await userEvent.click(
      within(dialog).getByRole('link', { name: 'Časté dotazy' }),
    )
    expect(close).toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('also closes for every other link and the main button', async () => {
    render(<MobileMenu />)
    for (const name of ['Cookies', 'Poslat mi srovnání']) {
      const dialog = await openMenu()
      await userEvent.click(within(dialog).getByRole('link', { name }))
      expect(screen.queryByRole('dialog')).toBeNull()
    }
  })

  it('follows the browser: Esc fires "close", and the button says collapsed', async () => {
    render(<MobileMenu />)
    const dialog = await openMenu()
    dialog.removeAttribute('open')
    dialog.dispatchEvent(new Event('close'))
    // let React see the event
    await Promise.resolve()
    expect(
      screen
        .getByRole('button', { name: 'Menu' })
        .getAttribute('aria-expanded'),
    ).toBe('false')
  })
})
