import { cacheLife } from 'next/cache'
import { chooseRates, fetchCnbRates, type ChosenRates } from '@/server/cnb'
import { bundledData } from '@/server/data/bundled'
import { ratesSchema } from '@/server/data/schema'

// The exchange rates the calculator uses: the Czech National Bank's daily file,
// fetched by the server and cached, with the verified record in data/rates.json
// as the fallback (docs/METHODOLOGY-V2.md). About two small requests a day for
// the whole site, not one per visitor.
export async function getRates(): Promise<ChosenRates> {
  'use cache'
  const fetched = await fetchCnbRates(fetch)
  // 12 hours when the bank answered; only 5 minutes when it did not, so a failed
  // fetch is retried soon without hammering the bank.
  cacheLife(
    fetched
      ? { stale: 300, revalidate: 43200, expire: 604800 }
      : { stale: 60, revalidate: 300, expire: 604800 },
  )
  const today = new Date().toISOString().slice(0, 10)
  return chooseRates(fetched, ratesSchema.parse(bundledData.rates), today)
}
