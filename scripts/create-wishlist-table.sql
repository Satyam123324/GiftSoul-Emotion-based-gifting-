-- GiftSoul: Real user wishlist (synced across devices when logged in)
-- Run this in your Supabase project's SQL Editor.

create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists wishlists_user_id_idx on wishlists(user_id);

alter table wishlists enable row level security;

-- Each user can only see/manage their own wishlist rows.
drop policy if exists "Users manage their own wishlist" on wishlists;
create policy "Users manage their own wishlist"
  on wishlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
