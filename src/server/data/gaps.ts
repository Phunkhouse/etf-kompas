import { priceBroker } from '../broker-pricing'
import { verifiedValue } from '../availability'
import { TODO_VERIFY, type Broker, type Etf } from './schema'
import { hasSource } from './verified'
import type { Need } from './needs'

// Only the existence of a price matters here, so the rates are placeholders.
const SAMPLE_RATES = { EUR: 1, USD: 1 }
const SAMPLE_INPUT = { monthly: 3000, years: 10, grossReturn: 6 }

export type Gap = {
  screen: string
  what: string
  // how many values the screen needs, and how many of them are verified
  total: number
  verified: number
  // the values that are missing, for example "vuaa.distribution"
  missing: string[]
  // false for values the data model has no place for yet
  inModel: boolean
}

type Record = {
  value: unknown
  sourceUrl: string | null
  evidence: string | null
}

function isVerified(record: Record | undefined): boolean {
  return (
    record !== undefined && record.value !== TODO_VERIFY && hasSource(record)
  )
}

// The currencies (other than CZK) of a broker's verified listings, over all funds.
function listingCurrencies(broker: Broker | undefined): ('EUR' | 'USD')[] {
  const found = new Set<'EUR' | 'USD'>()
  for (const records of Object.values(broker?.fees?.listings ?? {})) {
    for (const record of records) {
      if (isVerified(record)) {
        const { currency } = record.value as { currency: string }
        if (currency === 'EUR' || currency === 'USD') found.add(currency)
      }
    }
  }
  return [...found].sort()
}

function findFund(etfs: Etf[], id: string): Etf | undefined {
  return etfs.find((etf) => etf.id === id)
}

// Checks every need against the data. A value counts only with a source and
// evidence (SPEC §18). Anything the data does not have is reported as missing.
export function computeGaps(
  data: { etfs: Etf[]; brokers: Broker[] },
  needs: Need[],
): Gap[] {
  return needs.map((need): Gap => {
    const base = { screen: need.screen, what: need.what }

    if (need.kind === 'planned') {
      return {
        ...base,
        total: need.count,
        verified: 0,
        missing: [need.field],
        inModel: false,
      }
    }

    const missing: string[] = []
    let total = 0

    if (need.kind === 'fund') {
      for (const fundId of need.fundIds) {
        const fund = findFund(data.etfs, fundId)
        for (const field of need.fields) {
          total += 1
          if (!isVerified(fund?.[field] as Record | undefined)) {
            missing.push(`${fundId}.${field}`)
          }
        }
      }
    } else if (need.kind === 'broker') {
      for (const brokerId of need.brokerIds) {
        const broker = data.brokers.find(
          (candidate) => candidate.id === brokerId,
        )
        for (const field of need.fields) {
          total += 1
          if (!isVerified(broker?.[field] as Record | undefined)) {
            missing.push(`${brokerId}.${field}`)
          }
        }
      }
    } else if (need.kind === 'fees') {
      for (const brokerId of need.brokerIds) {
        const broker = data.brokers.find(
          (candidate) => candidate.id === brokerId,
        )
        if (need.part === 'fx') {
          // one conversion fee for each currency (other than CZK) of a verified listing
          for (const currency of listingCurrencies(broker)) {
            total += 1
            const record = broker?.fees?.fx[currency]
            if (!isVerified(record)) missing.push(`${brokerId}.fx.${currency}`)
          }
        } else {
          total += 1
          const ok =
            need.part === 'custody'
              ? isVerified(broker?.fees?.custody)
              : (broker?.fees?.purchase ?? []).some(isVerified)
          if (!ok) missing.push(`${brokerId}.${need.part}`)
        }
      }
    } else if (need.kind === 'listings' || need.kind === 'priced') {
      for (const fundId of need.fundIds) {
        const fund = findFund(data.etfs, fundId)
        for (const brokerId of need.brokerIds) {
          const broker = data.brokers.find(
            (candidate) => candidate.id === brokerId,
          )
          if (!broker || verifiedValue(broker.availability[fundId]) !== true) {
            continue
          }
          total += 1
          const ok =
            need.kind === 'listings'
              ? (broker.fees?.listings[fundId] ?? []).some(isVerified)
              : fund?.ter !== undefined &&
                isVerified(fund.ter) &&
                typeof fund.ter.value === 'number' &&
                priceBroker(
                  broker,
                  fundId,
                  fund.ter.value,
                  SAMPLE_RATES,
                  SAMPLE_INPUT,
                ) !== null
          if (!ok) missing.push(`${brokerId}/${fundId}`)
        }
      }
    } else {
      for (const fundId of need.fundIds) {
        for (const brokerId of need.brokerIds) {
          total += 1
          const broker = data.brokers.find(
            (candidate) => candidate.id === brokerId,
          )
          const record = broker?.availability[fundId]
          if (!isVerified(record) || typeof record?.value !== 'boolean') {
            missing.push(`${brokerId}/${fundId}`)
          }
        }
      }
    }

    return {
      ...base,
      total,
      verified: total - missing.length,
      missing,
      inModel: true,
    }
  })
}

// Totals over all screens. A value that two screens need is counted once per
// screen in `total` and `verified`; `uniqueMissing` counts each missing value once
// (values the data model has no place for yet are in `notInModel`).
export function summarize(gaps: Gap[]): {
  total: number
  verified: number
  uniqueMissing: number
  notInModel: number
} {
  const missing = new Set<string>()
  let notInModel = 0
  let total = 0
  let verified = 0
  for (const gap of gaps) {
    total += gap.total
    verified += gap.verified
    if (gap.inModel) gap.missing.forEach((key) => missing.add(key))
    else notInModel += gap.total
  }
  return { total, verified, uniqueMissing: missing.size, notInModel }
}
