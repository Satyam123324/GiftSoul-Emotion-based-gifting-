import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// POST /api/pools -> start a new group gift ("split a gift") pool
export async function POST(request) {
  try {
    const body = await request.json()
    const { productId, organiserName, organiserEmail, recipientName, occasion, message } = body

    if (!productId || !organiserName || !organiserEmail) {
      return Response.json({ error: 'productId, organiserName and organiserEmail are required' }, { status: 400 })
    }

    // Target amount comes from the real product price, never from the client.
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, base_price, creator_id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('gift_pools')
      .insert([{
        product_id: product.id,
        creator_id: product.creator_id,
        organiser_name: organiserName,
        organiser_email: organiserEmail,
        recipient_name: recipientName || null,
        occasion: occasion || null,
        message: message || null,
        target_amount: Math.round(product.base_price * 100),
        status: 'open',
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ pool: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
