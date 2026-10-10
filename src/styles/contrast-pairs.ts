import type { ColorName } from './colors'

export type ContrastPair = {
  fg: ColorName
  bg: ColorName
  // 4.5 for normal text, 3 for large text and UI components
  min: 3 | 4.5
  use: string
}

// Every foreground/background pair used in the UI. Add a pair here when a
// component starts using it; `pnpm contrast:check` fails the build on a miss.
export const contrastPairs: ContrastPair[] = [
  { fg: 'ink', bg: 'paper', min: 4.5, use: 'body text' },
  { fg: 'ink-soft', bg: 'paper', min: 4.5, use: 'secondary text' },
  { fg: 'ink-soft', bg: 'surface', min: 4.5, use: 'secondary text on cards' },
  { fg: 'muted', bg: 'paper', min: 4.5, use: 'captions, tags' },
  { fg: 'muted', bg: 'surface', min: 4.5, use: 'captions on cards' },
  { fg: 'muted', bg: 'white', min: 4.5, use: 'placeholder text in fields' },
  { fg: 'paper', bg: 'ink', min: 4.5, use: 'primary button, dark sections' },
  { fg: 'inverse-soft', bg: 'ink', min: 4.5, use: 'secondary text on dark' },
  { fg: 'inverse-subtle', bg: 'ink', min: 4.5, use: 'captions on dark' },
  { fg: 'cost', bg: 'ink', min: 4.5, use: 'cost number on dark' },
  { fg: 'white', bg: 'cost-strong', min: 4.5, use: 'badge on cost-strong' },
  {
    fg: 'cost-strong',
    bg: 'paper',
    min: 3,
    use: 'cost number on paper (large)',
  },
  { fg: 'no-fg', bg: 'no-bg', min: 4.5, use: 'pill: not buyable, unverified' },
  { fg: 'yes-fg', bg: 'yes-bg', min: 4.5, use: 'pill: buyable' },
  {
    fg: 'yes-fg',
    bg: 'highlight',
    min: 3,
    use: 'positive pill border on highlighted row',
  },
  { fg: 'yes-fg', bg: 'paper', min: 4.5, use: 'check icon, saved text' },
  { fg: 'ink', bg: 'highlight', min: 4.5, use: 'highlighted table row' },
  { fg: 'ink', bg: 'row-hover', min: 4.5, use: 'table row on hover' },
  { fg: 'ink', bg: 'white', min: 4.5, use: 'text in fields' },
  { fg: 'ink', bg: 'paper', min: 3, use: 'borders and focus ring on paper' },
  { fg: 'paper', bg: 'ink', min: 3, use: 'borders and focus ring on dark' },
  { fg: 'paper', bg: 'ink-soft', min: 4.5, use: 'primary button on hover' },
  {
    fg: 'ink',
    bg: 'inverse-soft',
    min: 4.5,
    use: 'primary button on hover, dark',
  },
  {
    fg: 'paper',
    bg: 'inverse-border',
    min: 4.5,
    use: 'outline button and chip on hover, dark',
  },
  { fg: 'ink-soft', bg: 'border-soft', min: 4.5, use: 'disabled button' },
  {
    fg: 'inverse-soft',
    bg: 'inverse-border',
    min: 4.5,
    use: 'disabled button, dark',
  },
  {
    fg: 'muted',
    bg: 'highlight',
    min: 4.5,
    use: 'table detail on highlighted row',
  },
  {
    fg: 'muted',
    bg: 'row-hover',
    min: 4.5,
    use: 'table detail on hovered row',
  },
]
