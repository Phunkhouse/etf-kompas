import type { RetentionConfig } from '@/config/retention'

// All user-facing Czech text (SPEC §25, decision note 0002). The calculator
// strings are the wireframe's working copy (decision note 0017). Typography
// (non-breaking spaces) is applied at render time with nbsp(); a one-letter word
// at the very end of a string gets its non-breaking space written in here.

// The text of the page's <head> and of the link preview (wireframe B, "PDF, favicon,
// sharing": "to confirm" by David). Shown by search results, chats and social feeds.
export const siteCopy = {
  name: 'ETF Kompas',
  title: 'ETF Kompas: americké indexy z Česka, u koho je koupíte',
  description:
    'Srovnání evropských ETF na S&P 500 a Nasdaq 100: poplatky fondů a brokerů v korunách. Česky, na jedné stránce.',
  imageAlt:
    'ETF Kompas. Americké indexy z Česka: u koho je koupíte a za kolik? Poplatky fondů a brokerů v korunách. Na jedné stránce.',
}

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
    // The periods are in the privacy policy, where they are read from the settings.
    email:
      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odkaz na odhlášení. Uchováváme ho jen omezenou dobu a pak ho sami smažeme, lhůty jsou v zásadách zpracování. Zatím jde o zkušební provoz.',
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
  // Too many tries from one address or one network (HTTP 429).
  limited: {
    strong: 'Příliš mnoho pokusů.',
    text: ' Zkuste to prosím později.',
  },
  // The sentence of the drawing: the comparison is ready, and its links are on the page.
  // Nothing is said about an e-mail unless `sent` or `failed` below applies.
  done: {
    strong: 'Hotovo.',
    text: ' Srovnání je připravené.',
    open: 'Otevřít srovnání',
    pdf: 'Stáhnout PDF · 6 stran',
    // Said only when the e-mail really went out (sandbox mode sends to the allowlist only).
    sent: (address: string) =>
      `Odkaz jsme poslali i na ${address}. Pokud nic nepřijde, zkontrolujte spam.`,
    failed: 'E-mail se nepodařilo odeslat. Srovnání si otevřete tady.',
  },
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

// "6 měsíců", "1 měsíc", "2 měsíce": the Czech plural of a count, with the number.
export function czCount(
  count: number | string,
  one: string,
  few: string,
  many: string,
): string {
  const n = Number(count)
  const word = n === 1 ? one : n >= 2 && n <= 4 ? few : many
  return `${count} ${word}`
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
        text: (_controller: string, retention: RetentionConfig) =>
          `E-mail smažeme sami: ${czCount(retention.leadMonthsAfterLastContact, 'měsíc', 'měsíce', 'měsíců')} po vašem posledním kontaktu s námi, a když se odhlásíte, nejpozději ${czCount(retention.daysAfterUnsubscribe, 'den', 'dny', 'dnů')} po odhlášení. ${retention.provisional ? 'Tyto lhůty jsou zatím předběžné a čekají na ověření [doplnit]. ' : ''}Souhlas můžete kdykoli odvolat, odkaz je v každém e-mailu.`,
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
  // The cookie bar and settings (wireframe B, "Cookies"). Same drawing text; the
  // wording about what the categories do has not been reviewed by a lawyer.
  cookies: {
    bar: {
      label: 'Cookies',
      text: 'Nezbytné cookies používáme, aby web fungoval. Měření návštěvnosti a reklamní cookies zapneme jen s vaším souhlasem.',
      policy: 'Zásady zpracování',
      accept: 'Přijmout vše',
      reject: 'Odmítnout vše',
      settings: 'Nastavit',
    },
    settings: {
      title: 'Nastavení cookies',
      intro:
        'Vyberte, co smíme používat. Volbu kdykoli změníte přes odkaz Cookies v patičce.',
      close: 'Zavřít',
      save: 'Uložit výběr',
      acceptAll: 'Přijmout vše',
      always: 'Vždy zapnuto',
      necessary: {
        title: 'Nezbytné',
        text: 'Bez nich web nefunguje (například uložení vaší volby). Vypnout je nejde.',
      },
      measurement: {
        title: 'Měření návštěvnosti',
        text: 'Anonymní statistiky, které nám řeknou, co na webu nefunguje.',
      },
      advertising: {
        title: 'Reklama a remarketing',
        text: 'Pomáhá změřit reklamy. Zapneme až po vašem souhlasu.',
      },
    },
  },
}

