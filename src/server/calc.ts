// Calculator: cost drag of holding a fund, in Kč. Formulas and the reasoning
// behind them are in docs/METHODOLOGY.md. No imports from next or react.

export type CalcFund = {
  id: string
  indexGroup: string
  // Percentages are plain numbers: 0.07 means 0.07 %.
  ter: number
  dividendYieldPct: number
  withholdingRate: number
}

export type CalcInput = {
  monthly: number
  years: number
  grossReturn?: number
  // Absent means the FX component is off.
  fxFeePct?: number
}

export type CostParts = { ter: number; fx: number; withholding: number }

export type CostResult = {
  totalKc: number
  parts: CostParts
  fxApplied: boolean
}

export type ComparisonRow = CostResult & {
  id: string
  // Difference to the cheapest fund in the same index group; null if alone.
  gapKc: number | null
}

const DEFAULT_MONTHLY = 3000
const DEFAULT_YEARS = 10
const DEFAULT_GROSS_RETURN = 6
const MAX_MONTHLY = 20000
const MAX_GROSS_RETURN = 12
const YEARS = [5, 10, 20]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function cleanMonthly(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_MONTHLY
  return clamp(Math.round(value), 0, MAX_MONTHLY)
}

// Nearest of 5, 10, 20; a tie goes to the smaller value.
function cleanYears(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_YEARS
  let best = YEARS[0]
  for (const y of YEARS) {
    if (Math.abs(y - value) < Math.abs(best - value)) best = y
  }
  return best
}

function cleanGrossReturn(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_GROSS_RETURN
  }
  return clamp(value, 0, MAX_GROSS_RETURN)
}

// Annuity factor for month-end deposits: ((1 + r)^years - 1) / m, where m is
// the monthly rate. At r = 0 it is the number of months.
function annuity(r: number, years: number) {
  if (r === 0) return 12 * years
  const m = (1 + r) ** (1 / 12) - 1
  return ((1 + r) ** years - 1) / m
}

type RawCost = { total: number; parts: CostParts; fxApplied: boolean }

// Unrounded cost and its parts (METHODOLOGY §4 and §5): costs are added to
// the no-cost baseline one at a time, so the parts sum to the total.
function rawCost(input: CalcInput, fund: CalcFund): RawCost {
  const deposit = cleanMonthly(input.monthly)
  const years = cleanYears(input.years)
  const g = cleanGrossReturn(input.grossReturn) / 100
  const fxApplied =
    input.fxFeePct !== undefined && Number.isFinite(input.fxFeePct)
  const f = fxApplied ? Math.max(0, input.fxFeePct as number) / 100 : 0

  const t = fund.ter / 100
  const withholding =
    (fund.dividendYieldPct / 100) * (fund.withholdingRate / 100)

  const s0 = deposit * annuity(g, years)
  const s1 = deposit * annuity(g - t, years)
  const s2 = deposit * (1 - f) * annuity(g - t, years)
  const s3 = deposit * (1 - f) * annuity(g - t - withholding, years)

  return {
    total: Math.max(0, s0 - s3),
    parts: {
      ter: Math.max(0, s0 - s1),
      fx: Math.max(0, s1 - s2),
      withholding: Math.max(0, s2 - s3),
    },
    fxApplied,
  }
}

// Rounds once to whole Kč. The largest part takes the rounding remainder so
// the displayed parts add up to the displayed total.
function toResult(raw: RawCost): CostResult {
  const totalKc = Math.round(raw.total)
  const keys = ['ter', 'fx', 'withholding'] as const
  const parts: CostParts = {
    ter: Math.round(raw.parts.ter),
    fx: Math.round(raw.parts.fx),
    withholding: Math.round(raw.parts.withholding),
  }
  let largest: (typeof keys)[number] = keys[0]
  for (const key of keys) {
    if (raw.parts[key] > raw.parts[largest]) largest = key
  }
  const others = keys
    .filter((key) => key !== largest)
    .reduce((sum, key) => sum + parts[key], 0)
  parts[largest] = Math.max(0, totalKc - others)
  return { totalKc, parts, fxApplied: raw.fxApplied }
}

export function calcCost(input: CalcInput, fund: CalcFund): CostResult {
  return toResult(rawCost(input, fund))
}

// Cost of every fund, with the gap to the cheapest fund in its index group.
export function calcComparison(
  input: CalcInput,
  funds: CalcFund[],
): ComparisonRow[] {
  const raws = funds.map((fund) => rawCost(input, fund))
  const rows = raws.map((raw) => toResult(raw))
  return funds.map((fund, i) => {
    const group = funds.flatMap((other, j) =>
      other.indexGroup === fund.indexGroup ? [j] : [],
    )
    if (group.length < 2) return { id: fund.id, ...rows[i], gapKc: null }
    const cheapest = group.reduce((best, j) =>
      raws[j].total < raws[best].total ? j : best,
    )
    return {
      id: fund.id,
      ...rows[i],
      gapKc: rows[i].totalKc - rows[cheapest].totalKc,
    }
  })
}
