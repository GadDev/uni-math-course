-- Self-reported reading completion is independent of attempts and mastery.
create table public.lesson_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^L[0-9]{2}$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.lesson_completions enable row level security;
revoke all on public.lesson_completions from public, anon, authenticated;
grant select, insert, delete on public.lesson_completions to authenticated;
create policy completions_select_own on public.lesson_completions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy completions_insert_own on public.lesson_completions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy completions_delete_own on public.lesson_completions
  for delete to authenticated using ((select auth.uid()) = user_id);
