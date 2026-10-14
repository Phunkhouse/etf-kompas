'use client'

import { useActionState } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { leadFormCopy, resultsGoneCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './ResendForm.module.scss'

type State =
  { status: 'idle' } | { status: 'invalid'; email: string } | { status: 'done' }

type ResendFormProps = {
  action: (previous: State, formData: FormData) => Promise<State>
}

const text = resultsGoneCopy.resend

// The form on a link that does not work: an address in, the same answer out, whether we
// know the address or not (SPEC §26). Works without JavaScript: a native POST.
export function ResendForm({ action }: ResendFormProps) {
  const [state, formAction, pending] = useActionState(action, {
    status: 'idle',
  } as State)

  if (state.status === 'done') {
    return (
      <p role="status" className={styles.answer}>
        {nbsp(text.answer)}
      </p>
    )
  }
  return (
    <form action={formAction} noValidate className={styles.form}>
      <Field
        label={text.label}
        type="email"
        name="email"
        autoComplete="email"
        defaultValue={state.status === 'invalid' ? state.email : ''}
        error={
          state.status === 'invalid' ? nbsp(leadFormCopy.invalid) : undefined
        }
      />
      <Button type="submit" fullWidth loading={pending}>
        {pending ? text.sending : text.button}
      </Button>
    </form>
  )
}
