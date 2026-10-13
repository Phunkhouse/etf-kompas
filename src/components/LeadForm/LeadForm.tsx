'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Field } from '@/components/Field'
import { leadFormCopy } from '@/content/copy'
import { site } from '@/config/site'
import { nbsp } from '@/lib/typography'
import type { LeadFormState } from '@/server/leads'
import styles from './LeadForm.module.scss'

type LeadFormProps = {
  action: (
    previous: LeadFormState,
    formData: FormData,
  ) => Promise<LeadFormState>
  initialState?: LeadFormState
}

const text = leadFormCopy

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
// the state. Before Phase 4 nothing is stored or sent, and a valid address says so.
export function LeadForm({ action, initialState }: LeadFormProps) {
  const start: LeadFormState = initialState ?? { status: 'idle' }
  const [state, formAction] = useActionState(action, start)

  if (state.status === 'ok') {
    return (
      <div id="formular" className={styles.card}>
        <p className={styles.notice}>{nbsp(text.notice)}</p>
      </div>
    )
  }

  const email = state.status === 'idle' ? '' : state.email

  return (
    <div id="formular" className={styles.card}>
      <h2 className={styles.heading}>{nbsp(text.heading)}</h2>
      <form action={formAction} noValidate className={styles.form}>
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
        <p className={styles.legal}>{nbsp(text.legal(site.controller.name))}</p>
        <label className={styles.tips}>
          <input type="checkbox" name="tips" className={styles.checkbox} />
          <span>{nbsp(text.tips)}</span>
        </label>
      </form>
    </div>
  )
}
