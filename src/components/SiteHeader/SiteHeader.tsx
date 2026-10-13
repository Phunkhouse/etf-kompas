import { ButtonLink } from '@/components/Button'
import { Container } from '@/components/Container'
import { MobileMenu } from '@/components/MobileMenu'
import { Wordmark } from '@/components/Wordmark'
import { shellCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './SiteHeader.module.scss'

// Logo, and on wide screens the section links and a small call to action.
// On phones the "Menu" button opens the panel with the same links. `base` is "/"
// on pages other than the landing page, so the section links lead back to it.
export function SiteHeader({ base = '' }: { base?: string }) {
  const { nav } = shellCopy
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Wordmark href="/" priority />
          <nav aria-label={nav.label} className={styles.nav}>
            <a href={`${base}#jak-pocitame`}>{nbsp(nav.method)}</a>
            <a href={`${base}#odkud-mame-cisla`}>{nbsp(nav.sources)}</a>
            <a href={`${base}#caste-dotazy`}>{nbsp(nav.faq)}</a>
          </nav>
          <MobileMenu base={base} />
          <div className={styles.cta}>
            <ButtonLink href={`${base}#formular`} size="sm">
              {nbsp(shellCopy.cta)}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </header>
  )
}
