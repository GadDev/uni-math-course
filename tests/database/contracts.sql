begin;
set local role service_role;
select public.record_attempt('{
  "user_id":"00000000-0000-4000-8000-000000000001",
  "submission_id":"00000000-0000-4000-8000-000000000011",
  "lesson_id":"L05","exercise_id":"L05-E01","exercise_version":1,
  "response":{"optionId":"10"},"correct":true,"hint_used":false,"locale":"en"
}');
-- Same id stays idempotent even when a retry sends different contents.
select public.record_attempt('{
  "user_id":"00000000-0000-4000-8000-000000000001",
  "submission_id":"00000000-0000-4000-8000-000000000011",
  "lesson_id":"L05","exercise_id":"L05-E01","exercise_version":1,
  "response":{"optionId":"00"},"correct":false,"hint_used":false,"locale":"fr"
}');
select public.record_attempt('{
  "user_id":"00000000-0000-4000-8000-000000000002",
  "submission_id":"00000000-0000-4000-8000-000000000012",
  "lesson_id":"L05","exercise_id":"L05-E01","exercise_version":1,
  "response":{"optionId":"10"},"correct":true,"hint_used":true,"locale":"en"
}');
reset role;
do $$ begin
  if (select count(*) from public.attempts) <> 2 then raise exception 'Duplicate attempt'; end if;
  if (select count(*) from public.attempts where independent_evidence) <> 1 then raise exception 'Hint evidence'; end if;
end $$;

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
do $$ begin
  if (select count(*) from public.attempts) <> 1 then raise exception 'RLS leaked another owner'; end if;
  if exists (select 1 from public.attempts where not correct) then raise exception 'Duplicate rewrote grade'; end if;
  begin
    insert into public.attempts select * from public.attempts;
    raise exception 'Authenticated insert allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.attempts set correct = false;
    raise exception 'Authenticated update allowed';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.attempts;
    raise exception 'Authenticated delete allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.record_attempt('{}');
    raise exception 'Authenticated RPC allowed';
  exception when insufficient_privilege then null; end;
end $$;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
do $$ begin
  if (select count(*) from public.attempts) <> 1 then raise exception 'Second owner RLS'; end if;
end $$;
set local role anon;
do $$ begin
  begin
    perform * from public.attempts;
    raise exception 'Anonymous read allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.record_attempt('{}');
    raise exception 'Anonymous RPC allowed';
  exception when insufficient_privilege then null; end;
end $$;
rollback;
