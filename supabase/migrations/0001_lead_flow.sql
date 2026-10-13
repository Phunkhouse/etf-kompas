-- Phase 4: lead storage (SPEC §26). Run once in the Supabase SQL editor.
-- Access is from the server only, with the secret key. RLS is on and there are
-- no policies, so the browser keys (anon, authenticated) can read and write nothing.
-- No raw IP and no raw token is stored anywhere. `events` comes in Phase 5.

create table public.leads (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null unique check (email = lower(email) and length(email) <= 254),
  created_at            timestamptz not null default now(),
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  utm_term              text,
  fbclid                text,
  variant               text check (variant in ('a', 'b')),
  calc_monthly_bucket   integer check (calc_monthly_bucket >= 0),  -- whole Kč, bucketed
  calc_years            integer check (calc_years > 0),
  marketing_consent     boolean not null default false,
  consent_text_version  text,
  consent_confirmed_at  timestamptz,                               -- double opt-in
  email_status          text not null default 'queued'
                          check (email_status in ('queued', 'sent', 'failed', 'bounced')),
  unsubscribed_at       timestamptz,
  deleted_at            timestamptz
);

create table public.result_tokens (
  token_hash  text primary key,                                    -- hash of the token, never the token
  lead_id     uuid not null references public.leads (id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);
create index result_tokens_lead_id_idx on public.result_tokens (lead_id);

-- One row per (hashed key, window). The key is a hash of an IP (daily salt) or of an
-- e-mail address, prefixed with its kind, e.g. 'ip:<hash>' or 'email:<hash>'.
create table public.rate_limits (
  key           text not null,
  window_start  timestamptz not null,
  hits          integer not null default 0,
  primary key (key, window_start)
);

alter table public.leads         enable row level security;
alter table public.result_tokens enable row level security;
alter table public.rate_limits   enable row level security;

revoke all on public.leads, public.result_tokens, public.rate_limits from anon, authenticated;

-- Counts one hit and says whether it is within the limit. Atomic: one statement.
create function public.rate_limit_hit(p_key text, p_window_start timestamptz, p_limit integer)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  with hit as (
    insert into public.rate_limits as r (key, window_start, hits)
    values (p_key, p_window_start, 1)
    on conflict (key, window_start) do update set hits = r.hits + 1
    returning r.hits
  )
  select hits <= p_limit from hit;
$$;

revoke all on function public.rate_limit_hit(text, timestamptz, integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, timestamptz, integer) to service_role;
