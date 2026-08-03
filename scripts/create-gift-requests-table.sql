-- GiftSoul: gift_requests table
-- Backs the AI gift-finder analytics (/api/suggest-gifts writes here) and the
-- public "Wall of Moments" (/api/stories reads here). Stores NO buyer name,
-- email, or contact info — only the anonymized story + detected tags — so it is
-- safe to surface publicly.
-- Run this in your Supabase project's SQL Editor.

create table if not exists gift_requests (
  id uuid primary key default gen_random_uuid(),
  story_text text,
  emotions_detected text[] default '{}',
  occasion text,
  recipient text,
  created_at timestamptz not null default now()
);

create index if not exists gift_requests_created_at_idx on gift_requests(created_at desc);

alter table gift_requests enable row level security;

-- The API uses the public anon key for both reading and writing.
drop policy if exists "Anyone can save a gift request" on gift_requests;
create policy "Anyone can save a gift request"
  on gift_requests for insert
  with check (true);

-- Stories are anonymized, so public read is fine.
drop policy if exists "Public can read gift requests" on gift_requests;
create policy "Public can read gift requests"
  on gift_requests for select
  using (true);
