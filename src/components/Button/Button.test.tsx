import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, ButtonLink } from './Button'

describe('Button', () => {
  it('is a button that does not submit forms by default', () => {
    render(<Button>Poslat mi srovnání</Button>)
    expect(
      screen
        .getByRole('button', { name: 'Poslat mi srovnání' })
        .getAttribute('type'),
    ).toBe('button')
  })

  it('calls onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Spočítat</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Spočítat' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('can be activated from the keyboard', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Spočítat</Button>)
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does nothing when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Spočítat
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Spočítat' })
    await userEvent.click(button)
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is disabled and announced as busy while loading', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Počítám…
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Počítám…' })
    await userEvent.click(button)
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(button.getAttribute('aria-busy')).toBe('true')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('can submit a form when asked to', () => {
    render(<Button type="submit">Odeslat</Button>)
    expect(
      screen.getByRole('button', { name: 'Odeslat' }).getAttribute('type'),
    ).toBe('submit')
  })
})

describe('ButtonLink', () => {
  it('is a link with the given target', () => {
    render(<ButtonLink href="#calc">Spočítat, kolik ušetřím</ButtonLink>)
    expect(
      screen
        .getByRole('link', { name: 'Spočítat, kolik ušetřím' })
        .getAttribute('href'),
    ).toBe('#calc')
  })
})
