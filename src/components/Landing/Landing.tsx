import { Section } from '@/components/Section'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SourceBar } from '@/components/SourceBar'
import { copy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './Landing.module.scss'

export type Variant = 'a' | 'b'

type LandingProps = {
  // a = calculator-first hero (ad A), b = table-first hero (ad B)
  variant: Variant
  dataAsOf: string | null
}

// The landing page: frame plus the hero of the chosen variant. The hero below
// is a placeholder (headline only); the hero PR replaces it.
export function Landing({ variant, dataAsOf }: LandingProps) {
  return (
    <>
      <SourceBar dataAsOf={dataAsOf} />
      <SiteHeader />
      <main>
        <Section labelledBy="hero-headline">
          <h1 id="hero-headline" className={styles.headline}>
            {nbsp(copy.hero[variant].headline)}
          </h1>
        </Section>
      </main>
      <SiteFooter />
    </>
  )
}
