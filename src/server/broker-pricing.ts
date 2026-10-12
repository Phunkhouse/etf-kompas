// What a fund costs at each broker, for the fund and the setup the visitor chose
// (METHODOLOGY-V2 §5). A broker is priced only when everything the formula needs
// is verified, with a source and evidence; otherwise it has no price (it is not
// priced as 0). Pure: no imports from next or react.
import {
  calcCost,
  conversionFeePct,
  findPurchaseRule,
  purchaseFeeKc,
  toKc,
  type CostInput,
  type CostResult,
  type Currency,
  type PurchaseRule,
  type Rates,
} from './cost'
import type { Broker } from './data/schema'
import { TODO_VERIFY } from './data/todo'
import { hasSource } from './data/verified'

// What the pricing reads from a broker: nothing else is needed, so the browser
// is not sent the rest (it may hold unverified values).
export type PricingBroker = Pick<Broker, 'id' | 'availability' | 'fees'>

export type Listing = { currency: Currency; venue: string }

export type PricedBroker = {
  brokerId: string
  listing: Listing
  result: CostResult
}

export type BrokerPrices = {
  // every broker in the order of the data, with its price or null
  brokers: { brokerId: string; priced: PricedBroker | null }[]
  // the priced brokers, in the same order
  pricedBrokers: PricedBroker[]
  // the priced broker with the highest cost: the headline number (decision, note 0037)
  headline: PricedBroker | null
  // highest minus lowest cost; null with fewer than two priced brokers or when it is 0 Kč
  spreadKc: number | null
}

type SourcedValue<T> = {
  value: T | typeof TODO_VERIFY
  sourceUrl: string | null
  evidence: string | null
}

// The value of a record, only when it has a source and evidence.
function verified<T>(record: SourcedValue<T> | undefined): T | null {
  if (!record || record.value === TODO_VERIFY || !hasSource(record)) return null
  return record.value
}

function needsRate(currency: Currency, rates: Partial<Rates>): boolean {
  return currency === 'CZK' || rates[currency as 'EUR' | 'USD'] !== undefined
}

// The price of one listing, or null when a value it needs is not verified.
function priceListing(
  broker: PricingBroker,
  listing: Listing,
  ter: number,
  rates: Partial<Rates>,
  input: CostInput,
): CostResult | null {
  const fees = broker.fees
  if (!fees) return null

  const fx: Partial<Record<'EUR' | 'USD', number>> = {}
  for (const currency of ['EUR', 'USD'] as const) {
    const value = verified(fees.fx[currency])
    if (value !== null) fx[currency] = value
  }
  const fxFeePct = conversionFeePct(listing.currency, fx)
  if (fxFeePct === null) return null

  const rules: PurchaseRule[] = []
  for (const record of fees.purchase) {
    const rule = verified(record)
    if (rule !== null) rules.push(rule)
  }
  const rule = findPurchaseRule(rules, listing.venue)
  const custody = verified(fees.custody)
  if (rule === null || custody === null) return null
  if (!needsRate(rule.currency, rates) || !needsRate(custody.currency, rates)) {
    return null
  }
  const full = rates as Rates

  return calcCost(input, {
    ter,
    fxFeePct,
    purchaseFeeKc: purchaseFeeKc(rule, input.monthly, full),
    custodyAnnualFixedKc: toKc(custody.annualFixed, custody.currency, full),
    custodyAnnualPercent: custody.annualPercent,
  })
}

// The price of a fund at one broker, at its cheapest listing that can be priced.
export function priceBroker(
  broker: PricingBroker,
  fundId: string,
  ter: number,
  rates: Partial<Rates>,
  input: CostInput,
): PricedBroker | null {
  if (verified(broker.availability[fundId]) !== true) return null

  let best: PricedBroker | null = null
  for (const record of broker.fees?.listings[fundId] ?? []) {
    const listing = verified(record)
    if (listing === null) continue
    const result = priceListing(broker, listing, ter, rates, input)
    if (result === null) continue
    if (best === null || result.totalKc < best.result.totalKc) {
      best = { brokerId: broker.id, listing, result }
    }
  }
  return best
}

export function priceBrokers(
  brokers: PricingBroker[],
  fundId: string,
  ter: number,
  rates: Partial<Rates>,
  input: CostInput,
): BrokerPrices {
  const all = brokers.map((broker) => ({
    brokerId: broker.id,
    priced: priceBroker(broker, fundId, ter, rates, input),
  }))
  const pricedBrokers = all.flatMap((entry) =>
    entry.priced ? [entry.priced] : [],
  )

  let headline: PricedBroker | null = null
  for (const priced of pricedBrokers) {
    if (headline === null || priced.result.totalKc > headline.result.totalKc) {
      headline = priced
    }
  }

  let spreadKc: number | null = null
  if (pricedBrokers.length >= 2) {
    const costs = pricedBrokers.map((priced) => priced.result.totalKc)
    const spread = Math.max(...costs) - Math.min(...costs)
    spreadKc = spread > 0 ? spread : null
  }

  return { brokers: all, pricedBrokers, headline, spreadKc }
}
