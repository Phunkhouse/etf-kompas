import type { ReactNode } from 'react'
import styles from './Tag.module.scss'

type TagProps = {
  as?: 'span' | 'p' | 'div' | 'h2' | 'h3'
  id?: string
  children: ReactNode
}

// Small uppercase mono label ("CENA A DOSTUPNOST"), used for section labels and table headers.
export function Tag({ as: Element = 'span', id, children }: TagProps) {
  return (
    <Element id={id} className={styles.tag}>
      {children}
    </Element>
  )
}
