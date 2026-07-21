import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/reviews?product_id=xxx -> { reviews: [...], average: 4.5, count: 12 }
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')

    if (!productId) {
      return Response.json({ error: 'product_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const count = data.length
    const average = count > 0
      ? Math.round((data.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0

    return Response.json({ reviews: data, average, count })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/reviews -> submit a new review
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.product_id || !body.buyer_name || !body.rating) {
      return Response.json({ error: 'product_id, buyer_name, and rating are required' }, { status: 400 })
    }
    const rating = parseInt(body.rating, 10)
    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id: body.product_id,
        creator_id: body.creator_id || null,
        buyer_name: body.buyer_name,
        rating,
        comment: body.comment || '',
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ review: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
