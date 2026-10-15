#!/usr/bin/env bash
set -euo pipefail
: "${TEST_DATABASE_URL:?Set TEST_DATABASE_URL to an empty disposable PostgreSQL database}"
psql "$TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f tests/database/bootstrap.sql
for migration in supabase/migrations/*.sql; do
  psql "$TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f "$migration"
done
psql "$TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f tests/database/contracts.sql

# Real overlapping transactions on distinct connections, same owner/exercise.
submit() {
  psql "$TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 <<SQL
begin;
set local role service_role;
select public.record_attempt('{"user_id":"00000000-0000-4000-8000-000000000001",
"submission_id":"00000000-0000-4000-8000-0000000000$1",
"lesson_id":"L05","exercise_id":"L05-E02","exercise_version":1,
"response":{"cells":{}},"correct":true,"hint_used":false,"locale":"en"}');
select pg_sleep(0.3);
commit;
SQL
}
submit 21 & first=$!
submit 22 & second=$!
wait "$first"
wait "$second"
psql "$TEST_DATABASE_URL" -X -v ON_ERROR_STOP=1 <<'SQL'
do $$ begin
  if (select count(*) from public.attempts where independent_evidence) <> 1
    or (select count(*) from public.attempts) <> 2 then
    raise exception 'Concurrent submissions both counted as first';
  end if;
end $$;
SQL
