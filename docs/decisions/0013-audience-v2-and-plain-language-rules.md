# 0013. Audience v2 and plain-language rules

Date: 2026-10-10
Status: accepted
Phase: 1

## Context

The first audience profile was a beginner making a first investment. Cold Instagram and Facebook traffic sees the ad for 3 to 5 seconds, knows the word "ETF" but not TER, UCITS or withholding tax, and fears paying fees they do not know about (SPEC §2).

## Decision

Target "a person who knows they should invest but does not understand it": Czech, 25 to 40, on a phone. The page sells clarity, not comparison depth. Every cost is shown in Kč and named by what the customer sees, and jargon is translated using the glossary in SPEC §25. `pnpm copy:check` enforces the glossary, at most one "ETF" on the landing page, no abbreviations in headlines and no ticker without a plain name. Investors who compare funds by TER, day traders and return seekers are excluded on purpose.

## Alternatives considered

- The v1 profile ("začátečník s první investicí"): replaced by v2. No other alternatives recorded.

## Consequences

- Phase 3 is gated by the 5-second test with three non-investors (SPEC §22).
- Investor-grade detail lives only inside the gated comparison, in plain words first.
- More copy work, and every string needs David's native-Czech review before deploy (SPEC §17.10).
