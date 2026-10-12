// What the hero table and its muted line may say (wireframe rev. 4, note 0036).
// Only values with a source and evidence are used; everything else is "not
// verified" (SPEC §18). Pure: no imports from next or react.
import { verifiedValue } from './availability'
import type { Broker, Etf } from './data/schema'
import { TODO_VERIFY } from './data/todo'
import { hasSource } from './data/verified'

export type HeroTwin = {
  fundId: string
  ticker: string
  // annual fee in plain percent (0.07 means 0,07 %); null unless verified
  ter: number | null
  // null unless verified
  type: 'accumulating' | 'distributing' | null
}

export type HeroNote = {
  fundId: string
  ticker: string
  // brokers verified as selling the fund, in the order of the data
  sellers: string[]
  // true while some broker is neither verified as selling it nor as not selling it
  othersUnverified: boolean
  originals: {
    tickers: string[]
    // every original fund is verified as not sold by more than half of the brokers
    mostlyNo: boolean
  }
}

type Data = { etfs: Etf[]; brokers: Broker[] }

type Sourced = {
  value: unknown
  sourceUrl: string | null
  evidence: string | null
}

function verified(record: Sourced): unknown {
  return record.value !== TODO_VERIFY && hasSource(record) ? record.value : null
}

function findFund(data: Data, fundId: string): Etf {
  const etf = data.etfs.find((candidate) => candidate.id === fundId)
  if (!etf) throw new Error(`Fund "${fundId}" is not in the data`)
  return etf
}

export function heroTwins(data: Data, fundIds: string[]): HeroTwin[] {
  return fundIds.map((fundId) => {
    const etf = findFund(data, fundId)
    const ter = verified(etf.ter)
    const type = verified(etf.distribution)
    return {
      fundId,
      ticker: etf.ticker,
      ter: typeof ter === 'number' ? ter : null,
      type: type === 'accumulating' || type === 'distributing' ? type : null,
    }
  })
}

export function heroNote(
  data: Data,
  firstFundId: string,
  originalIds: string[],
): HeroNote {
  const first = findFund(data, firstFundId)
  const { brokers } = data

  const states = brokers.map((broker) =>
    verifiedValue(broker.availability[firstFundId]),
  )
  const sellers = brokers
    .filter((_, index) => states[index] === true)
    .map((broker) => broker.name)

  const originals = originalIds.map((id) => findFund(data, id))
  const mostlyNo =
    originals.length > 0 &&
    brokers.length > 0 &&
    originals.every((etf) => {
      const no = brokers.filter(
        (broker) => verifiedValue(broker.availability[etf.id]) === false,
      ).length
      return no * 2 > brokers.length
    })

  return {
    fundId: firstFundId,
    ticker: first.ticker,
    sellers,
    othersUnverified: states.some((state) => state === null),
    originals: { tickers: originals.map((etf) => etf.ticker), mostlyNo },
  }
}

export type OriginalsFacts = {
  tickers: string[]
  // brokers verified as not selling them (the smaller count of the originals)
  verifiedNo: number
  total: number
  // at least one broker is verified as selling the first twin
  europeanSold: boolean
}

// What the FAQ may say about the American funds: how many brokers are verified as
// not selling them (the smaller count of the two), out of all brokers, and
// whether the European twin has a verified seller. Only verified values count.
export function originalsFacts(
  data: Data,
  firstFundId: string,
  originalIds: string[],
): OriginalsFacts {
  findFund(data, firstFundId)
  const originals = originalIds.map((id) => findFund(data, id))
  const { brokers } = data
  const counts = originals.map(
    (etf) =>
      brokers.filter(
        (broker) => verifiedValue(broker.availability[etf.id]) === false,
      ).length,
  )
  return {
    tickers: originals.map((etf) => etf.ticker),
    verifiedNo: counts.length > 0 ? Math.min(...counts) : 0,
    total: brokers.length,
    europeanSold: brokers.some(
      (broker) => verifiedValue(broker.availability[firstFundId]) === true,
    ),
  }
}
