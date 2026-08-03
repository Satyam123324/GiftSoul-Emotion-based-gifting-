# GiftSoul — Whole-Project Health Check

Static analysis of all 23 pages and 14 API routes. I can't run the app in my
environment (dev server hangs on the mounted folder) or reach your Supabase, so
runtime items below are marked "verify" and there's a manual checklist at the end.

Legend: ✅ works · ⚠️ works but depends on DB/data · ⛔ blocked by config · 🐞 has a bug

## Pages

| Page | Status | Notes |
|---|---|---|
| `/` home | ✅ | Static + links |
| `/faq` | ✅ | Static |
| `/corporate` | ⚠️ | Renders fine; the enquiry form POSTs to `/api/enquiries` — needs the `enquiries` table |
| `/find-gift` | ✅ | AI gift finder. Uses Groq (key set) + reads products. Works |
| `/marketplace` | ⚠️ | Reads `/api/products` — needs products in DB |
| `/product` | ✅ | Static category landing |
| `/product/[id]` | ⚠️/⛔ | Viewing + reviews work; **Buy button is blocked** (payments off); enquiry needs `enquiries` table |
| `/creators` | ⚠️ | Reads creators (only `is_active=true` show) |
| `/creator/[id]` | ⚠️ | Reads creator + their products |
| `/creator-register` | 🐞 | RLS fixed, but submits `POST` without `user_id` → duplicate/orphaned row (see Bugs) |
| `/login` | ✅ | Fixed (font + name validation). Login needs a confirmed Supabase auth user |
| `/dashboard` | ⚠️/⛔ | Add-product works; **orders section blocked** (reads via admin key) |
| `/gift-dna` | ⚠️ | Reads products |
| `/wishlist` | ✅ | localStorage + product reads |
| `/following` | ✅ | localStorage follows + reads |
| `/timeline` | ✅ | localStorage (gift log) |
| `/reminders` | ✅ | localStorage |
| `/surprise`, `/surprise/view` | ⚠️ | Reads products |
| `/stories` | ⚠️ | Reads `/api/stories` → `gift_requests` table (may be missing) |
| `/group-gift` | ⛔ | Gift pools — blocked (payments/admin key) |
| `/pool/[id]` | ⛔ | Pool contribution — blocked (payments/admin key) |
| `/orders` | ⛔ | Reads via admin key — blocked |

## API routes

| Route | Status | Depends on |
|---|---|---|
| `/api/products`, `/products/[id]` | ⚠️ | `products` table (anon read/insert) |
| `/api/creators` | ⚠️ | `creators` table + RLS policies (you added these) |
| `/api/reviews` | ✅ | `reviews` table (SQL exists) |
| `/api/suggest-gifts` | ✅ | Groq key (set); silently skips `gift_requests` save if missing |
| `/api/stories` | ⚠️ | `gift_requests` table (no SQL file) |
| `/api/enquiries` | ⚠️ | `enquiries` table (no SQL file) |
| `/api/orders` | ⛔ | `SUPABASE_SERVICE_ROLE_KEY` |
| `/api/checkout/create-order`, `/verify` | ⛔ | Razorpay keys + service key |
| `/api/pools`, `/pools/[id]`, `/contribute`, `/verify` | ⛔ | Razorpay keys + service key |

## The three things blocking you

**1. Payments/admin are entirely off.** `.env.local` has only 3 of 6 keys. Missing:
`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`. This disables:
checkout, gift pools, the orders page, and the dashboard's orders section. The code
guards this cleanly (no crash — it returns "Payments not configured").

**2. Two tables have no setup SQL:** `enquiries` and `gift_requests`. If they don't
exist in your Supabase, the corporate/enquiry form and the Stories page will error.
(`products` and `creators` also lack SQL files but clearly already exist.)

**3. Login/auth state.** "Invalid login credentials" = email not confirmed, or the
account doesn't exist yet. Handle in Supabase (confirm the user, or disable "Confirm
email" for dev).

## Bugs found

- 🐞 **`/creator-register` creates duplicate, unlinked creator rows.** It sends
  `POST /api/creators` **without `user_id`**, so it inserts a new row instead of
  updating the blank one made at signup. Result: two rows, and the profile isn't
  linked to the user — so the dashboard and post-login redirect won't recognize them
  as a creator. Fix: send `user_id` and use `PATCH`.
- ✅ Fixed: login logo used an unloaded font (`Playfair Display` → `Cormorant Garamond`).
- ✅ Fixed: signup allowed a blank name.

## What "just works" regardless of config

Home, FAQ, find-gift (AI), marketplace/product/creator browsing (with data), and all
localStorage features: wishlist, following, timeline, reminders.

## Manual test checklist (run on your machine — 2 min)

1. `/` loads, nav links work.
2. `/find-gift` → type a story → get AI suggestions. (Tests Groq + products.)
3. `/marketplace` → products show, filters work.
4. `/product/[id]` → opens; reviews load.
5. `/login` → Sign up a test user; confirm it; log in.
6. `/creator-register` → submit (expect the duplicate-row bug until fixed).
7. `/dashboard` → shows creator profile; add a product.
8. Buy / group-gift → expect "Payments not configured" until keys added.
