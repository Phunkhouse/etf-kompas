// All user-facing Czech text (SPEC §25, decision note 0002). The calculator
// strings are the wireframe's working copy (decision note 0017). Typography
// (non-breaking spaces) is applied at render time with nbsp(); a one-letter word
// at the very end of a string gets its non-breaking space written in here.

export const copy = {
  // Page frame: source bar, header, footer (wireframe B, sections 0, 1 and 8).
  shell: {
    sourceBar: (date: string) =>
      `Čísla z oficiálních stránek fondů · aktualizováno ${date}`,
    sourceBarNoDate: 'Čísla z oficiálních stránek fondů',
    riskShort: 'Investování nese riziko ztráty.',
    nav: {
      label: 'Hlavní nabídka',
      method: 'Jak počítáme',
      sources: 'Odkud máme čísla',
      faq: 'Časté dotazy',
    },
    cta: 'Poslat mi srovnání',
    footer: {
      risk: 'Investování nese riziko ztráty. Minulé výnosy nezaručují budoucí. Obsah je obecná informace, ne investiční ani daňové poradenství.',
      controller: (controller: string) => `Správce: ${controller}`,
      privacy: 'Zásady zpracování',
      cookies: 'Cookies',
      // Draft for David's copy review (SPEC §17.15).
      testNotice:
        'Zkušební projekt vytvořený jako ukázka. Není to nabídka investiční služby.',
    },
  },
  // Hero headlines: variant a is the calculator-first hero (ad A), b the
  // table-first hero (ad B). The rest of each hero comes with the hero PR.
  hero: {
    a: { headline: 'Kolik z vašich peněz sní poplatky fondu?' },
    b: { headline: 'Americký, nebo evropský fond? Co vás stojí víc?' },
  },
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
