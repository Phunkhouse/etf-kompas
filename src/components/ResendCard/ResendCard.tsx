'use client'

import { useActionState } from 'react'
import { Button } from '@/components/Button'
import { Tag } from '@/components/Tag'
import { resultsCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './ResendCard.module.scss'

type State =
  { status: 'idle' } | { status: 'sent' | 'skipped' | 'failed' | 'limited' }

type ResendCardProps = {
  // bound to the token of the page: it sends to the lead's own address
  action: (previous: State, formData: FormData) => Promise<State>
}

const text = resultsCopy.resend

// "Poslat odkaz znovu" at the end of the comparison page (wireframe B). No address is
// asked for: the link of this page already says whose it is. The answer says only what
// really happened: in the sandbox it says that nothing was sent.
export function ResendCard({ action }: ResendCardProps) {
  const [state, formAction, pending] = useActionState(action, {
    status: 'idle',
  } as State)
  return (
    <div className={styles.card}>
      <Tag as="p">{text.label}</Tag>
      <p className={styles.text}>{nbsp(text.text)}</p>
      <form action={formAction}>
        <Button type="submit" variant="secondary" fullWidth loading={pending}>
          {pending ? text.sending : text.button}
        </Button>
      </form>
      {state.status !== 'idle' ? (
        <p role="status" className={styles.answer}>
          {nbsp(text[state.status])}
        </p>
      ) : null}
    </div>
  )
}
