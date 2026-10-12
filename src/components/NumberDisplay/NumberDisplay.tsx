import { formatKc } from '@/lib/format'
import styles from './NumberDisplay.module.scss'

type NumberDisplayProps = {
  // Whole crowns
  value: number
  size?: 'lg' | 'md'
}

// The big Kč result. A new value swaps in (a new element rises in, 250 ms) and
// never counts up (DESIGN-GUIDE section 5, note 0035); reduced motion shows it
// at once. Screen readers only get the final value.
export function NumberDisplay({ value, size = 'lg' }: NumberDisplayProps) {
  return (
    <span className={`${styles.number} ${styles[size]}`}>
      <span key={value} aria-hidden="true" className={styles.swap}>
        {formatKc(value)}
      </span>
      <span className={styles.srOnly} role="status">
        {formatKc(value)}
      </span>
    </span>
  )
}
