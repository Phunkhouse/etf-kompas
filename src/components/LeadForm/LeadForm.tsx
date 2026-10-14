'use client'

import { useActionState, type FormEvent } from 'react'
import { useFormStatus } from 'react-dom'
import { Field } from '@/components/Field'
import { leadFormCopy } from '@/content/copy'
import { site } from '@/config/site'
import { nbsp } from '@/lib/typography'
import type { LeadFormState } from '@/server/leads'
import styles from './LeadForm.module.scss'

type LeadFormProps = {
  // The A/B variant of the page, stored with the lead.
  variant?: 'a' | 'b'
  action: (
    previous: LeadFormState,
    formData: FormData,
  ) => Promise<LeadFormState>
  initialState?: LeadFormState
}

const text = leadFormCopy

const CAMPAIGN_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
]

function SubmitButton({ retry }: { retry: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className={styles.submit}
      disabled={pending}
      aria-busy={pending || undefined}
    >
      {pending ? text.sending : retry ? text.retry : text.send}
    </button>
  )
}

// The e-mail form (SPEC §3.3). A native form with a server action, so it works
// without JavaScript: the browser posts, the server answers with the page and
// the state. The amount and the horizon come from the calculator's hidden fields
// (`form="lead-form"`); JavaScript adds the time since the page loaded and the campaign fields.
export function LeadForm({
  variant = 'a',
  action,
  initialState,
}: LeadFormProps) {
  const start: LeadFormState = initialState ?? { status: 'idle' }
  const [state, formAction] = useActionState(action, start)

  // Fills the fields only JavaScript can know, just before the browser posts.
  function fillScriptFields(event: FormEvent<HTMLFormElement>) {
    const fields = event.currentTarget.elements
    const set = (name: string, value: string) => {
      const field = fields.namedItem(name)
      if (field instanceof HTMLInputElement) field.value = value
    }
    // Milliseconds since the page loaded: a person who jumps straight to the form
    // and lets the browser fill it in is still far above the limit.
    set('t', String(Math.round(performance.now())))
    const params = new URLSearchParams(window.location.search)
    for (const name of CAMPAIGN_FIELDS) set(name, params.get(name) ?? '')
  }

  if (state.status === 'ok') {
    return (
      <div id="formular" className={styles.card}>
        <p className={styles.notice} role="status">
          <strong>{text.done.strong}</strong>
          {nbsp(text.done.text)}
        </p>
        <a href={state.resultsPath} className={styles.open}>
          {nbsp(text.done.open)}
        </a>
        <a href={`${state.resultsPath}/pdf`} className={styles.pdf}>
          {nbsp(text.done.pdf)}
        </a>
      </div>
    )
  }

  const email =
    state.status === 'invalid' || state.status === 'error' ? state.email : ''

  return (
    <div id="formular" className={styles.card}>
      <h2 className={styles.heading}>{nbsp(text.heading)}</h2>
      <form
        id="lead-form"
        action={formAction}
        onSubmit={fillScriptFields}
        noValidate
        className={styles.form}
      >
        <input type="hidden" name="variant" value={variant} />
        <input type="hidden" name="t" defaultValue="" />
        {CAMPAIGN_FIELDS.map((name) => (
          <input key={name} type="hidden" name={name} defaultValue="" />
        ))}
        {/* The honeypot: people never see it, many bots fill it. */}
        <div className={styles.trap} aria-hidden="true">
          <label>
            Web
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        {state.status === 'limited' ? (
          <p role="alert" className={styles.failure}>
            <strong>{text.limited.strong}</strong>
            {nbsp(text.limited.text)}
          </p>
        ) : null}
        {state.status === 'error' ? (
          <p role="alert" className={styles.failure}>
            <strong>{text.failure.strong}</strong>
            {nbsp(text.failure.text)}
          </p>
        ) : null}
        <Field
          label={text.emailLabel}
          type="email"
          name="email"
          placeholder={text.emailPlaceholder}
          autoComplete="email"
          defaultValue={email}
          error={state.status === 'invalid' ? nbsp(text.invalid) : undefined}
        />
        <SubmitButton retry={state.status === 'error'} />
        <p className={styles.legal}>
          {nbsp(text.legalBefore(site.controller.name))}
          <a href="/zasady">{nbsp(text.legalLink)}</a>.
        </p>
        <label className={styles.tips}>
          <input type="checkbox" name="tips" className={styles.checkbox} />
          <span>{nbsp(text.tips)}</span>
        </label>
      </form>
    </div>
  )
}
