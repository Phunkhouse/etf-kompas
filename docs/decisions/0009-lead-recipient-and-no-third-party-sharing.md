# 0009. Lead recipient and no third-party sharing

Date: 2026-10-10
Status: accepted
Phase: 1

## Context

The assignment does not say who receives the leads (broker, advisor or own newsletter). Privacy text must name the controller, and the repo is public (SPEC §3.5, §17.1, §17.11).

## Decision

Leads go to a single list owned by the data controller and are not passed to brokers or any third party at launch. The controller's name, IČO, address and contact are one config value (`src/config/site.ts`) and are clearly marked placeholders in the demo. Clientelo is not named as controller unless it agrees. Brokers are listed alphabetically, with no affiliate links and no ranking by commission (SPEC §17.2).

## Alternatives considered

- Passing leads to brokers or other partners: not done at launch. Reason from SPEC §17.1: one controller, one purpose and no sharing is the simplest lawful setup.

## Consequences

- Clientelo has to fill in its own details and confirm before any real launch.
- A README gap: who receives the leads is an open business question (SPEC §3.5, §17.13).
- The legal wording needs review before paid launch; we are not lawyers (SPEC §19).
