// What each screen of the rev. 4 wireframes needs from the data (docs/design/
// wireframe-b.md, decision note 0035). `pnpm data:gaps` checks this list against
// data/*.json. A value counts only with a source and evidence.
import type { Broker, Etf } from './schema'

export type FundField = Exclude<
  keyof Etf,
  'id' | 'ticker' | 'region' | 'indexGroup'
>
export type BrokerField = 'fxFeePct' | 'custodyFeePct' | 'czSupport'

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
    what: 'the line "Americké VOO a QQQ u většiny brokerů nekoupíte"',
    fundIds: ORIGINALS,
    brokerIds: BROKERS,
  },
  {
    kind: 'fund',
    screen: 'Calculator',
    what: 'annual fee of the fund the result is about (CSPX)',
    fundIds: ['cspx'],
    fields: ['ter'],
  },
  {
    kind: 'broker',
    screen: 'Calculator',
    what: 'conversion fee and custody fee of every broker (the "poplatky brokera" and "převod korun" parts)',
    brokerIds: BROKERS,
    fields: ['fxFeePct', 'custodyFeePct'],
  },
  {
    kind: 'planned',
    screen: 'Calculator',
    what: 'purchase commission of every broker, as a rule that can be calculated for one monthly purchase',
    field: 'purchase commission rule',
    count: BROKERS.length,
  },
  {
    kind: 'planned',
    screen: 'Calculator',
    what: 'the listing (USD or EUR) in which each broker sells the fund: decides whether a conversion is paid',
    field: 'listing currency of CSPX per broker',
    count: BROKERS.length,
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
    kind: 'planned',
    screen: 'Comparison page',
    what: 'the listing (USD or EUR) per fund and broker, for "Za 10 let celkem"',
    field: 'listing currency per fund and broker',
    count: ALL_TWINS.length * BROKERS.length,
  },
]

// Data that no rev. 4 screen shows. Not worth verifying now.
export const unusedFundFields: FundField[] = [
  'fundSizeEur',
  'return5yPct',
  'return10yPct',
  'dividendYieldPct',
  'withholdingRate',
  'replication',
]
export const unusedFundIds = ['vti', 'schd', 'vwce']

export type { Broker }
