import { supabase } from '../../../lib/supabase'

// GET all creators
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ creators: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST create new creator
export async function POST(request) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('creators')
      .insert([{
        name: body.name,
        shop_name: body.shop_name,
        bio: body.bio,
        city: body.city,
        craft_tags: body.craft_tags || [],
        emotion_tags: body.emotion_tags || [],
        instagram: body.instagram,
        whatsapp: body.whatsapp,
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ creator: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}