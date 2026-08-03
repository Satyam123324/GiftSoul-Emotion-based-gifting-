# GiftSoul — Setup & Getting Fully Working

Follow these once to take the app from "runs" to "everything works."

## 1. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in all six keys:

| Key | Needed for | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Everything | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Everything | same page (anon public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Orders, gift pools | same page (service_role secret — server only) |
| `GROQ_API_KEY` | AI gift finder | https://console.groq.com/keys |
| `RAZORPAY_KEY_ID` | Checkout, pool payments | Razorpay → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Checkout, pool payments | same |

Until the service-role + Razorpay keys are set, payment features cleanly report
"Payments are not configured yet" instead of crashing.

## 3. Database (Supabase → SQL Editor)

Run each file in `scripts/` once:

- `fix-creators-rls.sql` — lets creator profiles be created/updated (fixes the
  "row-level security policy" error on registration)
- `create-enquiries-table.sql` — product & corporate enquiry forms
- `create-gift-requests-table.sql` — AI gift-finder analytics + the Stories page
- `create-orders-table.sql`, `create-reviews-table.sql`, `create-wishlist-table.sql`,
  `create-follows-table.sql`, `create-gift-pools-tables.sql` — the rest

(The `products` and `creators` tables already exist in your project.)

Also create two Storage buckets (Supabase → Storage) used by image uploads:
`product-images` and `creator-photos`.

## 4. Supabase Auth settings

- For development, Authentication → Providers → Email → turn **Confirm email OFF**
  so new signups can log in immediately. Turn it back on before launch.
- New creators are created with `is_active = false` (an approval gate). Flip a
  creator's `is_active` to `true` in the Table Editor for them to appear publicly.

## 5. Optional: seed some products

```bash
node scripts/seed-products.js
```

Reads your `.env.local` and inserts a starter catalog.

## How the creator flow works

1. Sign up at `/login` (choose "Creator") — creates the auth account + a blank,
   linked creator row.
2. Complete `/creator-register` — fills in that same row (now linked by `user_id`).
3. You approve them by setting `is_active = true` in Supabase.
4. They log in → land on `/dashboard` → add products.

## Known limitations / notes

- Reading enquiries in-app is intentionally disabled (they hold buyer contact
  info); view them in the Supabase dashboard, or wire the route to the
  service-role key later.
- The AI finder saves anonymized stories to `gift_requests`; if that insert fails
  it's ignored and the suggestions still return.
