// Calculator version 2 (docs/METHODOLOGY-V2.md): what a fund costs over the
// years, split into the fund fee, the conversion of korunas and the broker's
// fees. Pure: no imports from next or react. Fees are plain percent numbers
// (0.07 means 0,07 %); money is in Kč unless a name says otherwise.

export type Currency = 'CZK' | 'EUR' | 'USD'
// Kč per unit of the currency (the Czech National Bank rate on a stated date).
export type Rates = { EUR: number; USD: number }

// One rule for the fee of a purchase order. `venues: null` matches any venue.
// `fixed`, `min` and `max` are in `currency`; `percent` is of the deposit.
export type PurchaseRule = {
  venues: string[] | null
  currency: Currency
  fixed: number
  percent: number
  min?: number
  max?: number
}

export type CostInput = {
  monthly: number
  years: number
  grossReturn?: number
}

// The fees of one fund at one broker, already in Kč and percent.
export type CostFees = {
  ter: number
  fxFeePct: number
  purchaseFeeKc: number
  custodyAnnualFixedKc: number
  custodyAnnualPercent: number
}

export type CostParts = { fund: number; fx: number; broker: number }

export type CostResult = {
  totalKc: number
  parts: CostParts
  // the illustrative value after the costs, and without them; value + total
  // equals value without costs
  valueKc: number
  valueWithoutCostsKc: number
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

// Future value of one unit paid at the end of each month, for an annual rate r.
function annuity(r: number, years: number) {
  if (r === 0) return 12 * years
  const m = (1 + r) ** (1 / 12) - 1
  return ((1 + r) ** years - 1) / m
}

// Fees are plain percent numbers. A value between 0 and 0.01 is almost surely a
// fraction (0.0007 instead of 0.07), so it is rejected.
export function assertPlainPercent(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be zero or more, got ${value}`)
  }
  if (value > 0 && value < 0.01) {
    throw new Error(
      `${name} is ${value}: that looks like a fraction. Percentages are plain numbers (0.07 means 0,07 %).`,
    )
  }
}

function assertMoney(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be zero or more, got ${value}`)
  }
}

// Rounds once to whole Kč. The largest part (the first on a tie) takes the
// rounding remainder, so the displayed parts add up to the displayed total.
export function splitRounded(
  total: number,
  parts: CostParts,
): { totalKc: number; parts: CostParts } {
  const totalKc = Math.round(total)
  const keys = ['fund', 'fx', 'broker'] as const
  const rounded: CostParts = {
    fund: Math.round(parts.fund),
    fx: Math.round(parts.fx),
    broker: Math.round(parts.broker),
  }
  let largest: (typeof keys)[number] = keys[0]
  for (const key of keys) {
    if (parts[key] > parts[largest]) largest = key
  }
  const others = keys
    .filter((key) => key !== largest)
    .reduce((sum, key) => sum + rounded[key], 0)
  rounded[largest] = Math.max(0, totalKc - others)
  return { totalKc, parts: rounded }
}

// The cost of holding a fund for `years`, with one investment a month
// (METHODOLOGY-V2 §4): costs are added to the no-cost value one at a time, so
// the parts add up to the total.
export function calcCost(input: CostInput, fees: CostFees): CostResult {
  assertPlainPercent('ter', fees.ter)
  assertPlainPercent('fxFeePct', fees.fxFeePct)
  assertPlainPercent('custodyAnnualPercent', fees.custodyAnnualPercent)
  assertMoney('purchaseFeeKc', fees.purchaseFeeKc)
  assertMoney('custodyAnnualFixedKc', fees.custodyAnnualFixedKc)

  const deposit = cleanMonthly(input.monthly)
  const years = cleanYears(input.years)
  const g = cleanGrossReturn(input.grossReturn) / 100
  const t = fees.ter / 100
  const f = fees.fxFeePct / 100
  const c = fees.custodyAnnualPercent / 100

  // what is invested each month after the conversion and the fixed fees
  const invested = Math.max(
    0,
    deposit * (1 - f) - fees.purchaseFeeKc - fees.custodyAnnualFixedKc / 12,
  )

  const s0 = deposit * annuity(g, years)
  const s1 = deposit * annuity(g - t, years)
  const s2 = deposit * (1 - f) * annuity(g - t, years)
  const s3 = invested * annuity(g - t - c, years)

  const { totalKc, parts } = splitRounded(Math.max(0, s0 - s3), {
    fund: Math.max(0, s0 - s1),
    fx: Math.max(0, s1 - s2),
    broker: Math.max(0, s2 - s3),
  })
  const valueWithoutCostsKc = Math.round(s0)
  return {
    totalKc,
    parts,
    valueKc: Math.max(0, valueWithoutCostsKc - totalKc),
    valueWithoutCostsKc,
  }
}

export function toKc(amount: number, currency: Currency, rates: Rates): number {
  return currency === 'CZK' ? amount : amount * rates[currency]
}

// The fee of one order in Kč: fixed + percent of the deposit, kept between the
// minimum and the maximum when the rule has them (METHODOLOGY-V2 §3).
export function purchaseFeeKc(
  rule: PurchaseRule,
  monthly: number,
  rates: Rates,
): number {
  if (rule.min !== undefined && rule.max !== undefined && rule.min > rule.max) {
    throw new Error('A purchase rule cannot have a minimum above its maximum')
  }
  let fee =
    toKc(rule.fixed, rule.currency, rates) +
    (rule.percent / 100) * cleanMonthly(monthly)
  if (rule.min !== undefined) {
    fee = Math.max(fee, toKc(rule.min, rule.currency, rates))
  }
  if (rule.max !== undefined) {
    fee = Math.min(fee, toKc(rule.max, rule.currency, rates))
  }
  return fee
}

// The first rule whose venues contain the venue wins; a rule without venues
// matches any venue.
export function findPurchaseRule(
  rules: PurchaseRule[],
  venue: string,
): PurchaseRule | null {
  return (
    rules.find((rule) => rule.venues === null || rule.venues.includes(venue)) ??
    null
  )
}

// The conversion fee for a listing currency. A CZK listing needs no conversion.
// null = the broker's fee for that currency is not verified (not the same as 0).
export function conversionFeePct(
  currency: Currency,
  fx: Partial<Record<'EUR' | 'USD', number>>,
): number | null {
  if (currency === 'CZK') return 0
  return fx[currency] ?? null
}

// The fund-fee part alone, for the state in which no broker is priced yet
// (decision A, note 0037): the other parts are shown as `[ověřit]`, with no total.
export function fundFeeKc(input: CostInput, ter: number): number {
  return calcCost(input, {
    ter,
    fxFeePct: 0,
    purchaseFeeKc: 0,
    custodyAnnualFixedKc: 0,
    custodyAnnualPercent: 0,
  }).parts.fund
}
