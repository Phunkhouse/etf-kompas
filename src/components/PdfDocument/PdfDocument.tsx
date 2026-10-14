import path from 'node:path'
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import type { PdfModel, PdfPage } from '@/server/pdf-model'

// The personalised PDF on A4 (wireframe B, "PDF, favicon, sharing"): white paper, ink
// only, IBM Plex. It only draws `pdfModel()`; it holds no numbers and no rules.
// Colours are the tokens of src/app/variables.scss; react-pdf cannot read CSS variables.
const C = {
  ink: '#16150f',
  soft: '#3a372e',
  muted: '#6b665a',
  border: '#d4cebe',
  borderSoft: '#e6e1d4',
  yesBg: '#d6e8de',
  yesFg: '#154a33',
  noBg: '#f4d9d1',
  noFg: '#7a2410',
  verBg: '#f3e6be',
  verFg: '#6b4e00',
  neutralBg: '#f3eedf',
}

const FONTS = path.join(process.cwd(), 'src/server/pdf/fonts')
Font.register({
  family: 'IBMPlexSans',
  fonts: [
    { src: path.join(FONTS, 'IBMPlexSans-Regular.woff'), fontWeight: 400 },
    { src: path.join(FONTS, 'IBMPlexSans-Medium.woff'), fontWeight: 500 },
    { src: path.join(FONTS, 'IBMPlexSans-Bold.woff'), fontWeight: 700 },
  ],
})
Font.register({
  family: 'IBMPlexMono',
  src: path.join(FONTS, 'IBMPlexMono-Medium.woff'),
  fontWeight: 500,
})
// Czech words are never split at the end of a line.
Font.registerHyphenationCallback((word) => [word])

const LOGO = path.join(process.cwd(), 'public/brand/logo-600w.png')

const s = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingHorizontal: 50,
    paddingBottom: 70,
    fontFamily: 'IBMPlexSans',
    fontSize: 10,
    color: C.ink,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.ink,
  },
  logo: { width: 96 },
  headerText: {
    fontFamily: 'IBMPlexMono',
    fontSize: 7.5,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: C.soft,
  },
  label: {
    marginTop: 14,
    fontFamily: 'IBMPlexMono',
    fontSize: 7.5,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: C.muted,
  },
  title: { marginTop: 2, fontSize: 22, fontWeight: 700, lineHeight: 1.15 },
  lead: { marginTop: 8, fontSize: 10.5, color: C.soft, lineHeight: 1.45 },
  small: { marginTop: 8, fontSize: 8, color: C.muted, lineHeight: 1.4 },
  footer: {
    position: 'absolute',
    left: 50,
    right: 50,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    fontSize: 7,
    color: C.soft,
  },
  footerText: { width: '90%', lineHeight: 1.3, fontSize: 6.5 },
  th: {
    fontFamily: 'IBMPlexMono',
    fontSize: 6.5,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: C.soft,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.ink,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  cellRight: { textAlign: 'right' },
  bold: { fontWeight: 700 },
  detail: { fontSize: 8, color: C.muted },
  pill: {
    alignSelf: 'flex-start',
    paddingVertical: 1.5,
    paddingHorizontal: 6,
    borderRadius: 8,
    fontSize: 7.5,
    fontWeight: 700,
  },
  box: {
    marginTop: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: C.ink,
    borderRadius: 6,
  },
  boxLabel: {
    fontFamily: 'IBMPlexMono',
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: C.soft,
  },
  boxTitle: { marginTop: 3, fontSize: 12.5, fontWeight: 700 },
  paragraph: { marginTop: 8, fontSize: 10, color: C.soft, lineHeight: 1.45 },
  sourceGrid: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap' },
  source: {
    width: '50%',
    paddingRight: 10,
    marginBottom: 3,
    fontSize: 6.5,
    lineHeight: 1.25,
  },
  sourceLink: { color: C.muted, textDecoration: 'none' },
})

type Tone = 'yes' | 'no' | 'ver' | 'neutral'

const toneOf = (text: string): Tone =>
  text === 'Ano'
    ? 'yes'
    : text === 'Ne'
      ? 'no'
      : text.startsWith('[')
        ? 'ver'
        : 'neutral'

function Pill({ text, tone = toneOf(text) }: { text: string; tone?: Tone }) {
  const colors = {
    yes: { backgroundColor: C.yesBg, color: C.yesFg },
    no: { backgroundColor: C.noBg, color: C.noFg },
    ver: { backgroundColor: C.verBg, color: C.verFg },
    neutral: { backgroundColor: C.neutralBg, color: C.ink },
  }[tone]
  return <Text style={[s.pill, colors]}>{text}</Text>
}

