// Colour tokens (docs/design/DESIGN-GUIDE.md section 1). Keys match the CSS
// variables in src/app/variables.scss (`--color-<key>`); a test keeps both in sync.
export const colors = {
  paper: '#F6F3EC',
  surface: '#FFFDF8',
  white: '#FFFFFF',
  ink: '#16150F',
  'ink-soft': '#3A372E',
  muted: '#6B665A',
  border: '#D4CEBE',
  'border-soft': '#E6E1D4',
  'inverse-soft': '#D9D4C5',
  'inverse-subtle': '#B9B3A2',
  'inverse-border': '#4A473D',
  cost: '#F2A18C',
  'cost-strong': '#C23A1B',
  'no-bg': '#F4D9D1',
  'no-fg': '#7A2410',
  'yes-bg': '#D6E8DE',
  'yes-fg': '#154A33',
  'pill-ver-bg': '#F3E6BE',
  'pill-ver-ink': '#6B4E00',
  highlight: '#DCEEE3',
  'row-hover': '#F3EEDF',
  'saving-bg': '#1F3A2B',
  'saving-border': '#2F6B49',
  'saving-fg': '#9AD4B2',
  'saving-soft': '#B9D9C6',
  'switch-on': '#2F6B49',
} as const

export type ColorName = keyof typeof colors
