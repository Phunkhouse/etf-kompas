import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StickyBar } from './StickyBar'

// A stand-in for the browser's IntersectionObserver that lets a test say which
// watched element is on screen.
type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void
let callback: Callback
let observed: Element[]
const disconnect = vi.fn()

class FakeObserver {
  constructor(cb: Callback) {
    callback = cb
    observed = []
  }
  observe(element: Element) {
    observed.push(element)
  }
  unobserve() {}
  disconnect = disconnect
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', FakeObserver)
})
afterEach(() => {
  vi.unstubAllGlobals()
  disconnect.mockClear()
})

// The page the bar watches: the hero button (#hero-cta) and the form (#formular).
function page() {
  return render(
    <>
      <div id="hero-cta">
        <a href="#spocitat">Spočítat, kolik mě to bude stát</a>
      </div>
      <div id="formular" />
      <StickyBar />
    </>,
  )
}

const seen = (id: string, isIntersecting: boolean) =>
  act(() =>
    callback([{ target: document.getElementById(id)!, isIntersecting }]),
  )

const bar = () => screen.queryByRole('link', { name: 'Poslat mi srovnání' })

describe('StickyBar', () => {
  it('is not shown at first: it would cover the hero button', () => {
    page()
    expect(bar()).toBeNull()
  })

  it('watches the hero button and the form, and nothing else', () => {
    page()
    expect(observed.map((e) => e.id).sort()).toEqual(['formular', 'hero-cta'])
  })

  it('shows "Poslat mi srovnání", pointing at the form, once the hero button has scrolled out', () => {
    page()
    seen('hero-cta', false)
    expect(bar()).not.toBeNull()
    expect(bar()!.getAttribute('href')).toBe('#formular')
  })

  it('stays hidden while the hero button is on screen', () => {
    page()
    seen('hero-cta', true)
    expect(bar()).toBeNull()
  })

  it('hides again when the form comes into view: the button would point at what is already there', () => {
    page()
    seen('hero-cta', false)
    expect(bar()).not.toBeNull()
    seen('formular', true)
    expect(bar()).toBeNull()
    seen('formular', false)
    expect(bar()).not.toBeNull()
  })

  it('hides when the visitor scrolls back to the hero button', () => {
    page()
    seen('hero-cta', false)
    seen('hero-cta', true)
    expect(bar()).toBeNull()
  })

  it('stops watching when it is removed', () => {
    const { unmount } = page()
    unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('stays hidden, without an error, where IntersectionObserver does not exist', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    expect(() => page()).not.toThrow()
    expect(bar()).toBeNull()
  })

  it('stays hidden, without an error, when the page has no hero button or form', () => {
    expect(() => render(<StickyBar />)).not.toThrow()
    expect(bar()).toBeNull()
  })
})
