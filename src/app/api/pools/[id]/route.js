import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// GET /api/pools/[id] -> pool details, paid contributions, and progress
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const { data: pool, error: poolError } = await supabase
      .from('gift_pools')
      .select('*, products(name, images, base_price, lead_time_days), creators(name, shop_name, city)')
      .eq('id', id)
      .single()

    if (poolError || !pool) {
      return Response.json({ error: 'This group gift could not be found.' }, { status: 404 })
    }

    const { data: contributions, error: contribError } = await supabase
      .from('pool_contributions')
      .select('id, contributor_name, amount, note, created_at')
      .eq('pool_id', id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false })

    if (contribError) throw contribError

    const raised = (contributions || []).reduce((sum, c) => sum + c.amount, 0)
    const remaining = Math.max(0, pool.target_amount - raised)

    return Response.json({
      pool,
      contributions: contributions || [],
      raised,
      remaining,
      percent: pool.target_amount > 0 ? Math.min(100, Math.round((raised / pool.target_amount) * 100)) : 0,
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
