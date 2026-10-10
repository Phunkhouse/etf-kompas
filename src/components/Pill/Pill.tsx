import type { ReactNode } from 'react'
import styles from './Pill.module.scss'

type PillProps = {
  // "negative" = not buyable or still unverified, "positive" = buyable
  tone: 'negative' | 'positive'
  children: ReactNode
}

// Status label in tables. Meaning is always in the text, colour only reinforces it.
export function Pill({ tone, children }: PillProps) {
  return <span className={`${styles.pill} ${styles[tone]}`}>{children}</span>
}
