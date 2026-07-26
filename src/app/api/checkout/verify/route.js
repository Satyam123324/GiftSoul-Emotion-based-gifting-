import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function POST(request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return Response.json({ error: 'Missing payment verification fields' }, { status: 400 })
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return Response.json({ error: 'Payments are not configured yet.' }, { status: 500 })
    }

    // Razorpay's documented verification: HMAC-SHA256 of "order_id|payment_id",
    // signed with your key secret, must match what Razorpay sent back.
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', dbOrderId)
        .eq('razorpay_order_id', razorpay_order_id)

      return Response.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 })
    }

    const { data: updated, error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id,
        paid_at: new Date().toISOString(),
      })
      .eq('id', dbOrderId)
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single()

    if (error) throw error

    return Response.json({ success: true, order: updated })
  } catch (error) {
    return Response.json({ error: error.message || 'Could not verify payment' }, { status: 500 })
  }
}