// The 404 page (wireframe B, "404").
// The comparison page behind the e-mail (wireframe B, "Comparison page", PR 2).
// Section 3 of the drawing ("Kde fond koupit") is not built yet, so the numbers
// of the later sections are one lower than in the drawing.
export const resultsCopy = {
  label: 'Vaše srovnání',
  title: 'Srovnání 5 fondů',
  lead: 'Poplatky fondů a to, u koho je koupíte a kolik za to zaplatíte. Bez výnosů, jen to, co fond stojí.',
  strip: {
    label: 'Váš výsledek',
    setup: (monthly: string, years: number) =>
      `${monthly} měsíčně · ${years} let`,
    total: (years: number, ticker: string) =>
      `Za ${years} let vás fond (${ticker}) může u ověřených brokerů stát i`,
    fundOnly: (years: number, ticker: string) =>
      `Za ${years} let vás poplatek fondu (${ticker}) bude stát`,
  },
  contents: {
    label: 'Na stránce',
    funds: '1 · Fondy vedle sebe',
    taxes: '2 · Daně v Česku',
    method: '3 · Jak počítáme',
  },
  funds: {
    heading: '1 · Fondy vedle sebe',
    label: 'Stejný index, jiný fond',
    caption: 'Fondy vedle sebe',
    columns: { fund: 'Co koupíte', type: 'Typ', fee: 'Roční poplatek' },
    accumulating: 'Acc',
    distributing: 'Dist',
    legend:
      'Acc = fond výnosy sám reinvestuje. Dist = výnosy vyplácí. Jen cena a dostupnost, ne výnosy.',
  },
  brokers: {
    heading: 'U kterého brokera?',
    pick: 'Vyberte fond',
    caption: 'U kterého brokera?',
    columns: {
      broker: 'Broker',
      buy: 'Koupíte?',
      fees: 'Poplatky brokera a převod',
      total: (years: number) => `Za ${years} let celkem`,
    },
    yes: 'Ano',
    no: 'Ne',
    unverified: '[ověřit]',
    none: '–',
    assumption: (monthly: string, years: number, rate: string) =>
      `${monthly} měsíčně · ${years} let · ${rate} ročně · jedna investice měsíčně · příklad, ne slib. Částky se řídí kalkulačkou.`,
    summary: (spread: string, lowest: string, years: number) =>
      `Mezi ověřenými brokery se výsledek liší až o ${spread}. Nejnižší možné poplatky s vaším nastavením: ${lowest} za ${years} let.`,
    estimate:
      'Odhad. Bez českých daní a inflace. Ceny brokerů: u každého je zdroj a datum ověření; u neověřených to doplníme.',
  },
  taxes: {
    heading: '2 · Daně v Česku',
    items: [
      {
        label: 'Prodej po letech',
        text: '[Text se doplní podle ověřeného podkladu: kdy je zisk z prodeje osvobozen.]',
      },
      {
        label: 'Dividendy ze zahraničí',
        text: '[Text se doplní podle ověřeného podkladu: co stáhne zahraničí a co dopočítáte u nás.]',
      },
      {
        label: 'Přiznání',
        text: '[Text se doplní podle ověřeného podkladu: co a kam uvést.]',
      },
    ],
    note: 'Obecná informace, ne daňové poradenství.',
  },
  method: {
    heading: '3 · Jak počítáme',
    text: 'Počítáme roční poplatek fondu, převod korun a poplatky brokera. Nepočítáme inflaci ani české daně.',
    link: 'Otevřít postup',
  },
  expires: 'Odkaz platí 30 dní.',
  pdf: 'Stáhnout PDF · 6 stran',
  // The card at the end of the comparison page: a new link to the lead's own address.
  resend: {
    label: 'Poslat odkaz znovu',
    text: 'Odkaz platí 30 dní. Zapomněli jste ho?',
    button: 'Poslat odkaz na můj e-mail',
    sending: 'Posílám…',
    sent: 'Poslali jsme vám nový odkaz.',
    skipped: 'E-mail jsme neodeslali: zatím je zapnutý zkušební provoz.',
    failed: 'E-mail se nepodařilo odeslat. Zkuste to prosím za chvíli.',
    limited: 'Příliš mnoho pokusů. Zkuste to prosím později.',
  },
}

