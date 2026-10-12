import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NumberDisplay } from './NumberDisplay'

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => ({
      matches: reduce,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('NumberDisplay', () => {
  it('shows whole crowns with non-breaking spaces', () => {
    mockReducedMotion(false)
    render(<NumberDisplay value={12480} />)
    expect(screen.getByRole('status').textContent).toBe('12 480 Kč')
  })

  it('announces the value once, from the status text', () => {
    mockReducedMotion(false)
    const { container } = render(<NumberDisplay value={1000} />)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
    expect(screen.getByRole('status').textContent).toBe('1\u00a0000\u00a0Kč')
  })

  // Motion scale (DESIGN-GUIDE section 5, note 0035): the number swaps, it
  // never counts up.
  it('shows the new value at once, with no counting through values in between', () => {
    mockReducedMotion(false)
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
    })
    try {
      const { container, rerender } = render(<NumberDisplay value={1000} />)
      rerender(<NumberDisplay value={5000} />)
      const visible = () =>
        container.querySelector('[aria-hidden="true"]')!.textContent
      const seen = new Set([visible()])
      for (let elapsed = 0; elapsed < 400; elapsed += 16) {
        act(() => {
          vi.advanceTimersByTime(16)
        })
        seen.add(visible())
      }
      expect([...seen]).toEqual(['5\u00a0000\u00a0Kč'])
    } finally {
      vi.useRealTimers()
    }
  })

  it('swaps with a keyed animation: a new element for each new value', () => {
    mockReducedMotion(false)
    const { container, rerender } = render(<NumberDisplay value={1000} />)
    const first = container.querySelector('[aria-hidden="true"]')
    rerender(<NumberDisplay value={5000} />)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBe(first)
  })

  it('shows the new value at once with reduced motion', () => {
    mockReducedMotion(true)
    const { container, rerender } = render(<NumberDisplay value={1000} />)
    rerender(<NumberDisplay value={5000} />)
    expect(container.querySelector('[aria-hidden="true"]')!.textContent).toBe(
      '5\u00a0000\u00a0Kč',
    )
  })
})
