import { Button, ButtonLink } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Chip } from '@/components/Chip'
import { Pill } from '@/components/Pill'
import { Section } from '@/components/Section'
import { Table, TableLabel } from '@/components/Table'
import { Tag } from '@/components/Tag'
import { Wordmark } from '@/components/Wordmark'
import styles from './Primitives.module.scss'

const columns = [
  { id: 'what', header: 'Co koupíte', width: '56%' },
  { id: 'fee', header: 'Poplatek', numeric: true, width: '20%' },
  { id: 'cz', header: 'Z ČR?', width: '24%' },
]

// Placeholder rows from the wireframe: values stay unverified until the data is checked.
const rows = [
  {
    id: 'voo',
    cells: {
      what: (
        <TableLabel
          title="Americký fond na 500 největších firem"
          detail="značka VOO"
        />
      ),
      fee: '0,0X %',
      cz: <Pill tone="negative">[ověřit]</Pill>,
    },
  },
  {
    id: 'qqq',
    cells: {
      what: (
        <TableLabel
          title="Americký fond na 100 technologických firem"
          detail="značka QQQ"
        />
      ),
      fee: '0,XX %',
      cz: <Pill tone="negative">[ověřit]</Pill>,
    },
  },
  {
    id: 'ucits',
    highlight: true,
    cells: {
      what: (
        <TableLabel
          title="Evropská verze prvního fondu"
          detail="stejných 500 firem, fond sídlí v Evropě"
        />
      ),
      fee: '0,0X %',
      cz: <Pill tone="positive">[ověřit]</Pill>,
    },
  },
]

function Controls() {
  return (
    <div className={styles.stack}>
      <Tag as="h3">Button</Tag>
      <div className={styles.row}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button size="sm">Small</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Počítám…</Button>
      </div>
      <Button fullWidth>Full width, Poslat mi srovnání</Button>
      <p>
        <ButtonLink href="#sg-primitives">
          Link looking like a button
        </ButtonLink>
      </p>

      <Tag as="h3">Chip</Tag>
      <div className={styles.row} role="group" aria-label="Na jak dlouho">
        <Chip>5</Chip>
        <Chip selected>10</Chip>
        <Chip>20</Chip>
      </div>

      <Tag as="h3">Callout</Tag>
      <Callout>
        <strong>ETF</strong> je fond, který jen kopíruje trh. Nemá drahé
        správce, a proto je levný.
      </Callout>
      <Callout variant="risk">
        Investování nese riziko ztráty. Minulé výnosy nezaručují budoucí.
      </Callout>
    </div>
  )
}

export function Primitives() {
  return (
    <>
      <section className={styles.block} aria-labelledby="sg-primitives">
        <h2 id="sg-primitives" className={styles.heading}>
          Primitives
        </h2>

        <div className={styles.stack}>
          <Tag as="h3">Wordmark</Tag>
          <div className={styles.row}>
            <Wordmark />
          </div>

          <Controls />

          <Tag as="h3">Pill and Tag</Tag>
          <div className={styles.row}>
            <Pill tone="negative">[ověřit]</Pill>
            <Pill tone="positive">ano</Pill>
            <Tag>Cena a dostupnost</Tag>
          </div>

          <Tag as="h3">Table</Tag>
          <Table caption="Cena a dostupnost" columns={columns} rows={rows} />
        </div>
      </section>

      <Section tone="dark" labelledBy="sg-dark">
        <h2 id="sg-dark" className={styles.heading}>
          Primitives on a dark Section
        </h2>
        <div className={styles.stack}>
          <Wordmark tone="dark" />
          <Controls />
        </div>
      </Section>
    </>
  )
}
