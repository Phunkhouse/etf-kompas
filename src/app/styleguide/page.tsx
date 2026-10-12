import type { Metadata } from 'next'
import { checkPairs } from '@/lib/contrast'
import { colors } from '@/styles/colors'
import { contrastPairs } from '@/styles/contrast-pairs'
import { Primitives } from './Primitives'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Styleguide · ETF Kompas',
  robots: { index: false, follow: false },
}

const DIACRITICS = 'Příliš žluťoučký kůň úpěl ďábelské ódy'

const fontSizes = [
  ['xs', '12 px'],
  ['sm', '14 px'],
  ['base', '16 px'],
  ['md', '18 px'],
  ['lg', '20 px'],
  ['xl', '24 px'],
  ['hero-phone', '30 px'],
  ['2xl', '32 px'],
  ['3xl', '40 px'],
  ['4xl', '54 px'],
] as const

const spaces = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16] as const

const radii = [
  ['sm', '4 px'],
  ['md', '6 px'],
  ['lg', '10 px'],
  ['pill', '999 px'],
] as const

const touchTargets = [
  ['min', '44 px'],
  ['', '48 px'],
  ['lg', '56 px'],
] as const

export default function StyleguidePage() {
  const results = checkPairs(contrastPairs)

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Styleguide</h1>
      <p className={styles.lead}>
        Design tokens from <code>src/app/variables.scss</code>. Source:{' '}
        <code>docs/design/DESIGN-GUIDE.md</code>.
      </p>

      <section className={styles.section} aria-labelledby="sg-colour">
        <h2 id="sg-colour">Colour</h2>
        <ul className={styles.swatches}>
          {Object.entries(colors).map(([name, hex]) => (
            <li key={name} className={styles.swatch}>
              <span
                className={styles.chip}
                style={{ background: `var(--color-${name})` }}
              />
              <span className={styles.swatchName}>{name}</span>
              <span className={styles.swatchHex}>{hex}</span>
            </li>
          ))}
        </ul>

        <h3>Contrast of used pairs</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Ratio</th>
                <th>Min</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={`${r.fg}-${r.bg}-${r.min}`}>
                  <td>
                    {r.fg} on {r.bg}
                  </td>
                  <td className={styles.num}>{r.ratio.toFixed(2)}</td>
                  <td className={styles.num}>{r.min}</td>
                  <td>{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sg-type">
        <h2 id="sg-type">Type</h2>
        <p className={styles.sample} data-testid="diacritics-sans">
          {DIACRITICS}
        </p>
        <p
          className={`${styles.sample} ${styles.mono}`}
          data-testid="diacritics-mono"
        >
          {DIACRITICS}
        </p>
        <p className={styles.sample}>ĚŠČŘŽÝÁÍÉŮÚŇŤĎ ěščřžýáíéůúňťď</p>

        <h3>Tabular figures</h3>
        <p className={styles.sampleNums} data-testid="digits-ones">
          1&nbsp;111&nbsp;111&nbsp;Kč
        </p>
        <p className={styles.sampleNums} data-testid="digits-zeros">
          0&nbsp;000&nbsp;000&nbsp;Kč
        </p>

        <h3>Sizes</h3>
        <ul className={styles.sizes}>
          {fontSizes.map(([token, px]) => (
            <li key={token} style={{ fontSize: `var(--font-size-${token})` }}>
              <span className={styles.tokenLabel}>
                {token} · {px}
              </span>
              Kolik z vašich peněz sní poplatky
            </li>
          ))}
          <li
            className={styles.display}
            style={{ fontSize: 'var(--font-size-display-sm)' }}
          >
            <span className={styles.tokenLabel}>display-sm · 60 px</span>
            3&nbsp;000&nbsp;Kč
          </li>
          <li
            className={styles.display}
            style={{ fontSize: 'var(--font-size-display)' }}
          >
            <span className={styles.tokenLabel}>display · 80 px</span>
            3&nbsp;000&nbsp;Kč
          </li>
        </ul>

        <h3>Weights and tag</h3>
        <p className={styles.weights}>
          <span style={{ fontWeight: 'var(--font-weight-regular)' }}>
            400 regular
          </span>
          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
            500 medium
          </span>
          <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            600 semibold
          </span>
          <span style={{ fontWeight: 'var(--font-weight-bold)' }}>
            700 bold
          </span>
        </p>
        <p className={styles.tag}>Cena a dostupnost</p>
      </section>

      <section className={styles.section} aria-labelledby="sg-space">
        <h2 id="sg-space">Spacing, radius, borders</h2>
        <ul className={styles.spaces}>
          {spaces.map((n) => (
            <li key={n}>
              <span className={styles.tokenLabel}>space-{n}</span>
              <span
                className={styles.bar}
                style={{ width: `var(--space-${n})` }}
              />
            </li>
          ))}
        </ul>
        <ul className={styles.boxes}>
          {radii.map(([token, px]) => (
            <li
              key={token}
              className={styles.box}
              style={{ borderRadius: `var(--radius-${token})` }}
            >
              radius-{token}
              <br />
              {px}
            </li>
          ))}
          <li
            className={styles.box}
            style={{ borderWidth: 'var(--border-width)' }}
          >
            border-width
            <br />1 px
          </li>
          <li
            className={styles.box}
            style={{ borderWidth: 'var(--border-width-strong)' }}
          >
            border-width-strong
            <br />
            1,5 px
          </li>
          <li
            className={styles.box}
            style={{ borderWidth: 'var(--border-width-heavy)' }}
          >
            border-width-heavy
            <br />2 px
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="sg-touch">
        <h2 id="sg-touch">Touch targets</h2>
        <ul className={styles.targets}>
          {touchTargets.map(([token, px]) => (
            <li
              key={px}
              style={{
                minHeight: `var(--touch-target${token ? `-${token}` : ''})`,
              }}
            >
              touch-target{token ? `-${token}` : ''} · {px}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="sg-focus">
        <h2 id="sg-focus">Focus ring</h2>
        <p>Tab through the links. The ring is 3 px with a 2 px offset.</p>
        <p>
          <a href="#sg-colour">Link on paper</a>
        </p>
        <div className={styles.dark}>
          <a href="#sg-colour">Link on dark</a>
        </div>
      </section>
      <Primitives />
    </main>
  )
}
