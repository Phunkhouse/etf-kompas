import { Container } from '@/components/Container'
import { shellCopy } from '@/content/copy'
import { controllerLabel } from '@/config/site'
import { nbsp } from '@/lib/typography'
import styles from './SiteFooter.module.scss'

// Risk line, controller, the two policy names and the test-project notice.
// "Zásady zpracování" and "Cookies" are plain text until those pages exist.
export function SiteFooter() {
  const { footer } = shellCopy
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.risk}>{nbsp(footer.risk)}</p>
          <p className={styles.small}>
            {nbsp(footer.controller(controllerLabel()))}
          </p>
          <ul className={styles.list}>
            <li>{nbsp(footer.privacy)}</li>
            <li>{nbsp(footer.cookies)}</li>
          </ul>
          <p className={styles.small}>{nbsp(footer.testNotice)}</p>
        </div>
      </Container>
    </footer>
  )
}