// A results link that does not work: never issued, expired or mistyped. One text for
// all of them, so it does not say whether an address is known.
export const resultsGoneCopy = {
  label: 'Odkaz',
  title: 'Tento odkaz už nefunguje',
  text: 'Odkaz je možná starý, platí 30 dní, nebo v něm je překlep. Kalkulačku najdete na úvodní stránce.',
  back: 'Zpět na úvod',
  // The form under the text: a new link to an address, the same answer for every one.
  resend: {
    label: 'Váš e-mail',
    button: 'Poslat nový odkaz',
    sending: 'Posílám…',
    answer: 'Pokud tento e-mail u nás máme, poslali jsme na něj nový odkaz.',
  },
}

// The personalised PDF (wireframe B, "PDF, favicon, sharing"; six pages approved by
// David on 2026-10-14). The numbers and the broker lines come from `pdfModel()`.
export const pdfCopy = {
  header: 'Vaše srovnání',
  footer: {
    advice: 'Obecná informace, ne investiční ani daňové poradenství.',
    verified: (month: string) => `Čísla ověřena k ${month}`,
    estimate: 'odhad bez českých daní a inflace',
    controller: (controller: string) => `Správce: ${controller}`,
  },
  unverified: '[ověřit]',
  none: '–',
  yes: 'Ano',
  no: 'Ne',
  comparison: {
    label: 'Strana 1 · Srovnání',
    title: 'Americké indexy z Česka: u koho je koupíte a za kolik?',
    lead: 'Stejné firmy ze S&P 500 a Nasdaq 100, jen v evropské verzi. Níže je poplatek fondu a to, u kterého brokera ho koupíte.',
    columns: { fund: 'Fond', fee: 'Poplatek' },
    legend:
      '[ověřit] = zatím neověřeno, doplníme zdroj. „Ano“ jen s uvedeným zdrojem a datem.',
    valueLabel: 'Při vašem nastavení',
    value: (years: number, value: string, fees: string) =>
      `Ilustrativní hodnota po ${years} letech: ${value}, z toho poplatky ${fees}.`,
    valueNote: (rate: string) =>
      `${rate} ročně, příklad, ne slib. Odhad, bez českých daní a inflace.`,
  },
  costs: {
    label: 'Strana 2 · Cena',
    title: 'Kolik vás to bude stát',
    lead: (years: number) =>
      `Celkem za ${years} let u každého fondu a brokera: poplatek fondu, převod korun a poplatky brokera.`,
    columns: { fund: 'Fond' },
    note: 'Odhad. Bez českých daní a inflace.',
  },
  breakdown: {
    label: 'Strana 3 · Z čeho se cena skládá',
    title: 'Z čeho se cena skládá',
    // The fund the calculator prices; its name stands in the table caption.
    lead: (years: number) =>
      `Fond, který počítá kalkulačka, za ${years} let. Cena se skládá z poplatku fondu, převodu korun a poplatků brokera.`,
    columns: {
      broker: 'Broker',
      fund: 'Poplatek fondu',
      fx: 'Převod korun',
      brokerFees: 'Poplatky brokera',
      total: 'Celkem',
    },
  },
  taxes: {
    label: 'Strana 4 · Daně',
    title: 'Co platí v Česku',
    lead: 'Jedna strana o tom, co se děje s výnosem. Text vychází jen z ověřeného podkladu (Finanční správa), který u každé věty uvedeme.',
    rows: [
      {
        label: 'Fond, který výnosy reinvestuje',
        hint: 'Co to znamená pro daň v Česku.',
      },
      {
        label: 'Fond, který výnosy vyplácí',
        hint: 'Jak se zdaňují vyplacené výnosy.',
      },
      {
        label: 'Časový test',
        hint: 'Za jakých podmínek je prodej osvobozen.',
      },
      {
        label: 'Daň z dividend v zahraničí',
        hint: 'Co stáhne zahraničí a co se dá započítat.',
      },
    ],
    unverified: '[ověřit zdroj]',
    note: 'Nejde o daňové poradenství. Před rozhodnutím se poraďte s poradcem.',
  },
  where: {
    label: 'Strana 5 · Kde fond koupit',
    title: 'Kde fond koupit',
    lead: 'Pět brokerů, abecedně. Poplatky z ceníků brokerů, u každého se zdrojem a datem.',
    columns: {
      broker: 'Broker',
      purchase: 'Poplatek za nákup',
      fx: 'Převod korun',
      custody: 'Vedení účtu',
      czech: 'Česky',
      source: 'Zdroj a datum',
    },
    other: 'jinde',
    yearly: 'ročně',
    ofPurchase: 'z nákupu',
    atLeast: 'nejméně',
    atMost: 'nejvýše',
    toEuros: 'na eura',
    toDollars: 'na dolary',
    toBoth: 'na eura i dolary',
  },
  method: {
    label: 'Strana 6 · Jak počítáme',
    title: 'Jak počítáme a odkud máme čísla',
    counted:
      'Počítáme roční poplatek fondu, převod korun a poplatky brokera. Nepočítáme inflaci ani české daně.',
    proof:
      'Každé číslo má uvedený podklad a datum ověření. Co není ověřeno, je označeno [ověřit].',
    sourcesHeading: 'Odkud máme čísla',
  },
}

