// All user-facing Czech text (SPEC §25, decision note 0002). The calculator
// strings are the wireframe's working copy (decision note 0017). Typography
// (non-breaking spaces) is applied at render time with nbsp(); a one-letter word
// at the very end of a string gets its non-breaking space written in here.

export const copy = {
  // Page frame: source bar, header, footer (wireframe B, sections 0, 1 and 8).
  shell: {
    sourceBar: (date: string) =>
      `Čísla ze stránek fondů a firem · ověřeno k ${date}`,
    sourceBarNoDate: 'Čísla ze stránek fondů a firem',
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
    a: { headline: 'Které fondy si z Česka opravdu koupíte?' },
    b: {
      headline: 'Které fondy si z Česka opravdu koupíte a kolik vás stojí?',
      lead: 'Stejný index často koupíte z Česka jen v evropské verzi. Ukážeme vám, kterou, u koho a za kolik.',
      cta: 'Spočítat, kolik zaplatím',
      // The one use of "ETF" on the page (SPEC §25 rule 2).
      callout: {
        term: 'ETF',
        text: ' je fond, který jen kopíruje trh. Nemá drahé správce, a proto je levný.',
      },
      table: {
        caption: 'Cena a dostupnost',
        columns: {
          what: 'Co koupíte',
          fee: 'Roční poplatek',
          buyable: 'Koupíte z ČR?',
        },
        source: (date: string) =>
          `zdroj: stránky fondů a firem · ověřeno k ${date}`,
        feeUnknown: '[ověřit]',
        pill: { yes: 'Ano', no: 'Ne', unverified: '[ověřit]' },
        // Shown under the amber pill: how many firms are verified as not selling it.
        verifiedNo: (count: number, total: number) =>
          `Ne u ${count} z ${total} firem`,
        // A row's plainName comes first; the technical name and ticker follow
        // (SPEC §25 rule 3, decision note 0026). The rows follow the funds in
        // data/etfs.json by id.
        rows: {
          voo: {
            plainName: 'Americký fond na 500 největších firem',
            detail: 'odborně S&P 500, značka VOO',
            inSentence: 'americký fond na 500 největších firem (VOO)',
          },
          qqq: {
            plainName: 'Americký fond na 100 technologických firem',
            detail: 'odborně Nasdaq 100, značka QQQ',
            inSentence: 'americký fond na 100 technologických firem (QQQ)',
          },
          cspx: {
            plainName: 'Evropská verze prvního fondu',
            detail: 'stejných 500 firem, značka CSPX, sídlí v Evropě',
            inSentence: 'evropská verze prvního fondu (CSPX)',
          },
        },
      },
      // One text for every screen width. It is chosen from the data, so it
      // cannot say something that the table no longer shows.
      footnote: {
        none: 'Jen cena a dostupnost, ne výnosy.',
        highlighted:
          'Zvýrazněno je to, co koupíte z ČR. Jen cena a dostupnost, ne výnosy.',
        notCheapest: (lowest: string, verifiedNo: number, total: number) =>
          `Zvýrazněno je to, co koupíte z ČR, ne to nejlevnější. Nejnižší poplatek má ${lowest}, ale u ${verifiedNo} z ${total} firem ho nekoupíte. Jen cena a dostupnost, ne výnosy.`,
        notCheapestNowhere: (lowest: string, total: number) =>
          `Zvýrazněno je to, co koupíte z ČR, ne to nejlevnější. Nejnižší poplatek má ${lowest}, ale u žádné z ${total} firem ho nekoupíte. Jen cena a dostupnost, ne výnosy.`,
        notCheapestUnchecked: (lowest: string) =>
          `Zvýrazněno je to, co koupíte z ČR, ne to nejlevnější. Nejnižší poplatek má ${lowest}, kde ho koupíte, zatím ověřujeme. Jen cena a dostupnost, ne výnosy.`,
      },
    },
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
    // Under the result while the American fund is the cheaper one (wireframe
    // revision 2, section 3). Chosen from the data, like the hero footnote.
    cheaperNote: {
      unverified: (verifiedNo: number, total: number) =>
        `Je americký fond levnější, uvidíte „méně o“. Z Česka ho ale zatím nekoupíte u ${verifiedNo} z ${total} firem, u ostatních to ověřujeme.`,
      unchecked:
        'Je americký fond levnější, uvidíte „méně o“. U kterých firem ho z Česka koupíte, zatím ověřujeme.',
      nowhere: (total: number) =>
        `Je americký fond levnější, uvidíte „méně o“. Z Česka ho ale nekoupíte u žádné z ${total} firem.`,
    },
    assumption: (returnText: string) =>
      `Počítáme s výnosem ${returnText} ročně u obou fondů. Je to příklad, ne slib.`,
  },
}
