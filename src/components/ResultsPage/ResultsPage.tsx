import { BrokerPicker } from '@/components/BrokerPicker'
import { resendMineAction } from '@/app/mail-actions'
import { ButtonLink } from '@/components/Button'
import { Container } from '@/components/Container'
import { NumberDisplay } from '@/components/NumberDisplay'
import { ResendCard } from '@/components/ResendCard'
import { Pill } from '@/components/Pill'
import { Table, TableLabel, type TableColumn } from '@/components/Table'
import { Tag } from '@/components/Tag'
import { resultsCopy, taxCopy } from '@/content/copy'
import { formatKc, formatPercent } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import type { Comparison } from '@/server/comparison'
import styles from './ResultsPage.module.scss'

const text = resultsCopy

// A plain link on purpose, as in the 404 page: it is a section of the landing page.
const METHOD_HREF = '/#jak-pocitame'

// The comparison behind the e-mail (wireframe B, "Comparison page"): the visitor's
// setup and number, the five funds side by side, the broker table, the taxes and
// the method. The numbers come ready from `comparison()`, the same pricing as the
// calculator; nothing is calculated here.
export function ResultsPage({
  comparison,
  pdfHref,
  token,
}: {
  comparison: Comparison
  pdfHref: string
  // the token of this page: the card sends a new link to the lead's own address
  token: string
}) {
  const { funds, byFund, setup, headlineFundId } = comparison
  const head = funds.find((fund) => fund.fundId === headlineFundId)
  const headline = byFund[headlineFundId]
  const total = headline.headlineKc ?? headline.fundFeeKc

  const columns: TableColumn[] = [
    { id: 'fund', header: text.funds.columns.fund, width: '46%' },
    { id: 'type', header: text.funds.columns.type, width: '20%' },
    { id: 'fee', header: text.funds.columns.fee, width: '34%', numeric: true },
  ]
  const rows = funds.map((fund) => ({
    id: fund.fundId,
    cells: {
      fund: <TableLabel title={fund.ticker} detail={fund.indexLabel} />,
      type:
        fund.type === null ? (
          <Pill tone="unverified">{resultsCopy.brokers.unverified}</Pill>
        ) : (
          <Pill tone="neutral">
            {fund.type === 'accumulating'
              ? text.funds.accumulating
              : text.funds.distributing}
          </Pill>
        ),
      fee:
        fund.ter === null ? (
          <Pill tone="unverified">{resultsCopy.brokers.unverified}</Pill>
        ) : (
          formatPercent(fund.ter)
        ),
    },
  }))

  return (
    <main>
      <Container>
        <div className={styles.page}>
          <nav aria-label={text.contents.label} className={styles.contents}>
            <Tag>{text.contents.label}</Tag>
            <a href="#fondy">{text.contents.funds}</a>
            <a href="#dane">{text.contents.taxes}</a>
            <a href="#jak-pocitame">{text.contents.method}</a>
          </nav>

          <div className={styles.body}>
            <header className={styles.intro}>
              <Tag as="p">{text.label}</Tag>
              <h1 className={styles.title}>{nbsp(text.title)}</h1>
              <p className={styles.lead}>{nbsp(text.lead)}</p>
              <div className={styles.actions}>
                <ButtonLink href={pdfHref} variant="secondary">
                  {nbsp(text.pdf)}
                </ButtonLink>
              </div>
            </header>

            {head && total !== null ? (
              <section
                aria-label={text.strip.label}
                data-tone="dark"
                className={styles.strip}
              >
                <p className={styles.stripLabel}>
                  {nbsp(
                    `${text.strip.label} · ${text.strip.setup(formatKc(setup.monthly), setup.years)}`,
                  )}
                </p>
                <div className={styles.stripRow}>
                  <p className={styles.stripText}>
                    {nbsp(
                      headline.headlineKc !== null
                        ? text.strip.total(setup.years, head.ticker)
                        : text.strip.fundOnly(setup.years, head.ticker),
                    )}
                  </p>
                  <div className={styles.stripNumber}>
                    <NumberDisplay value={total} size="md" />
                  </div>
                </div>
              </section>
            ) : null}

            <section
              id="fondy"
              aria-labelledby="fondy-nadpis"
              className={styles.section}
            >
              <div className={styles.sectionHead}>
                <h2 id="fondy-nadpis" className={styles.heading}>
                  {nbsp(text.funds.heading)}
                </h2>
                <span className={styles.hint}>{text.funds.label}</span>
              </div>
              <Table
                card
                caption={text.funds.caption}
                columns={columns}
                rows={rows}
              />
              <p className={styles.note}>{nbsp(text.funds.legend)}</p>
            </section>

            <section className={styles.section}>
              <BrokerPicker comparison={comparison} />
            </section>

            <section
              id="dane"
              aria-labelledby="dane-nadpis"
              className={styles.section}
            >
              <h2 id="dane-nadpis" className={styles.heading}>
                {nbsp(text.taxes.heading)}
              </h2>
              <ul className={styles.cards}>
                {text.taxes.items.map((item) => (
                  <li key={item.label} className={styles.card}>
                    <Tag as="p">{item.label}</Tag>
                    {(
                      comparison.taxes[item.id as 'sale' | 'dividends'] ?? [
                        { text: taxCopy.unverified, source: null },
                      ]
                    ).map((sentence) => (
                      <p key={sentence.text} className={styles.cardText}>
                        {nbsp(sentence.text)}
                        {sentence.source ? (
                          <>
                            {' '}
                            <a
                              className={styles.source}
                              href={sentence.source.url}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {nbsp(sentence.source.label)}
                            </a>
                          </>
                        ) : null}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
              <p className={styles.note}>{nbsp(text.taxes.note)}</p>
            </section>

            <section
              id="jak-pocitame"
              aria-labelledby="postup-nadpis"
              className={styles.section}
            >
              <h2 id="postup-nadpis" className={styles.heading}>
                {nbsp(text.method.heading)}
              </h2>
              <p className={styles.lead}>{nbsp(text.method.text)}</p>
              <a href={METHOD_HREF} className={styles.link}>
                {nbsp(text.method.link)}
              </a>
              <ResendCard action={resendMineAction.bind(null, token)} />
            </section>
          </div>
        </div>
      </Container>
    </main>
  )
}
