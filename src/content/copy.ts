// All user-facing Czech text (SPEC §25, decision note 0002). The calculator
// strings are the wireframe's working copy (decision note 0017). Typography
// (non-breaking spaces) is applied at render time with nbsp(); a one-letter word
// at the very end of a string gets its non-breaking space written in here.

export const copy = {
  // Page frame: source bar, header, footer (wireframe B, sections 0, 1 and 8).
  shell: {
    sourceBar: (date: string) =>
      `Čísla ze stránek fondů a brokerů · ověřeno k ${date}`,
    sourceBarNoDate: 'Čísla ze stránek fondů a brokerů',
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
  // Both heroes have the rev. 4 headline; they differ by layout: variant a is
  // the calculator-first hero (ad A), b the table-first hero (ad B).
  hero: {
    a: {
      headline: 'Americké indexy z Česka: u koho je koupíte a za kolik?',
      sub: 'Zjistěte to za 20 sekund. Zdarma, bez registrace.',
      // The start button under the inputs (phones only) and the line under it.
      cta: 'Ukázat, kolik mě to bude stát',
      note: 'Příklad výpočtu. Investování nese riziko ztráty.',
    },
    b: {
      headline: 'Americké indexy z Česka: u koho je koupíte a za kolik?',
      lead: 'Stejné firmy ze S&P 500 a Nasdaq 100, jen v evropské verzi. Ukážeme, u koho je koupíte a za kolik.',
      cta: 'Spočítat, kolik mě to bude stát',
      // Under the button: goes to the e-mail form (the comparison is behind it).
      compareLink: 'nebo rovnou srovnání brokerů',
      // The one use of "ETF" on the page (SPEC §25 rule 2).
      // The second sentence is shown only when the data supports it.
      callout: {
        term: 'ETF',
        text: ' je fond, který jen kopíruje trh.',
        originals: (tickers: string) =>
          ` Americké fondy (${tickers}) u většiny brokerů z Česka nekoupíte, evropské verze stejných indexů ano.`,
      },
      table: {
        caption: 'Cena fondů',
        columns: {
          what: 'Co koupíte',
          fee: 'Roční poplatek',
          type: 'Typ',
        },
        source: (date: string) =>
          `zdroj: stránky fondů a brokerů · ověřeno k ${date}`,
        feeUnknown: '[ověřit]',
        // Acc: the fund reinvests its income; Dist: it pays it out.
        type: {
          accumulating: 'Acc',
          distributing: 'Dist',
          unverified: '[ověřit]',
        },
        // A row's plainName comes first; the technical name, ticker and manager
        // follow (SPEC §25 rule 3, decision note 0026). The rows follow the funds
        // in data/etfs.json by id; the manager is in the fund's name there.
        rows: {
          cspx: {
            plainName: 'Evropský fond na 500 největších firem',
            detail: 'odborně S&P 500, značka CSPX, správce iShares',
          },
          vuaa: {
            plainName: 'Evropský fond na 500 největších firem',
            detail: 'odborně S&P 500, značka VUAA, správce Vanguard',
          },
          cndx: {
            plainName: 'Evropský fond na 100 technologických firem',
            detail: 'odborně Nasdaq 100, značka CNDX, správce iShares',
          },
          eqqq: {
            plainName: 'Evropský fond na 100 technologických firem',
            detail: 'odborně Nasdaq 100, značka EQQQ, správce Invesco',
          },
        },
      },
      // The muted line under the table. Chosen from the data, so it never says
      // more than the data shows. The tickers come in as parameters from the data.
      note: {
        sellers: (ticker: string, names: string, date: string) =>
          `${ticker}: ${names} (ověřeno k ${date}).`,
        sellersNoDate: (ticker: string, names: string) =>
          `${ticker}: ${names}.`,
        noSellers: (ticker: string) =>
          `U kterých brokerů koupíte ${ticker}, zatím ověřujeme.`,
        others: 'U ostatních fondů a brokerů ověřujeme.',
        originalsMostlyNo: (tickers: string) =>
          `Americké ${tickers} u většiny brokerů nekoupíte.`,
        originalsChecking: (tickers: string) =>
          `U amerických ${tickers} zatím ověřujeme, kde je koupíte.`,
      },
    },
  },
  // "Za co platíte, aniž to vidíte": three plain cards. No figures here, on
  // purpose: every number on the page comes from the data (SPEC §18).
  hiddenCosts: {
    heading: 'Za co platíte, aniž to vidíte',
    cards: [
      {
        title: 'Roční poplatek fondu',
        text: 'Fond si každý rok vezme malé procento z vašich peněz. Nikdo vám za to nepošle fakturu.',
      },
      {
        title: 'Převod korun',
        text: 'Když fond nebo broker účtuje v cizí měně, platí se za převod z korun.',
      },
      {
        title: 'Daň ze zisků',
        text: 'Část vyplacených zisků si stáhne zahraničí dřív, než se k vám dostanou.',
      },
    ],
  },
  // "Co dostanete e-mailem": what the e-mail leads to, with two drawn previews.
  emailPreview: {
    label: 'Co dostanete e-mailem',
    heading: 'Fondy, brokeři a co z toho koupíte z Česka',
    text: 'Otevře se hned po odeslání, nemusíte nic stahovat. U každého čísla uvádíme odkud je a z jakého měsíce.',
    cta: 'Poslat mi srovnání',
    pages: {
      comparison: 'Strana 1 · Srovnání',
      tax: 'Strana 4 · Daně',
    },
  },
  // The e-mail form under the result (wireframe B, "E-mail form" and "Form errors").
  leadForm: {
    heading: 'Chcete vidět, kde který fond koupíte?',
    emailLabel: 'Váš e-mail',
    emailPlaceholder: 'jmeno@domena.cz',
    send: 'Poslat mi srovnání',
    sending: 'Posílám…',
    retry: 'Zkusit znovu',
    invalid: 'Zadejte e-mail ve tvaru jmeno@domena.cz.',
    failure: {
      strong: 'Odeslání se nepovedlo.',
      text: ' Zkuste to prosím znovu za chvíli. Váš e-mail i nastavení kalkulačky zůstaly vyplněné.',
    },
    legal: (controller: string) =>
      `Pošleme vám srovnání. Správce: ${controller}. Zásady zpracování osobních údajů.`,
    tips: 'Chci občas dostat tip k investování (nepovinné)',
    // Before Phase 4 nothing is stored or sent, and the page says so.
    notice: 'Zkušební provoz: váš e-mail jsme nikam neuložili ani neodeslali.',
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
