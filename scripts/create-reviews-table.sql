-- GiftSoul: Reviews & Ratings
-- Run this in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query).

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  creator_id uuid references creators(id) on delete set null,
  buyer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on reviews(product_id);

-- Row Level Security: allow anyone to read reviews, and anyone to submit one
-- (matches the same permissive pattern already used by your products/enquiries tables).
alter table reviews enable row level security;

drop policy if exists "Public can read reviews" on reviews;
create policy "Public can read reviews"
  on reviews for select
  using (true);

drop policy if exists "Public can submit reviews" on reviews;
create policy "Public can submit reviews"
  on reviews for insert
  with check (true);
