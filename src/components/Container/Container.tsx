import type { ReactNode } from 'react'
import styles from './Container.module.scss'

// Centres content, limits its width and adds the page gutters.
export function Container({ children }: { children: ReactNode }) {
  return <div className={styles.container}>{children}</div>
}