// The e-mails (PR 4 of Phase 4): the Kompas e-mail and the opt-in e-mail of the drawing.
export const emailCopy = {
  kompas: {
    subject: 'Vaše srovnání je připravené',
    heading: 'Srovnání je připravené',
    intro: (monthly: string, years: number) =>
      `Připravili jsme srovnání pro ${monthly} měsíčně na ${years} let.`,
    open: 'Otevřít srovnání',
    pdf: 'Stáhnout PDF · 6 stran',
    validity: 'Odkaz platí 30 dní.',
  },
  optIn: {
    subject: 'Potvrďte odběr tipů k investování',
    heading: 'Potvrďte odběr tipů',
    intro:
      'Při stažení srovnání jste zaškrtli, že chcete občas dostat tip k investování. Stačí jedno klepnutí.',
    button: 'Ano, posílejte mi tipy',
    note: 'Srovnání už máte, na něm tento krok nic nemění. Pokud jste o tipy nežádali, e-mail ignorujte a nic se nestane.',
  },
  footer: {
    controller: (controller: string) => `Správce: ${controller}.`,
    privacy: 'Zásady zpracování',
    unsubscribe: 'Odhlásit se',
    unsubscribeNote: 'Odhlásit se můžete v každém e-mailu.',
  },
}

// The pages the links in the e-mails lead to (wireframe B, "After submit and e-mail").
export const subscribeCopy = {
  confirm: {
    label: 'Potvrzení',
    ask: {
      title: 'Potvrďte odběr tipů',
      text: 'Stačí jedno klepnutí. Srovnání už máte, na něm tento krok nic nemění.',
      button: 'Ano, posílejte mi tipy',
    },
    done: {
      title: 'Odběr tipů potvrzen',
      text: 'Děkujeme. Tipy budeme posílat zřídka. Odhlásit se můžete v každém e-mailu.',
      back: 'Zpět na srovnání',
    },
    failure: 'Potvrzení se nepovedlo. Zkuste to prosím znovu za chvíli.',
  },
  gone: {
    label: 'Odkaz',
    title: 'Tento odkaz už nefunguje',
    text: 'Platnost odkazu vypršela nebo už byl použit. Odběr tipů můžete zapnout znovu ve formuláři na úvodní stránce.',
    back: 'Zpět na úvod',
  },
  unsubscribe: {
    label: 'Odhlášení',
    title: 'Odhlášeno',
    text: 'Srovnání vám už posílat nebudeme. Stalo se to omylem? Přihlásit se můžete znovu.',
    // days: the provisional period after which the address is deleted
    kept: (days: number) =>
      `Váš e-mail sami smažeme nejpozději ${czCount(days, 'den', 'dny', 'dnů')} po odhlášení. Tato lhůta je zatím předběžná.`,
    button: 'Přihlásit zpět',
    failure: 'Přihlášení se nepovedlo. Zkuste to prosím znovu za chvíli.',
  },
  resubscribed: {
    title: 'Přihlášeno zpět',
    text: 'Odhlášení jsme zrušili.',
    back: 'Zpět na úvod',
  },
}

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
    { label: 'Cookies', href: '/zasady#cookies', opensCookies: true },
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
  results: resultsCopy,
  email: emailCopy,
  subscribe: subscribeCopy,
  pdf: pdfCopy,
  resultsGone: resultsGoneCopy,
  menu: menuCopy,
  stickyBar: stickyBarCopy,
}
