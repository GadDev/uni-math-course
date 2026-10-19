begin;
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
insert into public.lesson_completions(user_id, lesson_id)
values ('00000000-0000-4000-8000-000000000001', 'L01');
-- A repeated explicit completion is harmless and preserves the first timestamp.
insert into public.lesson_completions(user_id, lesson_id)
values ('00000000-0000-4000-8000-000000000001', 'L01') on conflict do nothing;
do $$ begin
  if (select count(*) from public.lesson_completions) <> 1 then raise exception 'Duplicate completion'; end if;
  begin
    insert into public.lesson_completions(user_id, lesson_id)
    values ('00000000-0000-4000-8000-000000000002', 'L02');
    raise exception 'Foreign completion insert allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.lesson_completions set user_id = '00000000-0000-4000-8000-000000000002';
    raise exception 'Completion owner update allowed';
  exception when insufficient_privilege then null; end;
end $$;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
do $$ begin
  if exists (select 1 from public.lesson_completions) then raise exception 'Foreign completion read'; end if;
end $$;
delete from public.lesson_completions;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
do $$ begin
  if (select count(*) from public.lesson_completions) <> 1 then raise exception 'Foreign completion delete'; end if;
end $$;
delete from public.lesson_completions where lesson_id = 'L01';
do $$ begin
  if exists (select 1 from public.lesson_completions) then raise exception 'Completion undo failed'; end if;
end $$;
set local role anon;
do $$ begin
  begin
    perform * from public.lesson_completions;
    raise exception 'Anonymous completion read allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.lesson_completions(user_id, lesson_id)
    values ('00000000-0000-4000-8000-000000000001', 'L01');
    raise exception 'Anonymous completion insert allowed';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.lesson_completions;
    raise exception 'Anonymous completion delete allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
insert into public.lesson_completions(user_id, lesson_id)
values ('00000000-0000-4000-8000-000000000001', 'L01');
delete from auth.users where id = '00000000-0000-4000-8000-000000000001';
do $$ begin
  if exists (select 1 from public.lesson_completions) then raise exception 'Completion account deletion cascade'; end if;
end $$;
rollback;
