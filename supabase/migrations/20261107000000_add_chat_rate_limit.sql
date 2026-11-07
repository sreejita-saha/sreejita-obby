-- Apply with `supabase db push` or paste into the Supabase SQL Editor.
-- The Vercel API hashes visitor IP addresses before calling this function.

create schema if not exists private;

create table if not exists private.chat_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1 check (request_count > 0)
);

alter table private.chat_rate_limits enable row level security;
revoke all on table private.chat_rate_limits from public, anon, authenticated;

create or replace function public.check_chat_rate_limit(
  p_fingerprint text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed boolean;
begin
  if p_fingerprint is null or char_length(p_fingerprint) <> 64
    or p_fingerprint !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid request' using errcode = '22023';
  end if;

  if p_limit < 1 or p_window_seconds < 1 then
    raise exception 'invalid rate-limit configuration' using errcode = '22023';
  end if;

  delete from private.chat_rate_limits
  where window_started_at < now() - interval '2 days';

  insert into private.chat_rate_limits (fingerprint, window_started_at, request_count)
  values (p_fingerprint, now(), 1)
  on conflict (fingerprint) do update
    set window_started_at = case
          when private.chat_rate_limits.window_started_at
            <= now() - (p_window_seconds * interval '1 second') then now()
          else private.chat_rate_limits.window_started_at
        end,
        request_count = case
          when private.chat_rate_limits.window_started_at
            <= now() - (p_window_seconds * interval '1 second') then 1
          else private.chat_rate_limits.request_count + 1
        end
  returning request_count <= p_limit into allowed;

  return allowed;
end;
$$;

revoke all on function public.check_chat_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.check_chat_rate_limit(text, integer, integer)
  to service_role;
