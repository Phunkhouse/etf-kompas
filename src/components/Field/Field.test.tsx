import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Field } from './Field'

describe('Field', () => {
  it('is a text box named by its label', () => {
    render(<Field label="Váš e-mail" type="email" />)
    const input = screen.getByRole('textbox', { name: 'Váš e-mail' })
    expect(input.getAttribute('type')).toBe('email')
  })

  it('passes input attributes through', () => {
    render(
      <Field
        label="Váš e-mail"
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        placeholder="jmeno@domena.cz"
        required
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Váš e-mail' })
    expect(input.getAttribute('inputmode')).toBe('email')
    expect(input.getAttribute('autocomplete')).toBe('email')
    expect(input.getAttribute('name')).toBe('email')
    expect((input as HTMLInputElement).required).toBe(true)
  })

  it('accepts typing', async () => {
    render(<Field label="Váš e-mail" type="email" />)
    const input = screen.getByRole('textbox', { name: 'Váš e-mail' })
    await userEvent.type(input, 'jana@seznam.cz')
    expect((input as HTMLInputElement).value).toBe('jana@seznam.cz')
  })

  it('connects the hint to the field', () => {
    render(<Field label="Váš e-mail" hint="Nepošleme vám nic jiného." />)
    expect(
      screen
        .getByRole('textbox', { name: 'Váš e-mail' })
        .getAttribute('aria-describedby'),
    ).toBe(screen.getByText('Nepošleme vám nic jiného.').id)
  })

  it('marks the field invalid and announces the error', () => {
    render(
      <Field
        label="Váš e-mail"
        hint="Nápověda"
        error="Zadejte prosím e-mail ve tvaru jmeno@domena.cz."
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Váš e-mail' })
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toBe(
      'Zadejte prosím e-mail ve tvaru jmeno@domena.cz.',
    )
    expect(input.getAttribute('aria-describedby')).toContain(alert.id)
  })

  it('is not invalid without an error', () => {
    render(<Field label="Váš e-mail" />)
    const input = screen.getByRole('textbox', { name: 'Váš e-mail' })
    expect(input.getAttribute('aria-invalid')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
