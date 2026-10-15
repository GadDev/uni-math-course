-- The server writes attempts with the secret key, which maps to service_role.
-- That key bypasses row-level security but not table privileges, and a table
-- created through SQL may not grant them. Browser-facing roles stay read-only
-- (see 20261014120000_attempts.sql); only the server-only role gains write access.
grant select, insert on public.attempts to service_role;
