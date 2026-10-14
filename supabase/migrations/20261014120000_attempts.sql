-- Learner attempts: one row per graded submission.
-- Grades are computed by the server only. Browser-facing roles can read their own
-- rows and can never write, so a caller cannot forge a grade through the Data API.
-- Writes go through the server using a server-only key (bypasses RLS); that key
-- must never be shipped to the browser or committed.

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Client-generated UUID; makes resubmission idempotent per learner.
  submission_id uuid not null,
  lesson_id text not null check (lesson_id ~ '^L[0-9]{2}$'),
  exercise_id text not null check (exercise_id ~ '^L[0-9]{2}-E[0-9]{2}$'),
  exercise_version integer not null check (exercise_version > 0),
  -- Normalised learner response (option id, or truth-table cells), already validated.
  response jsonb not null,
  correct boolean not null,
  -- Evidence rules from the exercise contract: only a first, unaided response counts.
  hint_used boolean not null default false,
  independent_evidence boolean not null default false,
  locale text not null check (locale in ('fr', 'en')),
  created_at timestamptz not null default now(),
  unique (user_id, submission_id)
);

create index attempts_user_created_idx
  on public.attempts (user_id, created_at desc);
create index attempts_user_exercise_idx
  on public.attempts (user_id, exercise_id);

alter table public.attempts enable row level security;

-- Owners may read their own attempts. No insert/update/delete policy exists.
create policy "attempts_select_own"
  on public.attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Defence in depth: remove table privileges from browser-facing roles.
revoke all on public.attempts from anon, authenticated;
grant select on public.attempts to authenticated;
