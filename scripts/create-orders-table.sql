-- GiftSoul: Real orders (Razorpay-backed payments)
-- Run this in your Supabase project's SQL Editor.
--
-- IMPORTANT — this table is more locked-down than the rest of your tables.
-- Payment records shouldn't be readable or writable by the public anon key
-- at all. The checkout API routes use your SUPABASE_SERVICE_ROLE_KEY
-- (server-only, never exposed to the browser) to bypass RLS safely.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  creator_id uuid references creators(id),
  buyer_user_id uuid references auth.users(id),
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  quantity integer not null default 1,
  personalisation_note text,
  amount integer not null,              -- in paise (smallest currency unit)
  currency text not null default 'INR',
  razorpay_order_id text unique,
  razorpay_payment_id text,
  status text not null default 'created', -- created | paid | failed
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_razorpay_order_id_idx on orders(razorpay_order_id);
create index if not exists orders_buyer_user_id_idx on orders(buyer_user_id);

alter table orders enable row level security;

-- No policies are created here on purpose. With RLS enabled and zero
-- policies, the anon/authenticated roles get NO access at all — every
-- read/write must go through the service-role key in your API routes.
