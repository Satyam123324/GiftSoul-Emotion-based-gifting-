import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

// POST /api/pools/verify -> confirm a contribution payment
export async function POST(request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, contributionId, poolId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !contributionId) {
      return Response.json({ error: 'Missing payment verification fields' }, { status: 400 })
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return Response.json({ error: 'Payments are not configured yet.' }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      await supabaseAdmin
        .from('pool_contributions')
        .update({ status: 'failed' })
        .eq('id', contributionId)
        .eq('razorpay_order_id', razorpay_order_id)

      return Response.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('pool_contributions')
      .update({
        status: 'paid',
        razorpay_payment_id,
        paid_at: new Date().toISOString(),
      })
      .eq('id', contributionId)
      .eq('razorpay_order_id', razorpay_order_id)

    if (updateError) throw updateError

    // If this contribution completes the pool, mark it funded.
    let funded = false
    if (poolId) {
      const { data: pool } = await supabaseAdmin
        .from('gift_pools')
        .select('target_amount, status')
        .eq('id', poolId)
        .single()

      const { data: paidContribs } = await supabaseAdmin
        .from('pool_contributions')
        .select('amount')
        .eq('pool_id', poolId)
        .eq('status', 'paid')

      const raised = (paidContribs || []).reduce((s, c) => s + c.amount, 0)

      if (pool && raised >= pool.target_amount && pool.status === 'open') {
        await supabaseAdmin.from('gift_pools').update({ status: 'funded' }).eq('id', poolId)
        funded = true
      }
    }

    return Response.json({ success: true, funded })
  } catch (error) {
    return Response.json({ error: error.message || 'Could not verify payment' }, { status: 500 })
  }
}
