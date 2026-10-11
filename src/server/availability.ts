// What the hero table may claim about buying a fund from Czechia (note 0029,
// SPEC §18): "no" only with a source per firm, never from a missing value.
import type { Broker, Etf } from '@/server/data/schema'
import { hasSource } from '@/server/data/verified'

export type Buyability = {
  // yes = at least one firm is verified as selling it; no = every firm is
  // verified as not selling it; unverified = anything else
  state: 'yes' | 'no' | 'unverified'
  // firms verified as selling / not selling the fund, out of all firms
  yesCount: number
  verifiedNoCount: number
  total: number
}

type AvailabilityRecord = Broker['availability'][string]

// A true or false counts only when it has a source and evidence.
function verifiedValue(record: AvailabilityRecord | undefined): boolean | null {
  if (!record || typeof record.value !== 'boolean') return null
  return hasSource(record) ? record.value : null
}

export function buyability(fundId: string, brokers: Broker[]): Buyability {
  const values = brokers.map((broker) =>
    verifiedValue(broker.availability[fundId]),
  )
  const yesCount = values.filter((value) => value === true).length
  const verifiedNoCount = values.filter((value) => value === false).length
  const total = brokers.length

  const state =
    yesCount > 0
      ? 'yes'
      : total > 0 && verifiedNoCount === total
        ? 'no'
        : 'unverified'

  return { state, yesCount, verifiedNoCount, total }
}

export type HeroRow = {
  fundId: string
  // annual fee in percent (0.07 means 0,07 %), null while it is TODO_VERIFY
  ter: number | null
  buyability: Buyability
  // the row that is buyable from Czechia (not the cheapest, note 0029)
  highlight: boolean
}

export function heroRows(
  data: { etfs: Etf[]; brokers: Broker[] },
  fundIds: string[],
): HeroRow[] {
  return fundIds.map((fundId) => {
    const etf = data.etfs.find((candidate) => candidate.id === fundId)
    if (!etf) throw new Error(`Fund "${fundId}" is not in the data`)
    const result = buyability(fundId, data.brokers)
    return {
      fundId,
      ter: typeof etf.ter.value === 'number' ? etf.ter.value : null,
      buyability: result,
      highlight: result.state === 'yes',
    }
  })
}
