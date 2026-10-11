import { describe, expect, it } from 'vitest'
import { calcComparison, calcCost, type CalcFund, type CalcInput } from './calc'

// Test cases for docs/METHODOLOGY.md. Fund numbers are invented test values,
// not real fund data. Golden cases G1 to G3 were computed by hand by David
// (METHODOLOGY §9) and are copied here unchanged.

const fund = (over: Partial<CalcFund> = {}): CalcFund => ({
  id: 'test',
  indexGroup: 'test-group',
  ter: 0.5,
  dividendYieldPct: 2,
  withholdingRate: 15,
  ...over,
})

const input = (over: Partial<CalcInput> = {}): CalcInput => ({
  monthly: 3000,
  years: 10,
  grossReturn: 6,
  fxFeePct: 0.5,
  ...over,
})

const NO_COSTS = { ter: 0, dividendYieldPct: 0, withholdingRate: 0 }

// Independent month-by-month version of the formulas, to cross-check the
// closed form in calc.ts. Returns the unrounded cost.
function loopCost(i: Required<CalcInput>, f: CalcFund): number {
  const monthly = (r: number) => (1 + r) ** (1 / 12) - 1
  const grow = (deposit: number, r: number) => {
    let balance = 0
    for (let k = 0; k < i.years * 12; k++) {
      balance = balance * (1 + monthly(r)) + deposit
    }
    return balance
  }
  const g = i.grossReturn / 100
  const net =
    g - f.ter / 100 - (f.dividendYieldPct / 100) * (f.withholdingRate / 100)
  return grow(i.monthly, g) - grow(i.monthly * (1 - i.fxFeePct / 100), net)
}

describe('calcCost: golden cases (docs/METHODOLOGY.md §9)', () => {
  it('G1: r = 0, FX only, 2 000 Kč for 10 years', () => {
    const r = calcCost(
      input({ monthly: 2000, grossReturn: 0, fxFeePct: 1 }),
      fund(NO_COSTS),
    )
    expect(r.totalKc).toBe(2400)
    expect(r.parts).toEqual({ ter: 0, fx: 2400, withholding: 0 })
    expect(r.fxApplied).toBe(true)
  })

  it('G2: TER only, FX off, 1 000 Kč for 5 years', () => {
    const r = calcCost(
      input({ monthly: 1000, years: 5, fxFeePct: undefined }),
      fund({ ter: 1, dividendYieldPct: 0, withholdingRate: 0 }),
    )
    expect(r.totalKc).toBe(1672)
    expect(r.parts).toEqual({ ter: 1672, fx: 0, withholding: 0 })
    expect(r.fxApplied).toBe(false)
  })

  it('G3: all three costs, remainder goes to the largest part (TER)', () => {
    const r = calcCost(input(), fund())
    expect(r.totalKc).toBe(21913)
    expect(r.parts).toEqual({ ter: 12337, fx: 2375, withholding: 7201 })
  })
})

describe('calcCost: required by SPEC §21', () => {
  it('zero costs give cost 0', () => {
    const r = calcCost(input({ fxFeePct: 0 }), fund(NO_COSTS))
    expect(r.totalKc).toBe(0)
    expect(r.parts).toEqual({ ter: 0, fx: 0, withholding: 0 })
  })

  it('cost doubles when monthly doubles (within 1 Kč of rounding)', () => {
    const one = calcCost(input({ monthly: 4000 }), fund()).totalKc
    const two = calcCost(input({ monthly: 8000 }), fund()).totalKc
    expect(Math.abs(two - 2 * one)).toBeLessThanOrEqual(1)
  })

  it('cost grows with years', () => {
    const cost = (years: number) => calcCost(input({ years }), fund()).totalKc
    expect(cost(5)).toBeLessThan(cost(10))
    expect(cost(10)).toBeLessThan(cost(20))
  })

  it('cost grows with TER', () => {
    const cost = (ter: number) => calcCost(input(), fund({ ter })).totalKc
    expect(cost(0.1)).toBeLessThan(cost(0.5))
    expect(cost(0.5)).toBeLessThan(cost(1.5))
  })

  it('zero deposits give cost 0', () => {
    const r = calcCost(input({ monthly: 0 }), fund())
    expect(r.totalKc).toBe(0)
    expect(r.parts).toEqual({ ter: 0, fx: 0, withholding: 0 })
  })

  it('never returns NaN or a negative number for any valid input', () => {
    for (const monthly of [0, 500, 3000, 20000])
      for (const years of [5, 10, 20])
        for (const grossReturn of [0, 6, 12])
          for (const ter of [0, 0.07, 1, 2])
            for (const fxFeePct of [undefined, 0, 0.5, 3]) {
              const r = calcCost(
                input({ monthly, years, grossReturn, fxFeePct }),
                fund({ ter }),
              )
              for (const v of [r.totalKc, ...Object.values(r.parts)]) {
                expect(Number.isInteger(v)).toBe(true)
                expect(v).toBeGreaterThanOrEqual(0)
              }
            }
  })

  it('rounds once: the total equals the rounded unrounded cost', () => {
    for (const monthly of [500, 1234, 3000, 9999, 20000])
      for (const years of [5, 10, 20]) {
        const i = { monthly, years, grossReturn: 6, fxFeePct: 0.5 }
        expect(calcCost(i, fund()).totalKc).toBe(
          Math.round(loopCost(i, fund())),
        )
      }
  })
})

