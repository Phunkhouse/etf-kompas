import type { ReactNode } from 'react'
import styles from './Callout.module.scss'

type CalloutProps = {
  // info: short explanation next to the content (left rule). risk: risk and "not advice" notices (box).
  variant?: 'info' | 'risk'
  children: ReactNode
}

export function Callout({ variant = 'info', children }: CalloutProps) {
  return (
    <div role="note" className={`${styles.callout} ${styles[variant]}`}>
      {children}
    </div>
  )
}
