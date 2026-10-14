-- Phase 5, PR 2: first-party events (SPEC §9) and the session id on a lead. Run once in
-- the Supabase SQL editor, after 0002_optin_sent_at.sql.
-- Cookieless and aggregate: no IP, no user agent, no e-mail. `session_id` is a random id
-- made in the browser (one page load before consent, kept in a cookie after the visitor
-- agrees to measurement). `fbclid` is stored on `page_view` rows only.
-- TODO_VERIFY: how long events are kept (docs/LEGAL-PACK.md point 5).

create table public.events (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  session_id           uuid,                                        -- null for the server-side `lead`
  name                 text not null
                         check (name in ('page_view', 'calc_start', 'calc_result', 'gate_view', 'form_focus', 'lead')),
  variant              text check (variant in ('a', 'b')),
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  utm_content          text,
  utm_term             text,
  fbclid               text,
  device               text check (device in ('phone', 'desktop')),
  in_app_browser       boolean,
  consent_measurement  boolean not null default false,
  calc_monthly_bucket  integer check (calc_monthly_bucket >= 0),    -- calc_result only
  calc_years           integer check (calc_years > 0)               -- calc_result only
);
create index events_created_at_idx on public.events (created_at);
create index events_name_idx on public.events (name, created_at);

alter table public.events enable row level security;
revoke all on public.events from anon, authenticated;

-- Set only when the visitor agreed to measurement (docs/LEGAL-PACK.md point 7).
alter table public.leads add column session_id uuid;
