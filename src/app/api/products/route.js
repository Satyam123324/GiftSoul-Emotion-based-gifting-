import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET all published products, optional ?emotion=love filter
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const emotion = searchParams.get('emotion')

    let query = supabase
      .from('products')
      .select(`*, creators(name, shop_name, city, instagram_link)`)
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