// A cell that is a "[ověřit]" label is drawn as a pill, any other text as text.
function Value({ text, align }: { text: string; align?: 'right' }) {
  if (text.startsWith('[')) return <Pill text={text} tone="ver" />
  return <Text style={align === 'right' ? s.cellRight : undefined}>{text}</Text>
}

function Head({ widths, labels }: { widths: string[]; labels: string[] }) {
  return (
    <View style={s.headRow}>
      {labels.map((label, i) => (
        <Text key={label + i} style={[s.th, { width: widths[i] }]}>
          {label}
        </Text>
      ))}
    </View>
  )
}

function Frame({
  model,
  page,
  children,
}: {
  model: PdfModel
  page: PdfPage
  children: ReactNode
}) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.header}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
        <Image src={LOGO} style={s.logo} />
        <Text style={s.headerText}>{model.header}</Text>
      </View>
      <Text style={s.label}>{page.label}</Text>
      <Text style={s.title}>{page.title}</Text>
      {children}
      <View style={s.footer} fixed>
        <Text style={s.footerText}>{model.footer.text}</Text>
        <Text>
          {page.number} / {model.pageCount}
        </Text>
      </View>
    </Page>
  )
}

function host(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

function PageBody({ page, model }: { page: PdfPage; model: PdfModel }) {
  switch (page.kind) {
    case 'comparison': {
      const widths = ['27%', '11%', ...page.brokers.map(() => '12.4%')]
      return (
        <>
          <Text style={s.lead}>{page.lead}</Text>
          <View style={{ marginTop: 16 }}>
            <Head
              widths={widths}
              labels={[
                'Fond',
                'Poplatek',
                ...page.brokers.map((broker) => broker.name),
              ]}
            />
            {page.rows.map((row) => (
              <View key={row.fundId} style={s.row} wrap={false}>
                <View style={{ width: widths[0] }}>
                  <Text style={s.bold}>
                    {row.indexLabel} · {row.ticker}
                  </Text>
                  <Text style={s.detail}>{row.type ?? '[ověřit]'}</Text>
                </View>
                <View style={{ width: widths[1] }}>
                  {row.fee === null ? (
                    <Pill text="[ověřit]" tone="ver" />
                  ) : (
                    <Text>{row.fee}</Text>
                  )}
                </View>
                {row.cells.map((cell, i) => (
                  <View key={cell.brokerId} style={{ width: widths[i + 2] }}>
                    <Pill text={cell.text} />
                  </View>
                ))}
              </View>
            ))}
          </View>
          <Text style={s.small}>{page.legend}</Text>
          {page.value ? (
            <View style={s.box}>
              <Text style={s.boxLabel}>{pdfBoxLabel}</Text>
              <Text style={s.boxTitle}>
                {pdfValue(
                  page.value.years,
                  page.value.valueText,
                  page.value.feesText,
                )}
              </Text>
              <Text style={s.small}>{page.value.note}</Text>
            </View>
          ) : null}
        </>
      )
    }
    case 'costs': {
      const widths = ['25%', ...page.brokers.map(() => '15%')]
      return (
        <>
          <Text style={s.lead}>{page.lead}</Text>
          <View style={{ marginTop: 16 }}>
            <Head
              widths={widths}
              labels={['Fond', ...page.brokers.map((broker) => broker.name)]}
            />
            {page.rows.map((row) => (
              <View key={row.fundId} style={s.row} wrap={false}>
                <View style={{ width: widths[0] }}>
                  <Text style={s.bold}>
                    {row.indexLabel} · {row.ticker}
                  </Text>
                </View>
                {row.cells.map((cell, i) => (
                  <View key={cell.brokerId} style={{ width: widths[i + 1] }}>
                    <Value text={cell.text} />
                  </View>
                ))}
              </View>
            ))}
          </View>
          {page.spread ? (
            <Text style={[s.paragraph, s.bold, { color: C.ink }]}>
              {page.spread.text}
            </Text>
          ) : null}
          <Text style={s.small}>{page.note}</Text>
        </>
      )
    }
    case 'breakdown': {
      const widths = ['28%', '18%', '18%', '18%', '18%']
      return (
        <>
          <Text style={s.lead}>{page.lead}</Text>
          <Text style={[s.boxLabel, { marginTop: 14 }]}>{page.ticker}</Text>
          <View style={{ marginTop: 6 }}>
            <Head widths={widths} labels={breakdownLabels} />
            {page.rows.map((row) => (
              <View key={row.brokerId} style={s.row} wrap={false}>
                <Text style={[s.bold, { width: widths[0] }]}>{row.name}</Text>
                <Text style={{ width: widths[1] }}>{row.fundText}</Text>
                <Text style={{ width: widths[2] }}>{row.fxText}</Text>
                <Text style={{ width: widths[3] }}>{row.brokerText}</Text>
                <Text style={[s.bold, { width: widths[4] }]}>
                  {row.totalText}
                </Text>
              </View>
            ))}
          </View>
        </>
      )
    }
    case 'taxes':
      return (
        <>
          <Text style={s.lead}>{page.lead}</Text>
          <View
            style={{
              marginTop: 16,
              borderTopWidth: 0.5,
              borderTopColor: C.border,
            }}
          >
            {page.rows.map((row) => (
              <View
                key={row.label}
                style={[s.row, { alignItems: 'flex-start' }]}
                wrap={false}
              >
                <Text style={[s.bold, { width: '30%', paddingRight: 10 }]}>
                  {row.label}
                </Text>
                <View style={{ width: '70%' }}>
                  {row.sentences === null ? (
                    <>
                      <Text>{row.hint}</Text>
                      <View style={{ marginTop: 4 }}>
                        <Pill text={taxUnverified} tone="ver" />
                      </View>
                    </>
                  ) : (
                    row.sentences.map((sentence) => (
                      <View key={sentence.text} style={{ marginBottom: 4 }}>
                        <Text>{sentence.text}</Text>
                        {sentence.source ? (
                          <Text style={s.small}>
                            {pdfCopy.taxes.source}: {sentence.source.label},{' '}
                            {sentence.source.url}
                          </Text>
                        ) : null}
                      </View>
                    ))
                  )}
                </View>
              </View>
            ))}
          </View>
          <Text style={s.small}>{page.note}</Text>
        </>
      )
    case 'where': {
      const widths = ['15%', '25%', '19%', '14%', '8%', '19%']
      return (
        <>
          <Text style={s.lead}>{page.lead}</Text>
          <View style={{ marginTop: 16 }}>
            <Head widths={widths} labels={whereLabels} />
            {page.rows.map((row) => (
              <View
                key={row.brokerId}
                style={[s.row, { alignItems: 'flex-start' }]}
                wrap={false}
              >
                <Text style={[s.bold, { width: widths[0], paddingRight: 4 }]}>
                  {row.name}
                </Text>
                <View style={{ width: widths[1], paddingRight: 6 }}>
                  <Value text={row.purchase} />
                </View>
                <View style={{ width: widths[2], paddingRight: 6 }}>
                  <Value text={row.fx} />
                </View>
                <View style={{ width: widths[3], paddingRight: 6 }}>
                  <Value text={row.custody} />
                </View>
                <View style={{ width: widths[4] }}>
                  <Pill text={row.czech} />
                </View>
                <View style={{ width: widths[5] }}>
                  {row.sourceUrl ? (
                    <Text style={s.detail}>
                      <Link src={row.sourceUrl} style={s.sourceLink}>
                        {host(row.sourceUrl)}
                      </Link>
                      {row.asOf ? `, ${row.asOf}` : ''}
                    </Text>
                  ) : (
                    <Pill text="[ověřit]" tone="ver" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </>
      )
    }
    case 'method':
      return (
        <>
          {page.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={s.paragraph}>
              {paragraph}
            </Text>
          ))}
          <Text style={[s.label, { marginTop: 18 }]}>
            {page.sourcesHeading}
          </Text>
          <View style={s.sourceGrid}>
            {page.sources.map((source) => (
              <Text key={source.url} style={s.source}>
                <Text style={s.bold}>{source.publisher}</Text>
                {' · '}
                {source.title}{' '}
                <Link src={source.url} style={s.sourceLink}>
                  ({host(source.url)})
                </Link>
              </Text>
            ))}
          </View>
          <Text style={s.small}>{page.controller}</Text>
          <Text style={s.small}>{page.testNotice}</Text>
        </>
      )
  }
  void model
}

import { pdfCopy } from '@/content/copy'
const pdfBoxLabel = pdfCopy.comparison.valueLabel
const pdfValue = pdfCopy.comparison.value
const taxUnverified = pdfCopy.taxes.unverified
const breakdownLabels = Object.values(pdfCopy.breakdown.columns)
const whereLabels = Object.values(pdfCopy.where.columns)

export function PdfDocument({ model }: { model: PdfModel }) {
  return (
    <Document title="ETF Kompas · Srovnání" author="ETF Kompas" language="cs">
      {model.pages.map((page) => (
        <Frame key={page.number} model={model} page={page}>
          <PageBody page={page} model={model} />
        </Frame>
      ))}
    </Document>
  )
}
