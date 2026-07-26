# Enabling real payments (Razorpay)

Three things need to happen before "Pay now" works:

## 1. Run the orders table migration
In Supabase Dashboard → SQL Editor, run `create-orders-table.sql`.

Note: this table intentionally has **no public RLS policies** — unlike your
other tables, nothing is readable/writable via the anon key. Only your
server-side API routes (using the service role key below) can touch it.
This is correct and expected for a payments table.

## 2. Get your Supabase service role key
Supabase Dashboard → Project Settings → API → `service_role` key
(NOT the `anon` key you already have — this is a different, more powerful key).

⚠️ This key bypasses all security rules. Never expose it to the browser,
never prefix it with `NEXT_PUBLIC_`, never commit it to a public repo.
It's used only inside `src/app/lib/supabaseAdmin.js`, which only runs
server-side in API routes.

## 3. Get your Razorpay keys
Sign up at https://razorpay.com if you haven't. Start in **Test Mode**
(top-left toggle in the dashboard) so you can test the whole flow with
fake card numbers before going live.

Dashboard → Settings → API Keys → Generate Test Key.

## 4. Add these to your `.env.local`

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_key_secret_here
```

Restart `npm run dev` after adding these — Next.js only reads `.env.local`
on startup.

## Testing a payment (test mode)
On the checkout popup, use Razorpay's official test card:
- Card number: `4111 1111 1111 1111`
- Any future expiry date, any CVV, any name
- For UPI test mode, use `success@razorpay`

## Going live
When ready for real money: switch Razorpay to Live Mode, generate Live API
keys, and replace the test keys in `.env.local` (or your production host's
environment variables) with the live ones. Nothing else in the code changes.

## What this does NOT include yet
- Refunds (would need a `/api/checkout/refund` route using Razorpay's Refunds API)
- Webhooks for handling delayed/async payment confirmations (current flow
  relies on the client-side handler firing, which covers the vast majority
  of card/UPI payments but isn't 100% bulletproof against e.g. the browser
  tab closing mid-payment). A production-hardened version should add a
  Razorpay webhook endpoint as a backup confirmation path.
- Creator payouts — this collects payment into your Razorpay account;
  actually splitting/paying out to individual creators is a separate,
  larger integration (Razorpay Route) if you want automated payouts later.
