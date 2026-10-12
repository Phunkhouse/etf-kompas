// What the calculator in the browser gets from the data files (calculator UI v2).
// Only values with a source and evidence are passed on, and only for the chosen
// fund, so nothing unverified reaches the page and the payload stays small.
// Pure: no imports from next or react.
import type { PricingBroker } from './broker-pricing'
import type { ChosenRates } from './cnb'
import type { Rates } from './cost'
import { TODO_VERIFY, dataSchema, type Broker } from './data/schema'
import { hasSource } from './data/verified'

export type CalculatorData = {
  fundId: string
  ticker: string
  // the fund's annual fee in plain percent (0.07 means 0,07 %)
  ter: number
  // every broker we list, priced or not, in the order of the data
  brokers: { id: string; name: string }[]
  // only what the pricing formula can use: verified records, this fund only
  pricing: PricingBroker[]
  rates: Partial<Rates>
  // the oldest date among the rates used; null without a rate
  ratesAsOf: string | null
}

type Sourced = {
  value: unknown
  sourceUrl: string | null
  evidence: string | null
}

function isVerified(record: Sourced | undefined): boolean {
  return (
    record !== undefined && record.value !== TODO_VERIFY && hasSource(record)
  )
}

function onlyVerified<T extends Sourced>(records: T[] | undefined): T[] {
  return (records ?? []).filter(isVerified)
}

// The part of a broker the formula needs for one fund, verified records only.
function trimBroker(broker: Broker, fundId: string): PricingBroker {
  const availability: Broker['availability'] = {}
  const own = broker.availability[fundId]
  if (isVerified(own)) availability[fundId] = own

  const { fees } = broker
  if (!fees) return { id: broker.id, availability }

  const fx: NonNullable<Broker['fees']>['fx'] = {}
  for (const currency of ['EUR', 'USD'] as const) {
    const record = fees.fx[currency]
    if (record && isVerified(record)) fx[currency] = record
  }
  const listings = onlyVerified(fees.listings[fundId])
  return {
    id: broker.id,
    availability,
    fees: {
      fx,
      purchase: onlyVerified(fees.purchase),
      ...(fees.custody && isVerified(fees.custody)
        ? { custody: fees.custody }
        : {}),
      listings: listings.length > 0 ? { [fundId]: listings } : {},
    },
  }
}

export function calculatorData(
  raw: unknown,
  rates: ChosenRates,
  fundId: string,
): CalculatorData | null {
  const parsed = dataSchema.safeParse(raw)
  if (!parsed.success) return null
  const { etfs, brokers } = parsed.data

  const fund = etfs.find((etf) => etf.id === fundId)
  if (!fund || !isVerified(fund.ter) || typeof fund.ter.value !== 'number') {
    return null
  }

  const chosen: Partial<Rates> = {}
  const dates: string[] = []
  for (const currency of ['EUR', 'USD'] as const) {
    const rate = rates[currency]
    if (rate) {
      chosen[currency] = rate.rate
      dates.push(rate.date)
    }
  }

  return {
    fundId,
    ticker: fund.ticker,
    ter: fund.ter.value,
    brokers: brokers.map(({ id, name }) => ({ id, name })),
    pricing: brokers
      .filter((broker) => broker.fees)
      .map((broker) => trimBroker(broker, fundId)),
    rates: chosen,
    ratesAsOf: dates.length > 0 ? dates.sort()[0] : null,
  }
}
