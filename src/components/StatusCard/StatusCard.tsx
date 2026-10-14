import type { ReactNode } from 'react'
import { Container } from '@/components/Container'
import { Tag } from '@/components/Tag'
import { nbsp } from '@/lib/typography'
import styles from './StatusCard.module.scss'

type StatusCardProps = {
  label: string
  title: string
  text: string
  // buttons and forms under the text
  children?: ReactNode
}

// A short page with one message and one way on (wireframe B: "Odběr tipů potvrzen",
// "Odhlášeno", "Tento odkaz už nefunguje"). A server component: no JavaScript needed.
export function StatusCard({ label, title, text, children }: StatusCardProps) {
  return (
    <Container>
      <div className={styles.card}>
        <Tag as="p">{label}</Tag>
        <h1 className={styles.title}>{nbsp(title)}</h1>
        <p className={styles.text}>{nbsp(text)}</p>
        {children ? <div className={styles.actions}>{children}</div> : null}
      </div>
    </Container>
  )
}
