import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from './Chip'

describe('Chip', () => {
  it('announces whether it is selected', () => {
    render(
      <>
        <Chip>5</Chip>
        <Chip selected>10</Chip>
      </>,
    )
    expect(
      screen.getByRole('button', { name: '5' }).getAttribute('aria-pressed'),
    ).toBe('false')
    expect(
      screen.getByRole('button', { name: '10' }).getAttribute('aria-pressed'),
    ).toBe('true')
  })

  it('calls onClick with the mouse and the keyboard', async () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick}>20</Chip>)
    await userEvent.click(screen.getByRole('button', { name: '20' }))
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('can be reached with Tab in order', async () => {
    render(
      <>
        <Chip>5</Chip>
        <Chip>10</Chip>
      </>,
    )
    await userEvent.tab()
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: '5' }),
    )
    await userEvent.tab()
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: '10' }),
    )
  })
})
