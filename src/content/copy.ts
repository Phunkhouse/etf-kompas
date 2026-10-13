// All user-facing Czech text (SPEC §25, decision note 0002). The calculator
// strings are the wireframe's working copy (decision note 0017). Typography
// (non-breaking spaces) is applied at render time with nbsp(); a one-letter word
// at the very end of a string gets its non-breaking space written in here.

// Page frame: source bar, header, footer (wireframe B, sections 0, 1 and 8).
export const shellCopy = {
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
    navLabel: 'Patička',
    method: 'Jak počítáme',
    privacy: 'Zásady zpracování',
    cookies: 'Cookies',
    contact: 'Kontakt',
    // Draft for David's copy review (SPEC §17.15).
    testNotice:
      'Zkušební projekt vytvořený jako ukázka. Není to nabídka investiční služby.',
  },
}

// Both heroes have the rev. 4 headline; they differ by layout: variant a is
// the calculator-first hero (ad A), b the table-first hero (ad B).
export const heroCopy = {
  // One layout for both A/B variants (note 0041): they differ only in the h1.
  // The b headline names the saving between brokers at the starting setting.
  headline: {
    a: 'Americké indexy z Česka: u koho je koupíte a za kolik?',
    // The amount comes between the two parts, in its own element (in red).
    b: {
      before: 'U stejného fondu můžete zbytečně zaplatit až ',
      after: '. Kde?',
    },
  },
  lead: 'Stejné firmy ze S&P 500 a Nasdaq 100, jen v evropské verzi. Ukážeme, u koho je koupíte a za kolik.',
  cta: 'Spočítat, kolik mě to bude stát',
  // Under the button: no account, no price (decided 2026-10-13, before the 5-second test).
  ctaNote: 'Zdarma, bez registrace',
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
      fee: 'Poplatek*',
      type: 'Typ',
    },
    source: (date: string) =>
      `zdroj: stránky fondů a brokerů · ověřeno k ${date}`,
    // Explains the asterisk of the fee column.
    feeFootnote: '* Roční poplatek fondu, počítaný z vašich peněz ve fondu.',
    feeUnknown: '[ověřit]',
    // Acc: the fund reinvests its income; Dist: it pays it out.
    type: {
      accumulating: 'Acc',
      distributing: 'Dist',
      unverified: '[ověřit]',
    },
    // A row's plainName is the index (S&P 500, Nasdaq 100); the manager, ticker
    // and a plain description follow in the detail (decision note 0043). The rows follow the funds
    // in data/etfs.json by id; the manager is in the fund's name there.
    rows: {
      cspx: {
        plainName: 'S&P 500',
        detail: 'iShares CSPX, 500 největších firem',
      },
      vuaa: {
        plainName: 'S&P 500',
        detail: 'Vanguard VUAA, 500 největších firem',
      },
      cndx: {
        plainName: 'Nasdaq 100',
        detail: 'iShares CNDX, 100 technologických firem',
      },
      eqqq: {
        plainName: 'Nasdaq 100',
        detail: 'Invesco EQQQ, 100 technologických firem',
      },
    },
  },
  // The short line under the table and the note under the callout. Chosen from the
  // data, so they never say more than the data shows. The ticker and the numbers
  // come in as parameters. The American funds are explained by the callout alone.
  note: {
    // "CSPX: 5 známých brokerů" (Czech plural: 1 broker, 2 to 4 brokeři, 5 brokerů)
    known: (ticker: string, count: number) =>
      `${ticker}: ${count} ${
        count === 1
          ? 'známý broker'
          : count >= 2 && count <= 4
            ? 'známí brokeři'
            : 'známých brokerů'
      }`,
    verifiedOn: (date: string) => `ověřeno k ${date}`,
    noSellers: (ticker: string) =>
      `U kterých brokerů koupíte ${ticker}, zatím ověřujeme.`,
    // After the short line on wide screens (a phone has it in the note instead).
    priceOnlyShort: 'jen cena a dostupnost, ne výnosy',
    // The note under the callout, on a phone: who the brokers are.
    names: (names: string) => `Brokeři: ${names}.`,
    // The page shows no returns (note 0039).
    priceOnly: 'Jen cena a dostupnost, ne výnosy.',
    // Variant b: which setting the amount in the headline is for.
    headlineSetting: (monthly: string, years: number) =>
      `Částka v nadpisu: ${monthly} měsíčně, ${years} let, odhad bez českých daní a inflace.`,
  },
}

