-- GiftSoul: Fix "new row violates row-level security policy for table creators"
-- Run this in your Supabase project's SQL Editor.
--
-- Why this is needed:
-- The /api/creators route connects with the public ANON key and does NOT
-- forward a logged-in user's session, so inside Supabase the request runs as
-- the `anon` role with auth.uid() = NULL. RLS is enabled on `creators` but has
-- no INSERT/UPDATE policy that permits this, so profile creation is blocked.
--
-- These policies allow the marketplace to read creators and let the API
-- create/update profiles. See the security note at the bottom for the
-- stricter long-term approach.

alter table creators enable row level security;

-- Anyone can view creator profiles (public marketplace listing).
drop policy if exists "Public can read creators" on creators;
create policy "Public can read creators"
  on creators for select
  using (true);

-- Allow creating a new creator profile (registration flow).
drop policy if exists "Anyone can create a creator profile" on creators;
create policy "Anyone can create a creator profile"
  on creators for insert
  with check (true);

-- Allow updating a creator profile (finishing registration / editing).
drop policy if exists "Anyone can update a creator profile" on creators;
create policy "Anyone can update a creator profile"
  on creators for update
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- SECURITY NOTE
-- `with check (true)` lets any request through the anon key insert/update rows.
-- That is fine to get unblocked now, but for production the safer pattern is:
--   1) Set SUPABASE_SERVICE_ROLE_KEY in .env.local, and
--   2) Have the /api/creators route use the admin client (supabaseAdmin),
--      which bypasses RLS server-side.
-- Then you can tighten these policies to, e.g.:
--   for insert with check (auth.uid() = user_id)
--   for update using (auth.uid() = user_id)
-- so users can only touch their own row.
-- ---------------------------------------------------------------------------
