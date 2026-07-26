import Razorpay from 'razorpay'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin, isPaymentsConfigured } from '../../../lib/supabaseAdmin'

// Public anon client is fine for a read-only price lookup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    if (!isPaymentsConfigured) {
      return Response.json(
        { error: 'Payments are not configured yet. Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and SUPABASE_SERVICE_ROLE_KEY to .env.local.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { productId, quantity, buyerName, buyerEmail, buyerPhone, personalisationNote, userId } = body

    if (!productId || !buyerName || !buyerEmail) {
      return Response.json({ error: 'productId, buyerName, and buyerEmail are required' }, { status: 400 })
    }
    const qty = Math.max(1, parseInt(quantity, 10) || 1)

    // Look up the real price server-side — never trust an amount sent from the client.
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, base_price, creator_id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    const amountInPaise = Math.round(product.base_price * qty * 100)

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `giftsoul_${Date.now()}`,
      notes: { productId, productName: product.name, quantity: qty },
    })

    const { data: dbOrder, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert([{
        product_id: product.id,
        creator_id: product.creator_id,
        buyer_user_id: userId || null,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone || null,
        quantity: qty,
        personalisation_note: personalisationNote || null,
        amount: amountInPaise,
        currency: 'INR',
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
      dbOrderId: dbOrder.id,
      productName: product.name,
    })
  } catch (error) {
    return Response.json({ error: error.message || 'Could not start checkout' }, { status: 500 })
  }
}
