import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StackedBar } from './StackedBar'

const labels = {
  remainingLabel: 'po poplatcích',
  costLabel: 'zaplaceno na poplatcích',
}

function widths(container: HTMLElement) {
  const get = (segment: string) =>
    Number(
      container
        .querySelector(`[data-segment="${segment}"]`)!
        .getAttribute('width'),
    )
  return { remaining: get('remaining'), cost: get('cost') }
}

describe('StackedBar', () => {
  it('describes both amounts to screen readers', () => {
    render(<StackedBar remaining={900000} cost={100000} {...labels} />)
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe(
      'po poplatcích: 900 000 Kč. zaplaceno na poplatcích: 100 000 Kč.',
    )
  })

  it('shows the exact amounts in the legend', () => {
    const { container } = render(
      <StackedBar remaining={900000} cost={100000} {...labels} />,
    )
    const amounts = [...container.querySelectorAll('figcaption strong')].map(
      (el) => el.textContent,
    )
    expect(amounts).toEqual(['900\u00A0000\u00A0Kč', '100\u00A0000\u00A0Kč'])
  })

  it('splits the bar in proportion to the amounts', () => {
    const { container } = render(
      <StackedBar remaining={750} cost={250} {...labels} />,
    )
    expect(widths(container)).toEqual({ remaining: 75, cost: 25 })
  })

  it('keeps a tiny cost visible', () => {
    const { container } = render(
      <StackedBar remaining={1000000} cost={10} {...labels} />,
    )
    const { cost, remaining } = widths(container)
    expect(cost).toBeGreaterThan(1)
    expect(cost + remaining).toBeCloseTo(100, 5)
  })

  it('draws no cost segment when nothing was paid', () => {
    const { container } = render(
      <StackedBar remaining={1000} cost={0} {...labels} />,
    )
    expect(widths(container)).toEqual({ remaining: 100, cost: 0 })
  })

  it('does not break on zeros or negative input', () => {
    const { container } = render(
      <StackedBar remaining={0} cost={0} {...labels} />,
    )
    expect(widths(container)).toEqual({ remaining: 0, cost: 0 })
    const negative = render(<StackedBar remaining={-5} cost={-5} {...labels} />)
    expect(widths(negative.container)).toEqual({ remaining: 0, cost: 0 })
  })
})
