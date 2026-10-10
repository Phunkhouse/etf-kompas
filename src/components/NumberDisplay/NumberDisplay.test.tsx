import { act, render, screen, waitFor } from '@testing-library/react'
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

  it('announces only the final value, not the count-up frames', () => {
    mockReducedMotion(false)
    const { container } = render(<NumberDisplay value={1000} />)
    const visible = container.querySelector('[aria-hidden="true"]')
    expect(visible).not.toBeNull()
    expect(screen.getByRole('status').textContent).toBe('1 000 Kč')
  })

  it('counts up to a new value within 300 ms', async () => {
    mockReducedMotion(false)
    const { container, rerender } = render(<NumberDisplay value={1000} />)
    rerender(<NumberDisplay value={5000} />)

    const visible = () =>
      container.querySelector('[aria-hidden="true"]')!.textContent
    // The status text jumps at once, the visible number follows.
    expect(screen.getByRole('status').textContent).toBe('5 000 Kč')
    const started = performance.now()
    await waitFor(() => expect(visible()).toBe('5 000 Kč'), { timeout: 600 })
    expect(performance.now() - started).toBeLessThan(500)
  })

  it('shows the new value at once with reduced motion', () => {
    mockReducedMotion(true)
    const { container, rerender } = render(<NumberDisplay value={1000} />)
    rerender(<NumberDisplay value={5000} />)
    expect(container.querySelector('[aria-hidden="true"]')!.textContent).toBe(
      '5 000 Kč',
    )
  })

  it('counts up smoothly: in range, never going backwards, done within 300 ms', () => {
    mockReducedMotion(false)
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
    })
    try {
      const { container, rerender } = render(<NumberDisplay value={1000} />)
      rerender(<NumberDisplay value={5000} />)

      const read = () =>
        Number(
          container
            .querySelector('[aria-hidden="true"]')!
            .textContent!.replace(/[^\d-]/g, ''),
        )
      const seen = [read()]
      for (let elapsed = 0; elapsed < 300; elapsed += 16) {
        act(() => {
          vi.advanceTimersByTime(16)
        })
        seen.push(read())
      }

      expect(Math.min(...seen)).toBeGreaterThanOrEqual(1000)
      expect(Math.max(...seen)).toBeLessThanOrEqual(5000)
      expect(seen).toEqual([...seen].sort((x, y) => x - y))
      expect(new Set(seen).size).toBeGreaterThan(3)
      expect(seen.at(-1)).toBe(5000)
    } finally {
      vi.useRealTimers()
    }
  })
})
