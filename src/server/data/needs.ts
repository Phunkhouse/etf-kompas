// What each screen of the rev. 4 wireframes needs from the data (docs/design/
// wireframe-b.md, decision note 0035). `pnpm data:gaps` checks this list against
// data/*.json. A value counts only with a source and evidence.
import type { Broker, Etf } from './schema'

export type FundField = Exclude<
  keyof Etf,
  'id' | 'ticker' | 'region' | 'indexGroup'
>
export type BrokerField = 'czSupport'

// A part of a broker's price in the calculator's model (METHODOLOGY-V2 §3): the
// commission of one purchase, the custody fee, and the conversion fee of each
// currency the broker's verified listings use.
export type FeePart = 'purchase' | 'custody' | 'fx'

export type Need =
  | {
      kind: 'fund'
      screen: string
      what: string
      fundIds: string[]
      fields: FundField[]
    }
  | {
      kind: 'broker'
      screen: string
      what: string
      brokerIds: string[]
      fields: BrokerField[]
    }
  | {
      kind: 'availability'
      screen: string
      what: string
      fundIds: string[]
      brokerIds: string[]
    }
  // The fee parts of the calculator's model, per broker.
  | {
      kind: 'fees'
      screen: string
      what: string
      brokerIds: string[]
      part: FeePart
    }
  // Every fund a broker is verified to sell has a verified listing (currency and
  // venue). Only the pairs verified as sold count.
  | {
      kind: 'listings'
      screen: string
      what: string
      fundIds: string[]
      brokerIds: string[]
    }
  // Every fund a broker is verified to sell can be priced by the calculator's own
  // code (the listing, the conversion fee and a purchase rule for its venue are all
  // verified): the cell "Za 10 let celkem" has a number.
  | {
      kind: 'priced'
      screen: string
      what: string
      fundIds: string[]
      brokerIds: string[]
    }
  // Needed by a screen but not in the data model yet: always reported as missing.
  | {
      kind: 'planned'
      screen: string
      what: string
      field: string
      count: number
    }

export const BROKERS = ['degiro', 'fio', 'ibkr', 'trading212', 'xtb']
// The European twins. The hero shows four of the five, the comparison page all five.
export const HERO_TWINS = ['cspx', 'vuaa', 'cndx', 'eqqq']
export const ALL_TWINS = ['cspx', 'vuaa', 'vusa', 'cndx', 'eqqq']
// The American originals, named in the hero line "u většiny brokerů nekoupíte".
export const ORIGINALS = ['voo', 'qqq']

export const needs: Need[] = [
  {
    kind: 'fund',
    screen: 'Hero table',
    what: 'name, annual fee and Acc/Dist type of the four hero twins',
    fundIds: HERO_TWINS,
    fields: ['name', 'ter', 'distribution'],
  },
  {
    kind: 'availability',
    screen: 'Hero table',
    what: 'the line "CSPX: DEGIRO, Trading 212, XTB": where the first twin is sold',
    fundIds: ['cspx'],
    brokerIds: BROKERS,
  },
  {
    kind: 'availability',
    screen: 'Hero table',
    // "Most" is a majority: 3 of the 5 brokers verified as not selling them is
    // enough, so Fio and IBKR are not needed for this line (David, 2026-10-12).
    what: 'the line "Americké VOO a QQQ u většiny brokerů nekoupíte"',
    fundIds: ORIGINALS,
    brokerIds: ['degiro', 'trading212', 'xtb'],
  },
  {
    kind: 'fund',
    screen: 'Calculator',
    what: 'annual fee of the fund the result is about (CSPX)',
    fundIds: ['cspx'],
    fields: ['ter'],
  },
  {
    kind: 'fees',
    screen: 'Calculator',
    what: 'purchase commission of every broker, as a rule that can be calculated for one monthly purchase',
    brokerIds: BROKERS,
    part: 'purchase',
  },
  {
    kind: 'fees',
    screen: 'Calculator',
    what: 'custody fee of every broker',
    brokerIds: BROKERS,
    part: 'custody',
  },
  {
    kind: 'fees',
    screen: 'Calculator',
    what: 'conversion fee of every broker, for each currency its listings use',
    brokerIds: BROKERS,
    part: 'fx',
  },
  {
    kind: 'fund',
    screen: 'Comparison page',
    what: 'name, annual fee and Acc/Dist type of the five twins',
    fundIds: ALL_TWINS,
    fields: ['name', 'ter', 'distribution'],
  },
  {
    kind: 'availability',
    screen: 'Comparison page',
    what: 'the table "Koupíte?": five twins at five brokers',
    fundIds: ALL_TWINS,
    brokerIds: BROKERS,
  },
  {
    kind: 'broker',
    screen: 'Comparison page',
    what: 'whether the broker has Czech support ("česky" column)',
    brokerIds: BROKERS,
    fields: ['czSupport'],
  },
  {
    kind: 'listings',
    screen: 'Comparison page',
    what: 'the listing (USD or EUR) per fund and broker that sells it, for "Za 10 let celkem"',
    fundIds: ALL_TWINS,
    brokerIds: BROKERS,
  },
  {
    kind: 'priced',
    screen: 'Comparison page',
    what: 'a price in the table "Za 10 let celkem" for every fund a broker sells',
    fundIds: ALL_TWINS,
    brokerIds: BROKERS,
  },
]

// Data that no rev. 4 screen shows. Optional in the data model, verified where we
// have it. (VTI, SCHD and VWCE were removed with note 0036; the unverified unused
// fields, the version 1 broker fees and the stored exchange rate with note 0066.)
export const unusedFundFields: FundField[] = [
  'indexName',
  'domicile',
  'dividendYieldPct',
  'withholdingRate',
]
export const unusedFundIds: string[] = []

export type { Broker }
