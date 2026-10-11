import { ButtonLink } from '@/components/Button'
import { Container } from '@/components/Container'
import { Wordmark } from '@/components/Wordmark'
import { copy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './SiteHeader.module.scss'

// Logo, and on wide screens the section links and a small call to action.
// The links and the button point at sections that the next page PRs add. The
// mobile "Menu" chip is left out until its contents are designed.
export function SiteHeader() {
  const { nav } = copy.shell
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Wordmark href="/" priority />
          <nav aria-label={nav.label} className={styles.nav}>
            <a href="#jak-pocitame">{nbsp(nav.method)}</a>
            <a href="#odkud-mame-cisla">{nbsp(nav.sources)}</a>
            <a href="#caste-dotazy">{nbsp(nav.faq)}</a>
          </nav>
          <div className={styles.cta}>
            <ButtonLink href="#gate" size="sm">
              {nbsp(copy.shell.cta)}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </header>
  )
}
