-- GiftSoul: Fix "new row violates row-level security policy for table products"
-- Run this in your Supabase project's SQL Editor, then re-run:
--   node scripts/seed-products.js
--
-- Why: seed-products.js and the dashboard "add product" flow both connect with
-- the public ANON key. RLS is enabled on `products` but has no INSERT policy, so
-- every insert is rejected. These policies allow the marketplace to read products
-- and let the app create/update them. See the security note at the bottom.

alter table products enable row level security;

-- Public marketplace can read products.
drop policy if exists "Public can read products" on products;
create policy "Public can read products"
  on products for select
  using (true);

-- Allow creating products (seed script + creator dashboard).
drop policy if exists "Anyone can create a product" on products;
create policy "Anyone can create a product"
  on products for insert
  with check (true);

-- Allow updating products (edit / publish toggle from the dashboard).
drop policy if exists "Anyone can update a product" on products;
create policy "Anyone can update a product"
  on products for update
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- SECURITY NOTE
-- `with check (true)` lets any anon-key request insert/update products. Fine to
-- get seeded and unblocked now. For production, add SUPABASE_SERVICE_ROLE_KEY
-- and have the write routes use the admin client, then tighten these to tie a
-- product to its creator, e.g.:
--   for update using (creator_id = ...)   -- scoped to the logged-in creator
-- ---------------------------------------------------------------------------