// "Proč nám věřit": three short items. The ids are the anchors of the header
// links. No figures here; the page's numbers come from the data (SPEC §18).
export const trustBlockCopy = {
  heading: 'Proč nám věřit',
  items: [
    {
      id: 'odkud-mame-cisla',
      title: 'Odkud máme čísla',
      paragraphs: [
        'Z dokumentů fondů, ze stránek brokerů a od České národní banky. U každého čísla je datum.',
      ],
    },
    {
      id: 'jak-pocitame',
      title: 'Jak počítáme',
      paragraphs: [
        'Počítáme poplatek fondu, převod korun a poplatky brokera.',
        'Provizi brokera počítáme u každé měsíční investice zvlášť. Pevná částka za objednávku proto nejvíc zdraží malé měsíční vklady.',
        'Nepočítáme české daně, inflaci ani rozdíl mezi nákupní a prodejní cenou.',
        'Jedna investice měsíčně. Je to příklad, ne slib.',
      ],
    },
    {
      id: 'nic-neprodavame',
      title: 'Nic neprodáváme',
      paragraphs: ['Nedostáváme provize. Nejde o investiční poradenství.'],
    },
  ],
}

// "Časté dotazy". The answer about the American funds is chosen from the data.
export const faqCopy = {
  heading: 'Časté dotazy',
  questions: {
    us: 'Můžu si americký fond koupit z Česka?',
    free: 'Je to zdarma?',
    email: 'Co uděláte s mým e-mailem?',
    advice: 'Radíte mi, co koupit?',
  },
  answers: {
    free: 'Ano. Srovnání je zdarma. Nedostáváme provize a nic vám neprodáváme.',
    // No retention period: it is not decided yet (SPEC §19).
    email:
      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odkaz na odhlášení. Zatím jde o zkušební provoz: e-mail nikam neukládáme.',
    advice:
      'Ne. Ukazujeme poplatky a dostupnost. Není to investiční ani daňové poradenství. Rozhodnutí je na vás.',
    us: {
      some: (verified: number, total: number, tickers: string) =>
        `Zatím to vypadá, že ne. U ${verified} z ${total} brokerů máme ověřeno, že ${tickers} nenabízí. U ostatních ověřujeme.`,
      all: (total: number, tickers: string) =>
        `Ne. Ani jeden z ${total} ověřených brokerů ${tickers} nenabízí.`,
      none: (tickers: string) =>
        `U kterých brokerů koupíte ${tickers}, zatím ověřujeme.`,
      noFacts: 'U kterých brokerů koupíte americké fondy, zatím ověřujeme.',
      european: 'Stejné indexy koupíte v evropské verzi.',
      // From SPEC §2 ("generally cannot be bought ... because they lack a PRIIPs KID").
      reason:
        'Důvodem bývá, že americké fondy nemají evropský klíčový informační dokument (KID).',
    },
  },
}

// "Za co platíte, aniž to vidíte": three plain cards. No figures here, on
// purpose: every number on the page comes from the data (SPEC §18).
export const hiddenCostsCopy = {
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
}

// "Co dostanete e-mailem": what the e-mail leads to, with two drawn previews.
export const emailPreviewCopy = {
  label: 'Co dostanete e-mailem',
  heading: 'Fondy, brokeři a co z toho koupíte z Česka',
  text: 'Otevře se hned po odeslání, nemusíte nic stahovat. U každého čísla uvádíme odkud je a z jakého měsíce.',
  cta: 'Poslat mi srovnání',
  pages: {
    comparison: 'Strana 1 · Srovnání',
    tax: 'Strana 4 · Daně',
  },
}

// The e-mail form under the result (wireframe B, "E-mail form" and "Form errors").
export const leadFormCopy = {
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
  // The last words are a link to the privacy page.
  legalBefore: (controller: string) =>
    `Pošleme vám srovnání. Správce: ${controller}. `,
  legalLink: 'Zásady zpracování osobních údajů',
  tips: 'Chci občas dostat tip k investování (nepovinné)',
  // Before Phase 4 nothing is stored or sent, and the page says so.
  notice: 'Zkušební provoz: váš e-mail jsme nikam neuložili ani neodeslali.',
}

export const calculatorCopy = {
  heading: 'Kolik vás to bude stát?',
  monthlyLabel: 'Kolik měsíčně uložíte',
  horizonLabel: 'Na jak dlouho',
  years: (years: number) => `${years} let`,
  // The dearest of the brokers with verified prices (note 0037).
  total: (years: number, ticker: string, amount: string) =>
    `Za ${years} let vás fond (${ticker}) může u ověřených brokerů stát i ${amount}. Z toho jde na:`,
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
    // The amount follows in its own element, in green.
    textBefore: 'Správným brokerem si u stejného fondu ponecháte až ',
    note: 'Odhad, bez českých daní a inflace.',
    button: 'Ukázat, u kterého brokera to koupím',
  },
  failure: {
    text: 'Částku teď nespočítáme, aby nebyla nepřesná',
    retry: 'Zkusit znovu',
  },
}

