# AI log: the Claude Code conversations

Every Claude Code session of this project, in the order they started. The written summary, with the prompts and every mistake the AI made, is [docs/AI-LOG.md](../docs/AI-LOG.md); these files are the conversations themselves.

**How they were made.** The files are converted from the transcripts that Claude Code stores on the author's computer (`~/.claude/projects/`), by [convert_transcripts.py](convert_transcripts.py) (standard library only). They are **not the output of the `/export` command**: `/export` writes one conversation at a time, and this folder covers all of them. Kept: every message of David and of Claude, every tool call (the tool and its main argument) and the start of every tool result. Left out: the system reminders the app adds to messages, thinking, images and the long tail of big tool results. Secrets and e-mail addresses are redacted by pattern (`[REDACTED ...]`, `[email]`); the author read the result before it was committed.

**What the sessions are.** The "Phase" sessions are the planned phases of the project (SPEC section 20). The "Remote Control" sessions were started from a coordinating Claude conversation on claude.ai, which relayed a task (a pull request, a read-only check) to Claude Code on this computer; their first message is that relayed note, written by the coordinator, not by David. The last session is the one in which this folder was made, so it ends at the moment of the conversion.

**Not here.** A few later fixes were made with another coding agent (Codex), which does not keep Claude Code transcripts; they are in the git history. Three sessions of another project (`lucys-bookshop`) are not part of this repository and are left out.

| # | Dates | Session | Messages (David / Claude) | Size |
| --- | --- | --- | --- | --- |
| 1 | 2026-10-10 | [Remote Control: kickstart the project in a new subfolder](01-2026-10-10-remote-control-kickstart-the-project-in-.md) | 4 / 35 | 31 KB |
| 2 | 2026-10-10 | [Let's move on with Phase 1 of etf kompas project. I have just add star](02-2026-10-10-let-s-move-on-with-phase-1-of-etf-kompas.md) | 48 / 255 | 221 KB |
| 3 | 2026-10-10 | [Let's move on with Phase 1 of etf kompas project. I have just add star](03-2026-10-10-let-s-move-on-with-phase-1-of-etf-kompas.md) | 48 / 244 | 212 KB |
| 4 | 2026-10-10 | [Pending changes commit](04-2026-10-10-pending-changes-commit.md) | 2 / 7 | 3 KB |
| 5 | 2026-10-10 to 2026-10-11 | [Phase 2](05-2026-10-10-phase-2.md) | 13 / 101 | 84 KB |
| 6 | 2026-10-11 | [Remote Control: the wireframes document into the repo (docs PR)](06-2026-10-11-remote-control-the-wireframes-document-i.md) | 3 / 13 | 12 KB |
| 7 | 2026-10-11 to 2026-10-13 | [Ok, let's plan Phase 3. Prepare me theoretical basis and PR checklist.](07-2026-10-11-ok-let-s-plan-phase-3-prepare-me-theoret.md) | 249 / 1546 | 1433 KB |
| 8 | 2026-10-11 to 2026-10-14 | [Remote Control: wireframes rev. 2 and the design docs, updated over three days](08-2026-10-11-remote-control-wireframes-rev-2-and-the-.md) | 33 / 143 | 161 KB |
| 9 | 2026-10-12 | [Remote Control: docs-only PR for the rev. 4 wireframes](09-2026-10-12-remote-control-docs-only-pr-for-the-rev-.md) | 2 / 14 | 14 KB |
| 10 | 2026-10-12 | [Remote Control: read-only check of the README and the A/B hero code](10-2026-10-12-remote-control-read-only-check-of-the-re.md) | 2 / 11 | 12 KB |
| 11 | 2026-10-12 | [Remote Control: Step 0, do this first and message me (send_message to the Thread Claude) before ](11-2026-10-12-remote-control-step-0-do-this-first-and-.md) | 4 / 47 | 58 KB |
| 12 | 2026-10-13 to 2026-10-14 | [As we have completed Phase 3, let's to Phase 4 checklist](12-2026-10-13-as-we-have-completed-phase-3-let-s-to-ph.md) | 65 / 367 | 331 KB |
| 13 | 2026-10-14 | [Let's start Phase 5. Create a checklist](13-2026-10-14-let-s-start-phase-5-create-a-checklist.md) | 30 / 190 | 174 KB |
| 14 | 2026-10-14 | [Plan Phase 6, create a checklist](14-2026-10-14-plan-phase-6-create-a-checklist.md) | 56 / 337 | 318 KB |
| 15 | 2026-10-14 to 2026-10-15 | [@"/Users/davidkrapka/Downloads/tax-basis-sources.md"](15-2026-10-14-users-davidkrapka-downloads-tax-basis-so.md) | 45 / 344 | 295 KB |
