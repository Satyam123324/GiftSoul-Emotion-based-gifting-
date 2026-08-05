# GiftSoul — Emotion-based gifting platform

GiftSoul is an AI-powered gifting marketplace connecting buyers with handmade
creators across India. Users share a heartfelt story, and the app recommends
gifts matched to the emotion, occasion, and recipient — then supports checkout,
group gifting, wishlists, and creator stories.

Built with **Next.js (App Router)**, **React**, **Supabase** (auth + database +
storage), **Groq** (LLaMA-based AI gift matching), and **Razorpay** (payments).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Full configuration — environment keys, database SQL, Supabase auth, and payments —
is documented in **[SETUP.md](./SETUP.md)**. A project health map lives in
**[PROJECT-HEALTH.md](./PROJECT-HEALTH.md)**.

## Environment

Copy `.env.local.example` to `.env.local` and fill in the six keys (Supabase URL,
anon key, service-role key, Groq key, and two Razorpay keys). See SETUP.md.

## Database

Run the SQL files in `scripts/` once in the Supabase SQL Editor (creates tables
and row-level-security policies), then optionally seed a catalog:

```bash
node scripts/seed-products.js
```

## Project structure

- `src/app` — pages (App Router) and API routes
- `src/app/api` — server routes for products, creators, orders, pools, enquiries, AI suggestions
- `src/app/lib` — Supabase clients, auth hooks, shared taxonomy
- `scripts` — database setup SQL and the product seeder

## Recent changes

- Added a full password-reset flow (recovery link → set-new-password screen).
- Professionalized login/signup: Google sign-in, forgot password, resend
  confirmation, show/hide password, inline validation, and clearer error messages.
- Fixed creator registration to link profiles to the logged-in user (no more
  duplicate/orphaned rows) and to save the uploaded profile photo.
- Fixed an `instagram` column mismatch in product queries.
- Added missing table SQL (`enquiries`, `gift_requests`) and RLS-fix scripts for
  `creators` and `products`, plus an `.env.local.example` template.
- Cleaned out dead files, boilerplate, and an unused dependency.
