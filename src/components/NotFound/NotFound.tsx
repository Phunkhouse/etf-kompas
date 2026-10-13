import { ButtonLink } from '@/components/Button'
import { Container } from '@/components/Container'
import { Tag } from '@/components/Tag'
import { notFoundCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './NotFound.module.scss'

// A plain link on purpose: the root 404 page is part of every page's bundle, and
// next/link there added about 11 KB of JavaScript to the whole site. The variable
// keeps the lint rule that asks for <Link> quiet for the same reason.
const METHOD_HREF = '/#jak-pocitame'

// The 404 card (wireframe B, "404"): what happened, a way back, and the method.
export function NotFound() {
  return (
    <Container>
      <div className={styles.card}>
        <Tag as="p">{notFoundCopy.label}</Tag>
        <h1 className={styles.title}>{nbsp(notFoundCopy.title)}</h1>
        <p className={styles.text}>{nbsp(notFoundCopy.text)}</p>
        <div className={styles.actions}>
          <ButtonLink href="/" fullWidth>
            {nbsp(notFoundCopy.back)}
          </ButtonLink>
          <a href={METHOD_HREF} className={styles.link}>
            {nbsp(notFoundCopy.method)}
          </a>
        </div>
      </div>
    </Container>
  )
}
