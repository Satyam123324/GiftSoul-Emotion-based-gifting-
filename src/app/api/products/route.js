import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET all published products, optional ?emotion=love filter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const emotion = searchParams.get('emotion')
    const creatorId = searchParams.get('creator_id')

    // Build the query with a given select shape. The reviews join is optional:
    // if that table hasn't been created yet, we retry without it rather than
    // failing the entire marketplace over a missing extra.
    function buildQuery(selectShape) {
      let q = supabase
        .from('products')
        .select(selectShape)
        .eq('is_published', true)

      if (emotion && emotion !== 'all') {
        q = q.contains('emotion_tags', [emotion])
      }
      if (creatorId) {
        q = q.eq('creator_id', creatorId)
      }
      return q.order('created_at', { ascending: false })
    }

    const withReviews = `*, creators(name, shop_name, city, instagram), reviews(rating)`
    const withoutReviews = `*, creators(name, shop_name, city, instagram)`

    let { data, error } = await buildQuery(withReviews)

    if (error) {
      // PostgREST reports a missing relationship (not a missing table) here,
      // so match on that wording instead of an error code.
      const missingReviewsTable =
        /relationship/i.test(error.message || '') && /reviews/i.test(error.message || '')

      if (!missingReviewsTable) throw error

      const retry = await buildQuery(withoutReviews)
      if (retry.error) throw retry.error
      // Normalise the shape so the UI's `p.reviews?.length` checks still work.
      data = (retry.data || []).map(p => ({ ...p, reviews: [] }))
    }

    return Response.json({ products: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST create new product — supports handmade or manufactured/sourced
export async function POST(request) {
  try {
    const body = await request.json()

    if (!body.name || !body.base_price) {
      return Response.json({ error: 'Product name and price are required.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        creator_id: body.creator_id || null,
        name: body.name,
        description: body.description || '',
        base_price: body.base_price,
        category: body.category || 'General',
        lead_time_days: body.lead_time_days || 5,
        emotion_tags: body.emotion_tags || [],
        occasion_tags: body.occasion_tags || [],
        recipient_tags: body.recipient_tags || [],
        images: body.images || [],
        product_type: body.product_type || 'handmade',
        is_published: true,
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ product: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}