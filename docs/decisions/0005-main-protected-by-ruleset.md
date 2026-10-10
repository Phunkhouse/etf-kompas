# 0005. `main` protected by a ruleset with required CI checks

Date: 2026-10-10
Status: proposed
Phase: 1

## Context

SPEC §15 and CLAUDE.md say "never push to `main`". That was only an instruction, not enforced. The repo is public and has one maintainer.

## Decision

A GitHub ruleset `protect-main` on the default branch requires a pull request, requires the `check` and `e2e` CI jobs to pass and the branch to be up to date, and blocks force-pushes and deletion. Merging is done by David after review. Merged branches are deleted automatically on GitHub, and `fetch.prune` is on locally.

David asked for merging to be impossible while checks fail.

## Alternatives considered

- Classic branch protection: it was applied first, then replaced by a ruleset (the newer GitHub mechanism).

## Consequences

- A history rewrite on `main` needs the ruleset set to Disabled temporarily (it was needed twice in Phase 1). Re-enable it afterwards.
- New required checks must be added to the ruleset when workflow jobs are added or renamed.
