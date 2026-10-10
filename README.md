# ETF Kompas

Czech-language, mobile-first lead-gen landing page for ETF cost comparison.
Source of truth: [docs/SPEC.md](docs/SPEC.md).

> README stub. The full structure is defined in SPEC §16. Dev phases: [docs/PHASES.md](docs/PHASES.md).

## Stack

Next.js (App Router, TypeScript strict), SCSS Modules, pnpm, Node 24. Deploy target: Vercel.

## Develop

```bash
corepack enable
pnpm install
pnpm dev
```

### Testing on a real phone

Connect the phone to the same Wi-Fi, run `pnpm dev`, find the Mac's address (`ipconfig getifaddr en0`) and open `http://<that address>:3000/styleguide` on the phone. `next.config.ts` allows `192.168.*.*` origins in dev. If your network uses another range (for example `10.x`), add it to `allowedDevOrigins`.

Before finishing any change: `pnpm check && pnpm format:check`.
