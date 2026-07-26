-- GiftSoul: Group Gifting ("Split a Gift")
-- Lets several people chip in together on one gift.
-- Run this in your Supabase project's SQL Editor.

create table if not exists gift_pools (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  creator_id uuid references creators(id) on delete set null,
  organiser_name text not null,
  organiser_email text not null,
  recipient_name text,
  occasion text,
  message text,
  target_amount integer not null,          -- in paise
  status text not null default 'open',     -- open | funded | closed
  created_at timestamptz not null default now()
);

create table if not exists pool_contributions (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references gift_pools(id) on delete cascade,
  contributor_name text not null,
  contributor_email text,
  amount integer not null,                 -- in paise
  note text,
  razorpay_order_id text unique,
  razorpay_payment_id text,
  status text not null default 'created',  -- created | paid | failed
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists pool_contributions_pool_id_idx on pool_contributions(pool_id);
create index if not exists pool_contributions_rzp_order_idx on pool_contributions(razorpay_order_id);

-- Pools are shared by link, so they need to be publicly readable.
alter table gift_pools enable row level security;

drop policy if exists "Anyone can read gift pools" on gift_pools;
create policy "Anyone can read gift pools"
  on gift_pools for select
  using (true);

-- Contributions involve money, so writes go through the server (service-role)
-- only. Reads are public so everyone can see the progress bar and who chipped in.
alter table pool_contributions enable row level security;

drop policy if exists "Anyone can read contributions" on pool_contributions;
create policy "Anyone can read contributions"
  on pool_contributions for select
  using (true);

-- No insert/update policies on purpose: only the service-role key (used in
-- the checkout API routes) can create or mark contributions as paid.
