-- GiftSoul: Follow creators
-- Run this in your Supabase project's SQL Editor.

create table if not exists follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, creator_id)
);

create index if not exists follows_user_id_idx on follows(user_id);
create index if not exists follows_creator_id_idx on follows(creator_id);

alter table follows enable row level security;

drop policy if exists "Users manage their own follows" on follows;
create policy "Users manage their own follows"
  on follows for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Follower counts should be publicly visible on creator profiles
drop policy if exists "Anyone can read follow counts" on follows;
create policy "Anyone can read follow counts"
  on follows for select
  using (true);
