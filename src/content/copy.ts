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
      headline: 'Americké indexy z Česka: u koho je koupíte a za kolik?',
      lead: 'Stejné firmy ze S&P 500 a Nasdaq 100, jen v evropské verzi. Ukážeme, u koho je koupíte a za kolik.',
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
    heading: 'Kolik vás to bude stát?',
    monthlyLabel: 'Kolik měsíčně uložíte',
    horizonLabel: 'Na jak dlouho',
    years: (years: number) => `${years} let`,
    // The dearest of the brokers with verified prices (note 0037).
    total: (years: number, ticker: string, amount: string) =>
      `Za ${years} let vás koupitelný fond (${ticker}) u ověřených brokerů bude stát nejvýš ${amount}. Z toho jde na:`,
    // Only the fund fee is known while no broker has verified prices.
    fundOnly: (years: number, ticker: string, amount: string) =>
      `Za ${years} let vás poplatek fondu (${ticker}) bude stát ${amount}.`,
    fundOnlyNote:
      'Ceny brokerů ověřujeme, proto zatím ukazujeme jen poplatek fondu.',
    parts: {
      fund: 'roční poplatek fondu',
      fx: 'převod korun na cizí měnu',
      broker: 'poplatky brokera',
    },
    illustrative: (years: number, value: string, fees: string, rate: string) =>
      `Ilustrativní hodnota po ${years} letech: ${value}, z toho poplatky ${fees} · ${rate} ročně, příklad, ne slib.`,
    assumption: (rate: string) =>
      `Počítáme s výnosem ${rate} ročně. Je to příklad, ne slib. Nepočítáme české daně ani inflaci.`,
    saving: {
      lead: 'Při vašem nastavení',
      text: (amount: string) =>
        `Správným brokerem si u stejného fondu ponecháte až ${amount}`,
      note: 'Odhad, bez českých daní a inflace.',
      button: 'Ukázat, u kterého brokera to koupím',
    },
    failure: {
      text: 'Částku teď nespočítáme, aby nebyla nepřesná',
      retry: 'Zkusit znovu',
    },
  },
}
