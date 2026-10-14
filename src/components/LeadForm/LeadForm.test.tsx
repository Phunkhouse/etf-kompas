import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { LeadFormState } from '@/server/leads'
import { LeadForm } from './LeadForm'

type Action = (
  previous: LeadFormState,
  formData: FormData,
) => Promise<LeadFormState>

const idle: Action = async () => ({ status: 'idle' })

function renderForm(
  options: { action?: Action; initialState?: LeadFormState } = {},
) {
  const { action = idle, initialState } = options
  return render(<LeadForm action={action} initialState={initialState} />)
}

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

describe('LeadForm: the form as drawn', () => {
  it('is the card at #formular, with the question as its heading', () => {
    const { container } = renderForm()
    expect(container.querySelector('#formular')).not.toBeNull()
    expect(
      screen.getByRole('heading', {
        name: 'Chcete vidět, kde který fond koupíte?',
      }),
    ).toBeTruthy()
  })

  it('has one e-mail field with its label and placeholder', () => {
    renderForm()
    const field = screen.getByRole('textbox', { name: 'Váš e-mail' })
    expect(field.getAttribute('type')).toBe('email')
    expect(field.getAttribute('name')).toBe('email')
    expect(field.getAttribute('placeholder')).toBe('jmeno@domena.cz')
    expect(field.getAttribute('autocomplete')).toBe('email')
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it("shows our own error text, not the browser's (the form is not validated by the browser)", () => {
    const { container } = renderForm()
    expect(container.querySelector('form')!.noValidate).toBe(true)
  })

  it('has the button "Poslat mi srovnání"', () => {
    renderForm()
    const button = screen.getByRole('button', { name: 'Poslat mi srovnání' })
    expect(button.getAttribute('type')).toBe('submit')
  })

  it('has the legal line with the controller placeholder, and the policy as a link', () => {
    renderForm()
    expect(
      flat(screen.getByText(/Pošleme vám srovnání\. Správce:/).textContent),
    ).toBe(
      'Pošleme vám srovnání. Správce: [SPRÁVCE]. Zásady zpracování osobních údajů.',
    )
    expect(
      screen
        .getByRole('link', { name: 'Zásady zpracování osobních údajů' })
        .getAttribute('href'),
    ).toBe('/zasady')
  })

  it('has the optional tips checkbox, unticked', () => {
    renderForm()
    const box = screen.getByRole('checkbox', {
      name: 'Chci občas dostat tip k investování (nepovinné)',
    }) as HTMLInputElement
    expect(box.checked).toBe(false)
    expect(box.required).toBe(false)
    expect(box.name).toBe('tips')
  })
})

describe('LeadForm: sending', () => {
  it('gives the action the typed address and the ticked box', async () => {
    const action = vi.fn<Action>().mockResolvedValue({ status: 'idle' })
    renderForm({ action })
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Váš e-mail' }),
      'jan@domena.cz',
    )
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    )
    expect(action).toHaveBeenCalledTimes(1)
    const data = action.mock.calls[0][1]
    expect(data.get('email')).toBe('jan@domena.cz')
    expect(data.get('tips')).toBe('on')
  })

  it('does not send the tips field when the box is not ticked', async () => {
    const action = vi.fn<Action>().mockResolvedValue({ status: 'idle' })
    renderForm({ action })
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Váš e-mail' }),
      'jan@domena.cz',
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    )
    expect(action.mock.calls[0][1].get('tips')).toBeNull()
  })

  it('shows the error the action returns', async () => {
    const action: Action = async () => ({
      status: 'invalid',
      email: 'jmeno@domena',
    })
    renderForm({ action })
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Váš e-mail' }),
      'jmeno@domena',
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    )
    expect(
      await screen.findByText('Zadejte e-mail ve tvaru jmeno@domena.cz.'),
    ).toBeTruthy()
  })
})

describe('LeadForm: wrong e-mail', () => {
  const state: LeadFormState = { status: 'invalid', email: 'jmeno@domena' }

  it('marks the field invalid, says how an address looks, and keeps what was typed', () => {
    renderForm({ initialState: state })
    const field = screen.getByRole('textbox', {
      name: 'Váš e-mail',
    }) as HTMLInputElement
    expect(field.getAttribute('aria-invalid')).toBe('true')
    expect(field.value).toBe('jmeno@domena')
    expect(
      within(screen.getByRole('alert')).getByText(
        'Zadejte e-mail ve tvaru jmeno@domena.cz.',
      ),
    ).toBeTruthy()
  })

  it('still has the button, the legal line and the unticked box', () => {
    renderForm({ initialState: state })
    expect(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    ).toBeTruthy()
    expect(screen.getByText(/Správce:/)).toBeTruthy()
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
      false,
    )
  })
})

