// Site identity (SPEC §13, §17.1). The controller details are placeholders on
// purpose: the demo must not name a real controller. Clientelo fills them in,
// and confirms them, before any real launch (SPEC §19).
export const site = {
  name: 'ETF Kompas',
  controller: {
    name: '[SPRÁVCE]',
    registrationNumber: '[IČO]',
    address: '[adresa]',
  },
} as const

export function controllerLabel(): string {
  const { name, registrationNumber, address } = site.controller
  return `${name} – ${registrationNumber}, ${address}`
}
