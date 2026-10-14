import { Wordmark } from '@/components/Wordmark'
import { Container } from '@/components/Container'
import { shellCopy } from '@/content/copy'
import { controllerLabel } from '@/config/site'
import { nbsp } from '@/lib/typography'
import styles from './SiteFooter.module.scss'

// Risk line, controller, four links and the test-project notice. The links go to
// the method on the landing page, the privacy policy, its cookies section (the
// script turns this click into opening the cookie settings), and the controller
// section of the policy (Kontakt).
export function SiteFooter() {
  const { footer } = shellCopy
  const links = [
    { label: footer.method, href: '/#jak-pocitame' },
    { label: footer.privacy, href: '/zasady' },
    { label: footer.cookies, href: '/zasady#cookies', opensCookies: true },
    { label: footer.contact, href: '/zasady#kdo-zpracovava' },
  ]
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <Wordmark tone="dark" />
          <p className={styles.risk}>{nbsp(footer.risk)}</p>
          <p className={styles.small}>
            {nbsp(footer.controller(controllerLabel()))}
          </p>
          <nav aria-label={footer.navLabel}>
            <ul className={styles.list}>
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-consent-action={link.opensCookies ? 'open' : undefined}
                  >
                    {nbsp(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={styles.small}>{nbsp(footer.testNotice)}</p>
        </div>
      </Container>
    </footer>
  )
}
