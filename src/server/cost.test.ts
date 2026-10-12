import { describe, it } from 'vitest'

// Version 2 of the calculator (docs/METHODOLOGY-V2.md, draft). The cases are
// listed first and wait for David's approval (CLAUDE.md, risky logic). They are
// `it.todo` so that CI stays green until the implementation follows.

describe('annuity maths (unchanged from version 1)', () => {
  it.todo(
    'the closed form equals a month-by-month loop for several rates and horizons',
  )
  it.todo('at a return of 0 the annuity factor is 12 x years')
  it.todo('a monthly amount of 0 gives a cost of 0')
})

describe('the three parts', () => {
  it.todo('the displayed parts add up to the displayed total, always')
  it.todo('the parts come in the order fund fee, conversion, broker fees')
  it.todo(
    'the largest part absorbs the rounding remainder; a tie goes to the first',
  )
  it.todo('with no conversion fee and no broker fees only the fund fee is left')
  it.todo('every part is zero or more when every fee is zero or more')
  it.todo(
    'the illustrative value plus the cost equals the value without any costs',
  )
})

describe('broker purchase fee', () => {
  it.todo('a fixed fee in Kč is charged once a month')
  it.todo('a fixed fee in euro or dollar is converted at the given rate')
  it.todo('a percent fee is taken from the deposit')
  it.todo('the minimum applies when the percent fee is smaller')
  it.todo('the maximum applies when the fee is larger')
  it.todo(
    'with neither a minimum nor a maximum the fee is just fixed plus percent',
  )
  it.todo(
    'the first rule whose venues contain the listing venue is used; a rule with no venues matches any',
  )
  it.todo('a fee larger than the deposit invests nothing and does not throw')
})

describe('broker custody fee', () => {
  it.todo('an annual fixed fee is spread evenly over twelve months')
  it.todo('an annual percent fee lowers the return like the fund fee')
  it.todo('with no custody fee only the purchase fee is left')
})

describe('conversion', () => {
  it.todo('a CZK listing pays no conversion fee')
  it.todo(
    'a USD listing uses the USD fee and a EUR listing the EUR fee of the same broker',
  )
  it.todo('a euro fee of 0 (as at DEGIRO) gives no conversion cost')
})

describe('clamping and units', () => {
  it.todo('a monthly amount above 20 000 is treated as 20 000')
  it.todo('years snap to 5, 10 or 20, a tie to the smaller')
  it.todo('the gross return is clamped to 0 to 12')
  it.todo(
    'fees are plain percent numbers: 0.07 means 0,07 %, and 0.0007 is rejected as a fraction',
  )
  it.todo('the total and the parts are whole Kč')
})

describe('which brokers have a price', () => {
  it.todo(
    'a broker is priced only when availability, listing and every needed fee are verified',
  )
  it.todo('a value without a source or evidence does not count as verified')
  it.todo('a fund the broker does not sell has no price')
  it.todo(
    'the spread is the highest cost minus the lowest among priced brokers',
  )
  it.todo('the spread is null with fewer than two priced brokers')
  it.todo('the spread is null when it rounds to 0 Kč')
  it.todo('the order of the brokers in the result does not depend on price')
})

describe('the data model for broker fees', () => {
  it.todo(
    'accepts a purchase rule, a custody fee, a listing and an exchange rate as sourced records',
  )
  it.todo(
    'rejects negative fees, an unknown currency and a rule with min above max',
  )
  it.todo(
    'the real data files give a price only for brokers whose values are all verified',
  )
})

describe('golden cases (docs/METHODOLOGY-V2.md section 7, computed by David)', () => {
  it.todo('G1: r = 0, conversion only: 2 400 Kč')
  it.todo('G2: fund fee only: 1 672 Kč')
  it.todo('G3: all three parts')
  it.todo('G4: the minimum of a percent fee')
  it.todo('G5: fixed fees in dollars, converted')
})
