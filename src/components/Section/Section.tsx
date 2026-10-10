import type { ReactNode } from 'react'
import { Container } from '@/components/Container'
import styles from './Section.module.scss'

type SectionProps = {
  // dark = ink background; Button, Chip, Tag and Callout inside switch to their dark colours
  tone?: 'paper' | 'dark'
  id?: string
  // id of the heading that names this section (gives it the "region" role)
  labelledBy?: string
  children: ReactNode
}

export function Section({
  tone = 'paper',
  id,
  labelledBy,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={`${styles.section} ${styles[tone]}`}
    >
      <Container>{children}</Container>
    </section>
  )
}
