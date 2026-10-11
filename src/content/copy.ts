// All user-facing Czech text (SPEC §25, decision note 0002). The calculator
// strings are the wireframe's working copy (decision note 0017). Typography
// (non-breaking spaces) is applied at render time with nbsp(); a one-letter word
// at the very end of a string gets its non-breaking space written in here.

export const copy = {
  calculator: {
    heading: 'Kolik to u vás dělá?',
    monthlyLabel: 'Kolik měsíčně uložíte',
    horizonLabel: 'Na jak dlouho',
    years: (years: number) => `${years} let`,
    resultMore: (years: number) =>
      `Za ${years} let u amerického fondu zaplatíte víc o`,
    resultLess: (years: number) =>
      `Za ${years} let u amerického fondu zaplatíte méně o`,
    resultSame: (years: number) => `Za ${years} let je rozdíl mezi oběma fondy`,
    total: (amount: string) =>
      `U amerického fondu zaplatíte celkem ${amount}. Z toho jde na:`,
    parts: {
      ter: 'roční poplatek fondu',
      fx: 'převod korun na dolary',
      withholding: 'daň, kterou stáhne USA',
    },
    fxOff: 'Převod korun na dolary zatím nepočítáme.',
    assumption: (returnText: string) =>
      `Počítáme s výnosem ${returnText} ročně u obou fondů. Je to příklad, ne slib.`,
  },
}
