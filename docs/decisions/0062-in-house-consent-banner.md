# 0062. The consent banner is built in-house

Date: 2026-10-14
Status: accepted
Phase: 5

Note: the reason is David's ("JS budget concern, move to inhouse solution after exploring other options"). Context, alternatives and consequences are written by the agent from the exploration in the session.

## Context

SPEC §9 prefers a maintained open-source consent library. The landing route is at 149.8 of 150 KB gzipped JavaScript (note 0034), and the budget is measured on a cold visit, which is every first visitor from an ad. A consent library in the bundle would not fit. The spec's wording "load tracking only after consent" and the Phase 5 criterion of zero non-essential third-party requests before consent also rule out loading `gtag` early with Consent Mode defaults.

## Decision

Build the banner in-house: server-rendered HTML with inline CSS, about 2 to 3 KB of vanilla JS outside the React bundle, and a blocking inline `<head>` script (under 1 KB) that reads the consent cookie and sets `data-consent` on `<html>` before paint. Granular choices (measurement, advertising), off until agreed, no IAB TCF. Reason (David): JS budget concern, move to an in-house solution after exploring other options.

## Alternatives considered

- Raise the JS budget: first chosen, then dropped by David after exploring the options.
- Lazy-load a library: the banner would arrive late for first visitors, or consent state would be missing for tracking.
- Consent Mode defaults script before consent: needs `gtag` loaded early, which breaks the zero-third-party criterion.
- Edge or server cookie detection: makes the static page dynamic, or needs two prerendered shells.

## Consequences

- This deviates from the spec's preference for a library. The in-house banner has not been reviewed by a lawyer; the legal text stays a placeholder.
- We own the consent logic and its tests (equal prominence of the two buttons, off by default, reopen from the footer).
- To revisit if the measured banner does not fit in the budget, or if a library measured in PR 1 turns out to be about 3 KB gzipped.
