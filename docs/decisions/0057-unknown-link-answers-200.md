# 0057. An unknown or expired results link answers 200, not 404

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reason is David's own words in chat on 2026-10-14 ("for now log it as a gap, we might do it later if there is time"). The context and the consequences are written by the agent from the repo; David confirms or corrects them.

## Context

David approved, in the Phase 4 plan, that an unknown, malformed or expired results link answers 404, to keep it out of caches. With Cache Components, the page `/srovnani/[token]` is prerendered as a static shell and the rest streams in. The status line is sent with the shell, so it is 200 before the lookup can fail; `notFound()` after that cannot change it. The PDF route is a route handler and does answer a real 404.

## Decision

The page answers 200 with the message "Tento odkaz už nefunguje", the same for every reason (never issued, expired, malformed, deleted). To keep the intent of the earlier decision, every answer of the route carries `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store`. A real 404 would need a Proxy that repeats the lookup before the page renders. Reason (David): for now it is logged as a gap, to be done later if there is time.

## Alternatives considered

- A Proxy (`proxy.ts`) that looks the token up and rewrites to a 404 page: not done now. David's reason: logged as a gap; maybe later, if there is time.

## Consequences

- A crawler or a tool sees 200 for a dead link; the headers keep it out of search and shared caches. The answer is identical for every reason, so it tells nothing about whether an address is known.
- The README and `docs/PHASES.md` list it as a known gap.
- A Proxy check would also add a second lookup per request.