// The privacy policy page (wireframe B, "Menu, cookies, legal, errors"). It is the
// wireframe's own text with "[doplnit]" where the text is not decided yet; it has
// not been reviewed by a qualified person (SPEC §19, note 0039). The `legal` key
// is exempt from the copy checker.
export const legalCopy = {
  privacy: {
    label: 'Právní',
    title: 'Zásady zpracování osobních údajů',
    validFrom: 'Platí od',
    contents: 'Obsah',
    sections: [
      {
        id: 'kdo-zpracovava',
        title: 'Kdo údaje zpracovává',
        text: (controller: string) =>
          `Správcem je ${controller}. Napsat nám můžete na [doplnit].`,
      },
      {
        id: 'jake-udaje',
        title: 'Jaké údaje zpracováváme',
        text: 'Váš e-mail, nastavení kalkulačky (měsíční částka a počet let) a technické údaje o návštěvě, ty jen když povolíte cookies.',
      },
      {
        id: 'proc-a-zaklad',
        title: 'Proč a na jakém základě',
        text: 'Zaslání srovnání, o které jste požádali (e-mail, nastavení). Nepovinné tipy k investování jen s vaším souhlasem. Měření a reklama jen s vaším souhlasem. Právní základ u každého účelu: [doplnit].',
      },
      {
        id: 'jak-dlouho',
        title: 'Jak dlouho',
        text: 'E-mail uchováváme do odhlášení, nejdéle [doplnit] měsíců. Souhlas můžete kdykoli odvolat, odkaz je v každém e-mailu.',
      },
      {
        id: 'komu-predavame',
        title: 'Komu údaje předáváme',
        text: 'Zpracovatelům, které potřebujeme: služba pro rozesílání e-mailů [doplnit], hosting [doplnit], měření návštěvnosti [doplnit]. Každý z nich má smlouvu o zpracování.',
      },
      {
        id: 'vase-prava',
        title: 'Vaše práva',
        text: 'Můžete požádat o přístup k údajům, opravu, výmaz, omezení zpracování a vznést námitku. Máte právo podat stížnost u Úřadu pro ochranu osobních údajů.',
      },
      {
        id: 'cookies',
        title: 'Cookies',
        text: 'Přehled, co a proč používáme, a nastavení najdete přes odkaz Cookies v patičce.',
      },
    ],
  },
}

// The 404 page (wireframe B, "404").
export const notFoundCopy = {
  label: '404',
  title: 'Tuhle stránku jsme nenašli',
  text: 'Odkaz je možná starý nebo v něm je překlep. Cenu fondů a kalkulačku najdete na úvodní stránce.',
  back: 'Zpět na úvod',
  method: 'Jak počítáme',
}

// The phone menu (wireframe B, "Menu, cookies, legal, errors"). Its own section
// because the menu is a client component: it takes only these strings.
export const menuCopy = {
  button: 'Menu',
  close: 'Zavřít',
  pagesLabel: 'Stránky',
  legalLabel: 'Právní',
  pages: [
    { label: 'Jak počítáme', href: '#jak-pocitame' },
    { label: 'Odkud máme čísla', href: '#odkud-mame-cisla' },
    { label: 'Časté dotazy', href: '#caste-dotazy' },
  ],
  // The pages arrive in C2b; Kontakt goes to the controller section of the policy.
  legal: [
    { label: 'Zásady zpracování', href: '/zasady' },
    { label: 'Cookies', href: '/zasady#cookies' },
    { label: 'Kontakt', href: '/zasady#kdo-zpracovava' },
  ],
  cta: { label: 'Poslat mi srovnání', href: '#formular' },
}

// The bar at the bottom of a phone, once the hero button has scrolled away.
export const stickyBarCopy = {
  cta: 'Poslat mi srovnání',
}

// The whole copy in one object, for the copy checker and its tests only. App
// code imports the section it needs, so a client bundle takes only that section
// and not every string on the page.
export const copy = {
  shell: shellCopy,
  hero: heroCopy,
  trustBlock: trustBlockCopy,
  faq: faqCopy,
  hiddenCosts: hiddenCostsCopy,
  emailPreview: emailPreviewCopy,
  leadForm: leadFormCopy,
  calculator: calculatorCopy,
  legal: legalCopy,
  notFound: notFoundCopy,
  menu: menuCopy,
  stickyBar: stickyBarCopy,
}
