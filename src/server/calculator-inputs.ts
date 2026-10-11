// The numbers the calculator is fed with, taken from the data files. A value is
// used only with a source and evidence; anything else is left out, never
// replaced by a guess (SPEC §18, CLAUDE.md).
import type { CalcFund } from '@/server/calc'
import type { Broker, Etf } from '@/server/data/schema'
import { hasSource } from '@/server/data/verified'

export type CalculatorInputs = {
  featured: CalcFund
  alternative: CalcFund
  // percent of every deposit, absent = the fee is not counted (SPEC §21)
  fxFeePct?: number
}

type SourcedNumber = {
  value: number | 'TODO_VERIFY'
  sourceUrl: string | null
  evidence: string | null
}

function verifiedNumber(record: SourcedNumber): number | null {
  return typeof record.value === 'number' && hasSource(record)
    ? record.value
    : null
}

function calcFund(etf: Etf): CalcFund | null {
  const ter = verifiedNumber(etf.ter)
  const dividendYieldPct = verifiedNumber(etf.dividendYieldPct)
  const withholdingRate = verifiedNumber(etf.withholdingRate)
  if (ter === null || dividendYieldPct === null || withholdingRate === null) {
    return null
  }
  return {
    id: etf.id,
    indexGroup: etf.indexGroup,
    ter,
    dividendYieldPct,
    withholdingRate,
  }
}

function findEtf(etfs: Etf[], id: string): Etf {
  const etf = etfs.find((candidate) => candidate.id === id)
  if (!etf) throw new Error(`Fund "${id}" is not in the data`)
  return etf
}

// Returns null when a fund's fee, yield or withholding rate is not verified: the
// page then leaves the calculator out instead of showing an invented number.
export function calculatorInputs(
  data: { etfs: Etf[]; brokers: Broker[] },
  ids: { featured: string; alternative: string; broker: string },
): CalculatorInputs | null {
  const featuredEtf = findEtf(data.etfs, ids.featured)
  const alternativeEtf = findEtf(data.etfs, ids.alternative)
  const broker = data.brokers.find((candidate) => candidate.id === ids.broker)
  if (!broker) throw new Error(`Broker "${ids.broker}" is not in the data`)

  const featured = calcFund(featuredEtf)
  const alternative = calcFund(alternativeEtf)
  if (featured === null || alternative === null) return null

  const fxFeePct = verifiedNumber(broker.fxFeePct)
  return fxFeePct === null
    ? { featured, alternative }
    : { featured, alternative, fxFeePct }
}
