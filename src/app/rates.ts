import { cacheLife } from 'next/cache'
import { chooseRates, fetchCnbRates, type ChosenRates } from '@/server/cnb'

// The exchange rates the calculator uses: the Czech National Bank's daily file,
// fetched by the server and cached. There is no stored fallback: a record would be
// too old to use within days (note 0066), so without the bank's answer there is no
// price and the page shows the fund fee only. About two small requests a day for
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
  return chooseRates(fetched, undefined, today)
}
