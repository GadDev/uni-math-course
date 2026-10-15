-- Only the trusted grading server may call this function. It receives a
-- server-computed grade, never a grade or owner supplied by the browser.
create function public.record_attempt(p_attempt jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved public.attempts;
  owner_id uuid := (p_attempt->>'user_id')::uuid;
  item_id text := p_attempt->>'exercise_id';
begin
  -- Serialise all versions/submissions of one learner's exercise. Eligibility
  -- and insertion share a transaction; two tabs cannot both be first.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(owner_id::text || ':' || item_id, 0)
  );
  select * into saved from public.attempts
    where user_id = owner_id
      and submission_id = (p_attempt->>'submission_id')::uuid;
  if found then
    return jsonb_build_object('duplicate', true, 'attempt', to_jsonb(saved));
  end if;
  insert into public.attempts (
    user_id, submission_id, lesson_id, exercise_id, exercise_version,
    response, correct, hint_used, independent_evidence, locale
  ) values (
    owner_id, (p_attempt->>'submission_id')::uuid,
    p_attempt->>'lesson_id', item_id, (p_attempt->>'exercise_version')::integer,
    p_attempt->'response', (p_attempt->>'correct')::boolean,
    (p_attempt->>'hint_used')::boolean,
    (p_attempt->>'correct')::boolean and not (p_attempt->>'hint_used')::boolean
      and not exists (select 1 from public.attempts
        where user_id = owner_id and exercise_id = item_id),
    p_attempt->>'locale'
  ) returning * into saved;
  return jsonb_build_object('duplicate', false, 'attempt', to_jsonb(saved));
end;
$$;

revoke all on function public.record_attempt(jsonb) from public, anon, authenticated;
grant execute on function public.record_attempt(jsonb) to service_role;
