import { describe, it } from 'vitest'

// Test list for the calculator (SPEC §21, docs/METHODOLOGY.md). These are
// placeholders: the real assertions are written after David approves the list,
// and the implementation in calc.ts follows them. Golden cases come from
// docs/METHODOLOGY.md §9, computed by hand by David.

describe('calc: required by SPEC §21', () => {
  it.todo('zero costs (ter = 0, yield = 0, fx = 0) give cost 0')
  it.todo('cost doubles when monthly doubles')
  it.todo('cost grows with years (5 < 10 < 20)')
  it.todo('cost grows with TER')
  it.todo('zero deposits give cost 0')
  it.todo('no NaN or negative cost across the valid input range')
  it.todo('inputs are clamped at the boundaries')
  it.todo('rounding happens once; internal values are not rounded')
  it.todo('golden case G1 (docs/METHODOLOGY.md §9)')
  it.todo('golden case G2 (docs/METHODOLOGY.md §9)')
  it.todo('golden case G3 (docs/METHODOLOGY.md §9)')
})

describe('calc: formula', () => {
  it.todo('closed-form annuity matches a month-by-month loop')
  it.todo('grossReturn = 0 uses the sum of deposits (no division by zero)')
  it.todo('cost equals FV_gross - FV_net before rounding')
})

describe('calc: FX fee', () => {
  it.todo('absent fxFeePct switches the FX component off and reports it')
  it.todo('FX cost scales linearly with the fee')
})

describe('calc: breakdown', () => {
  it.todo('displayed parts add up to the displayed total, for many inputs')
  it.todo('the largest part takes the rounding remainder')
  it.todo('each part is zero when its cost is zero')
  it.todo('parts follow the order TER, FX, withholding')
})

describe('calc: input handling', () => {
  it.todo('years outside 5/10/20 go to the nearest, ties to the smaller')
  it.todo('monthly is clamped to 0..20 000 and rounded to whole Kč')
  it.todo('grossReturn is clamped to 0..12')
  it.todo('NaN and Infinity fall back to the default')
})

describe('calc: gap versus cheapest in the same index group', () => {
  it.todo('the cheapest fund has gap 0')
  it.todo('the other twin has gap equal to the difference of the two costs')
  it.todo('a fund alone in its index group has no gap')
})
