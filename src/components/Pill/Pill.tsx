import type { ReactNode } from 'react'
import styles from './Pill.module.scss'

type PillProps = {
  // negative = verified as not buyable ("Ne"), positive = buyable ("Ano"),
  // unverified = not checked yet, amber ("[ověřit]", note 0029)
  // neutral = a plain fact that is neither good nor bad ("Acc", "Dist")
  tone: 'negative' | 'positive' | 'unverified' | 'neutral'
  children: ReactNode
}

// Status label in tables. Meaning is always in the text, colour only reinforces it.
export function Pill({ tone, children }: PillProps) {
  return <span className={`${styles.pill} ${styles[tone]}`}>{children}</span>
}
