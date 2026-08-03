-- GiftSoul: enquiries table
-- Backs /api/enquiries (product enquiries and the corporate contact form).
-- Columns match exactly what src/app/api/enquiries/route.js inserts.
-- Run this in your Supabase project's SQL Editor.

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  creator_id uuid references creators(id) on delete set null,
  buyer_name text,
  buyer_email text,
  buyer_phone text,
  message text,
  personalisation_note text,
  quantity int not null default 1,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists enquiries_creator_id_idx on enquiries(creator_id);
create index if not exists enquiries_created_at_idx on enquiries(created_at desc);

alter table enquiries enable row level security;

-- The API uses the public anon key, so allow inserts (enquiry submissions).
drop policy if exists "Anyone can submit an enquiry" on enquiries;
create policy "Anyone can submit an enquiry"
  on enquiries for insert
  with check (true);

-- NOTE: No public SELECT policy is created on purpose — enquiries hold buyer
-- name/email/phone. Read them from the Supabase dashboard, or later via the
-- service-role key on the server. (The GET in the route will return nothing
-- under the anon key until you wire it to the admin client.)