describe('calcCost: formula', () => {
  it('closed form matches a month-by-month loop', () => {
    for (const grossReturn of [0, 3, 6, 12])
      for (const years of [5, 20]) {
        const i = { monthly: 7500, years, grossReturn, fxFeePct: 1 }
        expect(
          Math.abs(calcCost(i, fund()).totalKc - loopCost(i, fund())),
        ).toBeLessThanOrEqual(0.5)
      }
  })

  it('grossReturn = 0 works without dividing by zero', () => {
    const r = calcCost(input({ grossReturn: 0, fxFeePct: 1 }), fund(NO_COSTS))
    expect(r.totalKc).toBe(3600)
  })
})

describe('calcCost: FX fee', () => {
  it('absent fee switches FX off and says so', () => {
    const off = calcCost(input({ fxFeePct: undefined }), fund())
    const zero = calcCost(input({ fxFeePct: 0 }), fund())
    expect(off.fxApplied).toBe(false)
    expect(off.parts.fx).toBe(0)
    expect(zero.fxApplied).toBe(true)
    expect(off.totalKc).toBe(zero.totalKc)
  })

  it('FX part scales linearly with the fee (within 1 Kč)', () => {
    const f = fund(NO_COSTS)
    const one = calcCost(input({ fxFeePct: 1 }), f).parts.fx
    const two = calcCost(input({ fxFeePct: 2 }), f).parts.fx
    expect(Math.abs(two - 2 * one)).toBeLessThanOrEqual(1)
  })
})

describe('calcCost: breakdown', () => {
  it('displayed parts add up to the displayed total, for many inputs', () => {
    for (const monthly of [500, 1234, 3000, 9999, 20000])
      for (const years of [5, 10, 20])
        for (const ter of [0.03, 0.07, 0.5, 1.2]) {
          const r = calcCost(
            input({ monthly, years }),
            fund({ ter, dividendYieldPct: 1.3 }),
          )
          const { ter: a, fx: b, withholding: c } = r.parts
          expect(a + b + c).toBe(r.totalKc)
        }
  })

  it('a part is zero when its own cost is zero', () => {
    expect(calcCost(input(), fund({ ter: 0 })).parts.ter).toBe(0)
    expect(
      calcCost(input(), fund({ dividendYieldPct: 0 })).parts.withholding,
    ).toBe(0)
    expect(
      calcCost(input(), fund({ withholdingRate: 0 })).parts.withholding,
    ).toBe(0)
    expect(calcCost(input({ fxFeePct: undefined }), fund()).parts.fx).toBe(0)
  })
})

describe('calcCost: input handling', () => {
  const total = (over: Partial<CalcInput>) =>
    calcCost(input(over), fund()).totalKc

  it('monthly is rounded to whole Kč and clamped to 0..20 000', () => {
    expect(total({ monthly: 50000 })).toBe(total({ monthly: 20000 }))
    expect(total({ monthly: -5 })).toBe(0)
    expect(total({ monthly: 1000.4 })).toBe(total({ monthly: 1000 }))
  })

  it('years outside 5/10/20 go to the nearest, ties to the smaller', () => {
    expect(total({ years: 7 })).toBe(total({ years: 5 }))
    expect(total({ years: 8 })).toBe(total({ years: 10 }))
    expect(total({ years: 7.5 })).toBe(total({ years: 5 }))
    expect(total({ years: 15 })).toBe(total({ years: 10 }))
    expect(total({ years: 100 })).toBe(total({ years: 20 }))
    expect(total({ years: 1 })).toBe(total({ years: 5 }))
  })

  it('grossReturn is clamped to 0..12', () => {
    expect(total({ grossReturn: 20 })).toBe(total({ grossReturn: 12 }))
    expect(total({ grossReturn: -3 })).toBe(total({ grossReturn: 0 }))
  })

  it('NaN and Infinity fall back to the defaults (3 000, 10, 6)', () => {
    expect(total({ monthly: NaN })).toBe(total({ monthly: 3000 }))
    expect(total({ years: NaN })).toBe(total({ years: 10 }))
    expect(total({ grossReturn: Infinity })).toBe(total({ grossReturn: 6 }))
  })

  it('grossReturn defaults to 6 when omitted', () => {
    const rest: CalcInput = { monthly: 3000, years: 10, fxFeePct: 0.5 }
    expect(calcCost(rest, fund()).totalKc).toBe(total({ grossReturn: 6 }))
  })
})

describe('calcComparison: gap versus cheapest in the same index group', () => {
  const funds = [
    fund({ id: 'dear', indexGroup: 'sp', ter: 0.5 }),
    fund({ id: 'cheap', indexGroup: 'sp', ter: 0.05 }),
    fund({ id: 'alone', indexGroup: 'solo', ter: 0.3 }),
  ]
  const rows = calcComparison(input(), funds)
  const row = (id: string) => rows.find((r) => r.id === id)!

  it('the cheapest fund in a group has gap 0', () => {
    expect(row('cheap').gapKc).toBe(0)
  })

  it('the other twin has the difference of the two displayed totals', () => {
    expect(row('dear').gapKc).toBe(row('dear').totalKc - row('cheap').totalKc)
    expect(row('dear').gapKc).toBeGreaterThan(0)
  })

  it('a fund alone in its index group has no gap', () => {
    expect(row('alone').gapKc).toBeNull()
  })

  it('rows carry the same numbers as calcCost', () => {
    expect(row('dear').totalKc).toBe(calcCost(input(), funds[0]).totalKc)
    expect(row('dear').parts).toEqual(calcCost(input(), funds[0]).parts)
  })

  it('funds with equal cost both get gap 0', () => {
    const twins = calcComparison(input(), [
      fund({ id: 'a', indexGroup: 'g' }),
      fund({ id: 'b', indexGroup: 'g' }),
    ])
    expect(twins.map((t) => t.gapKc)).toEqual([0, 0])
  })
})
