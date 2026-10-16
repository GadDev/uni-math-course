-- One statement snapshot avoids offset drift, application/database clock skew
-- and the Data API's row cap on set-returning queries. This returns one JSON
-- value, containing only the caller's rows. Suitable for the small class pilot;
-- revisit the payload size before introducing a much larger learning history.
create function public.read_attempt_history()
returns jsonb
language sql stable
security invoker
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(to_jsonb(attempt) order by attempt.created_at desc, attempt.id desc),
    '[]'::jsonb
  )
  from public.attempts as attempt
  where attempt.user_id = (select auth.uid());
$$;

revoke all on function public.read_attempt_history() from public, anon;
grant execute on function public.read_attempt_history() to authenticated;
