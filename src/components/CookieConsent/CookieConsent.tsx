import { Button } from '@/components/Button'
import { Tag } from '@/components/Tag'
import { legalCopy } from '@/content/copy'
import { CONSENT_COOKIE, CONSENT_MAX_AGE, CONSENT_VERSION } from '@/lib/consent'
import { consentClient } from '@/lib/consent-client'
import { nbsp } from '@/lib/typography'
import styles from './CookieConsent.module.scss'

const text = legalCopy.cookies
const SETTINGS_ID = 'cookie-settings'

// The behaviour is one inline script (about 1 KB), not a React client component,
// so the bar adds no framework JavaScript (note 0062). Everything below is plain
// server HTML; the script handles the clicks by `data-consent-action`.
const script = `(${consentClient.toString()})(${JSON.stringify(CONSENT_COOKIE)},${CONSENT_VERSION},${CONSENT_MAX_AGE},${JSON.stringify(SETTINGS_ID)})`

type CategoryProps = {
  id: string
  title: string
  text: string
  category?: 'measurement' | 'advertising'
}

function Category({ id, title, text: description, category }: CategoryProps) {
  return (
    <div className={styles.category}>
      <div className={styles.categoryText}>
        <label htmlFor={id} className={styles.categoryTitle}>
          {nbsp(title)}
        </label>
        <p id={`${id}-text`}>{nbsp(description)}</p>
        {category ? null : <Tag as="p">{text.settings.always}</Tag>}
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.switch}
        aria-describedby={`${id}-text`}
        data-consent-category={category}
        defaultChecked={category ? false : true}
        disabled={!category}
      />
    </div>
  )
}

// The cookie bar (a bottom sheet on the phone, a bar on desktop) and the settings
// dialog (wireframe B, "Cookies"). The bar shows until a choice is stored; the
// script sets `data-consent` on <html> before paint when there is one. The footer
// and menu links "Cookies" reopen the settings (`data-consent-action="open"`).
export function CookieConsent() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <section
        aria-label={text.bar.label}
        data-tone="dark"
        className={styles.bar}
      >
        <Tag as="p">{text.bar.label}</Tag>
        <p className={styles.barText}>
          {nbsp(text.bar.text)}{' '}
          <a href="/zasady" className={styles.policy}>
            {nbsp(text.bar.policy)}
          </a>
        </p>
        <div className={styles.barActions}>
          <Button variant="primary" data-consent-action="accept">
            {text.bar.accept}
          </Button>
          <Button variant="secondary" data-consent-action="reject">
            {text.bar.reject}
          </Button>
          <button
            type="button"
            className={styles.link}
            data-consent-action="open"
          >
            {text.bar.settings}
          </button>
        </div>
      </section>
      <dialog
        id={SETTINGS_ID}
        className={styles.dialog}
        aria-labelledby={`${SETTINGS_ID}-title`}
      >
        <div className={styles.dialogHead}>
          <h2 id={`${SETTINGS_ID}-title`} className={styles.dialogTitle}>
            {nbsp(text.settings.title)}
          </h2>
          <button
            type="button"
            className={styles.close}
            data-consent-action="close"
            aria-label={text.settings.close}
          >
            <span className={styles.cross} aria-hidden="true" />
          </button>
        </div>
        <p className={styles.intro}>{nbsp(text.settings.intro)}</p>
        <Category
          id="cookie-necessary"
          title={text.settings.necessary.title}
          text={text.settings.necessary.text}
        />
        <Category
          id="cookie-measurement"
          category="measurement"
          title={text.settings.measurement.title}
          text={text.settings.measurement.text}
        />
        <Category
          id="cookie-advertising"
          category="advertising"
          title={text.settings.advertising.title}
          text={text.settings.advertising.text}
        />
        <div className={styles.dialogActions}>
          <Button variant="primary" data-consent-action="save">
            {text.settings.save}
          </Button>
          <Button variant="secondary" data-consent-action="accept">
            {text.settings.acceptAll}
          </Button>
        </div>
      </dialog>
    </>
  )
}
