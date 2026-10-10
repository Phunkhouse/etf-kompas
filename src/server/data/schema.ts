import { z } from 'zod'

export const TODO_VERIFY = 'TODO_VERIFY'

// Metadata fields are nullable on purpose: a missing source is reported by the
// validator as MISSING_SOURCE rather than rejected as a schema error.
const meta = z.string().nullable()

// A sourced value (SPEC §18). `value` may still be the TODO_VERIFY placeholder.
function sourced<T extends z.ZodType>(value: T) {
  return z.object({
    value: z.union([value, z.literal(TODO_VERIFY)]),
    sourceUrl: meta,
    asOf: meta,
    verifiedBy: meta,
    verifiedOn: meta,
    evidence: meta,
  })
}

const isin = z.string().regex(/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/)

export const etfSchema = z.object({
  id: z.string().min(1),
  ticker: z.string().min(1),
  region: z.enum(['us-listed', 'ucits']),
  indexGroup: z.string().min(1),
  name: sourced(z.string().min(1)),
  indexName: sourced(z.string().min(1)),
  isin: sourced(isin),
  domicile: sourced(z.string().min(1)),
  replication: sourced(z.string().min(1)),
  distribution: sourced(z.string().min(1)),
  // Percentages are plain numbers: 0.07 means 0.07 %.
  ter: sourced(z.number().min(0)),
  fundSizeEur: sourced(z.number().int().min(0)),
  dividendYieldPct: sourced(z.number().min(0)),
  withholdingRate: sourced(z.number().min(0).max(100)),
  return5yPct: sourced(z.number()),
  return10yPct: sourced(z.number()),
})

export const brokerSchema = z.object({
  id: z.string().min(1),
  // Plain label (our choice of who to list), not a verified fact.
  name: z.string().min(1),
  fxFeePct: sourced(z.number().min(0)),
  custodyFeePct: sourced(z.number().min(0)),
  czSupport: sourced(z.boolean()),
  // Keyed by ETF id.
  availability: z.record(z.string(), sourced(z.boolean())),
})

export const sourceSchema = z.object({
  url: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
})

export const dataSchema = z.object({
  etfs: z.array(etfSchema),
  brokers: z.array(brokerSchema),
  sources: z.array(sourceSchema),
})

export type Etf = z.infer<typeof etfSchema>
export type Broker = z.infer<typeof brokerSchema>
export type Source = z.infer<typeof sourceSchema>
export type DataSet = z.infer<typeof dataSchema>
