# Data

`etfs.json`, `brokers.json` and `sources.json` are the only source of numbers for the page (SPEC §5, §18).

## Rules

- Never fill a value from memory or from an LLM. Unknown means `"TODO_VERIFY"`.
- Every sourced value is a record: `value`, `sourceUrl`, `asOf`, `verifiedBy`, `verifiedOn`, `evidence`.
- `sourceUrl` must be an https URL listed in `sources.json`.
- `evidence` is a web.archive.org link and/or the SHA-256 of the saved source PDF. Do not commit the PDFs.
- Percentages are plain numbers: `0.07` means 0.07 %.
- `asOf` may be at most 120 days old (45 days for broker fees `fxFeePct` and `custodyFeePct`).
- `asOf` is the date printed in a dated document that carries the data (factsheet, KID, index factsheet). For a source that stays in force or has no data date (treaty, fee overview, current prospectus, live page) it is the date we captured it and confirmed it is current; the document's own date goes in `evidence` (decision note 0024).
- `domicile` of a UCITS fund is the country its KID or factsheet names. US prospectuses do not state one, so for a US-listed fund it is `US`, with the evidence that the prospectus registers the fund under the Investment Company Act of 1940 (decision note 0022).

## Verifying a value

1. Add the source to `sources.json` (`url`, `title`, `publisher`).
2. Replace the placeholder with the checked record, for example:

```json
"ter": {
  "value": 0.07,
  "sourceUrl": "https://issuer.example/factsheet.pdf",
  "asOf": "2026-09-30",
  "verifiedBy": "David",
  "verifiedOn": "2026-10-10",
  "evidence": "https://web.archive.org/web/..."
}
```

3. Run `pnpm data:validate:draft` while values are still being filled in, and `pnpm data:validate` (strict) when finished. Strict must pass before any deploy.