describe('LeadForm: sending failed', () => {
  const state: LeadFormState = { status: 'error', email: 'jan@domena.cz' }

  it('says it failed, in a box, and keeps the address', () => {
    renderForm({ initialState: state })
    expect(flat(screen.getByRole('alert').textContent)).toBe(
      'Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli. Váš e-mail i nastavení kalkulačky zůstaly vyplněné.',
    )
    expect(
      (screen.getByRole('textbox', { name: 'Váš e-mail' }) as HTMLInputElement)
        .value,
    ).toBe('jan@domena.cz')
  })

  it('has "Zkusit znovu" instead of the usual button label', () => {
    renderForm({ initialState: state })
    expect(screen.getByRole('button', { name: 'Zkusit znovu' })).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Poslat mi srovnání' }),
    ).toBeNull()
  })

  it('does not mark the field invalid: the address was fine', () => {
    renderForm({ initialState: state })
    expect(
      screen
        .getByRole('textbox', { name: 'Váš e-mail' })
        .getAttribute('aria-invalid'),
    ).toBeNull()
  })
})

describe('LeadForm: a valid address', () => {
  const state: LeadFormState = {
    status: 'ok',
    resultsPath: '/srovnani/abc',
    email: { status: 'skipped', address: 'jan@domena.cz' },
  }

  it('says the address is stored', () => {
    renderForm({ initialState: state })
    expect(flat(screen.getByRole('status').textContent)).toBe(
      'Hotovo. Váš e-mail jsme uložili.',
    )
  })

  it('links to the comparison the server named', () => {
    renderForm({ initialState: state })
    expect(
      screen
        .getByRole('link', { name: 'Otevřít srovnání' })
        .getAttribute('href'),
    ).toBe('/srovnani/abc')
  })

  it('does not claim that anything was sent or is ready', () => {
    const { container } = renderForm({ initialState: state })
    expect(container.textContent).not.toMatch(/Odkaz jsme poslali|odeslali/)
  })

  it('replaces the form: no field and no send button', () => {
    renderForm({ initialState: state })
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(
      screen.queryByRole('button', { name: /Poslat mi srovnání|Zkusit znovu/ }),
    ).toBeNull()
  })
})

describe('LeadForm: what is said about the e-mail', () => {
  const ok = (status: 'sent' | 'skipped' | 'failed'): LeadFormState => ({
    status: 'ok',
    resultsPath: '/srovnani/abc',
    email: { status, address: 'jan@domena.cz' },
  })

  it('says the link was sent only when it was', () => {
    const { container } = renderForm({ initialState: ok('sent') })
    expect(flat(container.textContent)).toContain(
      'Odkaz jsme poslali i na jan@domena.cz. Pokud nic nepřijde, zkontrolujte spam.',
    )
  })

  it('says nothing about an e-mail when it was skipped (sandbox)', () => {
    const { container } = renderForm({ initialState: ok('skipped') })
    expect(container.textContent).not.toMatch(/poslali|odeslali|poslán/i)
    expect(screen.getByRole('link', { name: 'Otevřít srovnání' })).toBeTruthy()
  })

  it('says the e-mail did not go out when it failed, and still shows the links', () => {
    const { container } = renderForm({ initialState: ok('failed') })
    expect(flat(container.textContent)).toContain(
      'E-mail se nepodařilo odeslat.',
    )
    expect(container.textContent).not.toContain('Odkaz jsme poslali')
    expect(screen.getByRole('link', { name: 'Otevřít srovnání' })).toBeTruthy()
  })
})

describe('LeadForm: too many tries', () => {
  const state: LeadFormState = { status: 'limited', retryAfterSeconds: 600 }

  it('says so in a box and keeps the usual button', () => {
    renderForm({ initialState: state })
    expect(flat(screen.getByRole('alert').textContent)).toBe(
      'Příliš mnoho pokusů. Zkuste to prosím později.',
    )
    expect(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    ).toBeTruthy()
  })
})

describe('LeadForm: fields the visitor does not see', () => {
  it('has the form id the calculator points to, and the variant', () => {
    const { container } = render(<LeadForm action={idle} variant="b" />)
    expect(container.querySelector('form')!.id).toBe('lead-form')
    const variant = container.querySelector<HTMLInputElement>(
      'input[name="variant"]',
    )
    expect(variant!.type).toBe('hidden')
    expect(variant!.value).toBe('b')
  })

  it('has a honeypot that is hidden from assistive technology and not tabbable', () => {
    const { container } = renderForm()
    const trap = container.querySelector<HTMLInputElement>(
      'input[name="website"]',
    )!
    expect(trap.tabIndex).toBe(-1)
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(trap.value).toBe('')
  })

  it('sends the time spent and the campaign fields from the address bar', async () => {
    window.history.replaceState(
      null,
      '',
      '/?utm_source=instagram&utm_campaign=jaro&fbclid=AbC',
    )
    const action = vi.fn<Action>(async () => ({ status: 'idle' }))
    renderForm({ action })
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Váš e-mail' }),
      'jan@domena.cz',
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    )
    const data = action.mock.calls[0][1]
    expect(data.get('utm_source')).toBe('instagram')
    expect(data.get('utm_campaign')).toBe('jaro')
    expect(data.get('fbclid')).toBe('AbC')
    expect(data.get('utm_medium')).toBe('')
    expect(Number(data.get('t'))).toBeGreaterThanOrEqual(0)
    expect(data.get('website')).toBe('')
    window.history.replaceState(null, '', '/')
  })
})
