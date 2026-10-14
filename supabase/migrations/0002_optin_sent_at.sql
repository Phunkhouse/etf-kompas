-- Phase 4, PR 4: when the opt-in e-mail for the tips last went out, so that it is sent
-- once until the visitor confirms or the link expires (7 days). Run once in the
-- Supabase SQL editor, after 0001_lead_flow.sql.
alter table public.leads add column optin_sent_at timestamptz;
