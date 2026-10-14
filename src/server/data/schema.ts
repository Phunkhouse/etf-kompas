import { z } from 'zod'

import { TODO_VERIFY } from './todo'
export { TODO_VERIFY }

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

export const currencySchema = z.enum(['CZK', 'EUR', 'USD'])

// A percentage is a plain number (0.07 means 0,07 %). A value between 0 and 0.01
// is almost surely a fraction (0.0007 for 0,07 %), so it is rejected.
const plainPercent = z
  .number()
  .min(0)
  .refine((value) => value === 0 || value >= 0.01, {
    message:
      'looks like a fraction: percentages are plain numbers (0.07 means 0,07 %)',
  })

// How a broker sells a fund: the currency and the exchange of one listing.
const listingValue = z.object({
  currency: currencySchema,
  venue: z.string().min(1),
})

// The fee of one purchase order (METHODOLOGY-V2 §3). `venues: null` matches any
// exchange. fixed, min and max are in `currency`; percent is of the deposit.
const purchaseRuleValue = z
  .object({
    venues: z.array(z.string().min(1)).nullable(),
    currency: currencySchema,
    fixed: z.number().min(0),
    percent: plainPercent,
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  })
  .refine(
    (rule) =>
      rule.min === undefined || rule.max === undefined || rule.min <= rule.max,
    {
      message: 'min is above max',
    },
  )

const custodyValue = z.object({
  currency: currencySchema,
  annualFixed: z.number().min(0),
  annualPercent: plainPercent,
})

// What the calculator version 2 needs from a broker (METHODOLOGY-V2 §3). Every
// leaf is a sourced record; a missing or unverified leaf means "no price".
export const brokerFeesSchema = z.object({
  // percent of the converted amount, per listing currency
  fx: z.object({
    EUR: sourced(plainPercent).optional(),
    USD: sourced(plainPercent).optional(),
  }),
  purchase: z.array(sourced(purchaseRuleValue)),
  custody: sourced(custodyValue).optional(),
  // the listings of each fund, by fund id
  listings: z.record(z.string(), z.array(sourced(listingValue))),
})

// Czech National Bank rate on a stated date: Kč per unit of the currency.
export const ratesSchema = z.object({
  EUR: sourced(z.number().positive()),
  USD: sourced(z.number().positive()),
})

// The few Czech tax statements the page may make (docs/TAX-SOURCES.md). Each one is
// a sourced record; the sentence built from it lives in copy.ts (taxCopy).
export const taxSchema = z.object({
  // years after which a sale is exempt (§ 4 odst. 1 písm. u ZDP)
  timeTestYears: sourced(z.number().int().positive()),
  // a year's sales up to this amount (in Kč) are exempt (písm. t)
  annualLimitKc: sourced(z.number().int().positive()),
  // the time test and the amount limit cannot be combined
  exemptionsExclusive: sourced(z.boolean()),
  // neither exemption holds for securities kept in business assets
  businessAssetsExcluded: sourced(z.boolean()),
  // a security of a foreign issuer counts as a security (Pokyn GFŘ-D-59)
  foreignIssuerSecurities: sourced(z.boolean()),
  // a share of a fund's profit is capital income (§ 8 odst. 1 písm. a)
  dividendsCapitalIncome: sourced(z.boolean()),
})

const isin = z.string().regex(/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/)

export const etfSchema = z.object({
  id: z.string().min(1),
  ticker: z.string().min(1),
  region: z.enum(['us-listed', 'ucits']),
  indexGroup: z.string().min(1),
  // The American originals (VOO, QQQ) are named only to say where they cannot be
  // bought, so they carry no records (note 0069). The twins need all four, which
  // `pnpm data:gaps` checks screen by screen.
  name: sourced(z.string().min(1)).optional(),
  isin: sourced(isin).optional(),
  distribution: sourced(z.string().min(1)).optional(),
  // Percentages are plain numbers: 0.07 means 0.07 %.
  ter: sourced(z.number().min(0)).optional(),
})

export const brokerSchema = z.object({
  id: z.string().min(1),
  // Plain label (our choice of who to list), not a verified fact.
  name: z.string().min(1),
  czSupport: sourced(z.boolean()),
  // Keyed by ETF id. A fund that is missing is unknown, not "no".
  availability: z.record(z.string(), sourced(z.boolean())),
  // Version 2 of the calculator. Optional while the data is being filled in.
  fees: brokerFeesSchema.optional(),
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
  rates: ratesSchema.optional(),
  tax: taxSchema.optional(),
})

export type Etf = z.infer<typeof etfSchema>
export type Broker = z.infer<typeof brokerSchema>
export type Tax = z.infer<typeof taxSchema>
export type Source = z.infer<typeof sourceSchema>
export type Currency = z.infer<typeof currencySchema>
export type DataSet = z.infer<typeof dataSchema>
