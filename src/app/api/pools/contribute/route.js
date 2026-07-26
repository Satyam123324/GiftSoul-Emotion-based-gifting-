import Razorpay from 'razorpay'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin, isPaymentsConfigured } from '../../../lib/supabaseAdmin'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// POST /api/pools/contribute -> start a Razorpay order for one person's share
export async function POST(request) {
  try {
    if (!isPaymentsConfigured) {
      return Response.json(
        { error: 'Payments are not configured yet. Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and SUPABASE_SERVICE_ROLE_KEY to .env.local.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { poolId, contributorName, contributorEmail, amount, note } = body

    if (!poolId || !contributorName || !amount) {
      return Response.json({ error: 'poolId, contributorName and amount are required' }, { status: 400 })
    }

    const { data: pool, error: poolError } = await supabase
      .from('gift_pools')
      .select('id, target_amount, status, products(name)')
      .eq('id', poolId)
      .single()

    if (poolError || !pool) {
      return Response.json({ error: 'Group gift not found' }, { status: 404 })
    }
    if (pool.status !== 'open') {
      return Response.json({ error: 'This group gift is already fully funded.' }, { status: 400 })
    }

    // Recompute what's actually still needed, server-side.
    const { data: paidContribs } = await supabase
      .from('pool_contributions')
      .select('amount')
      .eq('pool_id', poolId)
      .eq('status', 'paid')

    const raised = (paidContribs || []).reduce((s, c) => s + c.amount, 0)
    const remaining = Math.max(0, pool.target_amount - raised)

    const amountInPaise = Math.round(Number(amount) * 100)
    if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
      return Response.json({ error: 'Please contribute at least ₹1.' }, { status: 400 })
    }
    if (amountInPaise > remaining) {
      return Response.json(
        { error: `Only ₹${(remaining / 100).toLocaleString('en-IN')} is still needed — please lower your amount.` },
        { status: 400 }
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `giftsoul_pool_${Date.now()}`,
      notes: { poolId, contributorName },
    })

    const { data: contribution, error: insertError } = await supabaseAdmin
      .from('pool_contributions')
      .insert([{
        pool_id: poolId,
        contributor_name: contributorName,
        contributor_email: contributorEmail || null,
        amount: amountInPaise,
        note: note || null,
        razorpay_order_id: razorpayOrder.id,
        status: 'created',
      }])
      .select()
      .single()

    if (insertError) throw insertError

    return Response.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      contributionId: contribution.id,
      productName: pool.products?.name || 'a gift',
    })
  } catch (error) {
    return Response.json({ error: error.message || 'Could not start checkout' }, { status: 500 })
  }
}
