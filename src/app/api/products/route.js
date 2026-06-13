import { supabase } from '../../../lib/supabase'

// GET all products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const emotion = searchParams.get('emotion')

    let query = supabase
      .from('products')
      .select(`*, creators(name, shop_name, city)`)
      .eq('is_published', true)

    if (emotion && emotion !== 'all') {
      query = query.contains('emotion_tags', [emotion])
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ products: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST create new product
export async function POST(request) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('products')
      .insert([{
        creator_id: body.creator_id,
        name: body.name,
        description: body.description,
        base_price: body.base_price,
        category: body.category,
        lead_time_days: body.lead_time_days || 5,
        stock_type: body.stock_type || 'made_to_order',
        emotion_tags: body.emotion_tags || [],
        occasion_tags: body.occasion_tags || [],
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