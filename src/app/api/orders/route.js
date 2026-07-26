import { supabaseAdmin } from '../../lib/supabaseAdmin'

// GET /api/orders?buyer_user_id=xxx  -> a buyer's own paid orders
// GET /api/orders?creator_id=xxx     -> paid orders for a creator's products
//
// The orders table has no public RLS policies (see create-orders-table.sql),
// so this route uses the service-role admin client and filters explicitly
// by whichever id was requested — mirroring the same trust model the rest
// of this app already uses for its other API routes.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const buyerUserId = searchParams.get('buyer_user_id')
    const creatorId = searchParams.get('creator_id')

    if (!buyerUserId && !creatorId) {
      return Response.json({ error: 'buyer_user_id or creator_id is required' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('orders')
      .select('*, products(name, images, base_price)')
      .eq('status', 'paid')
      .order('paid_at', { ascending: false })

    if (buyerUserId) query = query.eq('buyer_user_id', buyerUserId)
    if (creatorId) query = query.eq('creator_id', creatorId)

    const { data, error } = await query
    if (error) throw error

    return Response.json({ orders: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
