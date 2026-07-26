import { createClient } from '@supabase/supabase-js'

// SERVER-ONLY. Uses the service role key, which bypasses Row Level Security.
// Never import this file from a 'use client' component or expose this key
// with a NEXT_PUBLIC_ prefix — it must only ever run in API routes / server code.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Falls back to a harmless placeholder key so the client can always be
// constructed (avoids crashing the build/boot when the env var isn't set
// yet). Any real query against it will simply fail with an auth error at
// request time instead — which the API routes already catch and report.
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || 'placeholder-service-role-key-not-configured',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export const isPaymentsConfigured = Boolean(serviceRoleKey && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
