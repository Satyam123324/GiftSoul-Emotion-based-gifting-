import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET all active creators, or ?user_id=xxx to fetch the creator profile for a specific logged-in user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    let query = supabase.from('creators').select('*')

    if (userId) {
      // Fetch this specific user's own creator profile (used by dashboard)
      query = query.eq('user_id', userId)
    } else {
      // Public marketplace listing — only active, approved creators
      query = query.eq('is_active', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    if (userId) {
      return Response.json({ creator: data?.[0] || null })
    }
    return Response.json({ creators: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// POST create a new creator profile — either a blank one at signup, or a full one from creator-register
export async function POST(request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('creators')
      .insert([{
        user_id: body.user_id || null,
        name: body.name || '',
        shop_name: body.shop_name || '',
        bio: body.bio || '',
        city: body.city || '',
        craft_tags: body.craft_tags || [],
        emotion_tags: body.emotion_tags || [],
        instagram: body.instagram || null,
        whatsapp: body.whatsapp || null,
        photo_url: body.photo_url || null,
        is_active: body.is_active !== undefined ? body.is_active : false,
        is_verified: false,
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ creator: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// PATCH update an existing creator's profile (used when finishing registration or editing in dashboard)
export async function PATCH(request) {
  try {
    const body = await request.json()

    if (!body.user_id) {
      return Response.json({ error: 'user_id is required to update a profile.' }, { status: 400 })
    }

    const updateFields = {}
    const allowed = ['name', 'shop_name', 'bio', 'city', 'craft_tags', 'emotion_tags', 'instagram', 'whatsapp', 'photo_url', 'is_active']
    for (const key of allowed) {
      if (body[key] !== undefined) updateFields[key] = body[key]
    }

    const { data, error } = await supabase
      .from('creators')
      .update(updateFields)
      .eq('user_id', body.user_id)
      .select()
      .single()

    if (error) throw error
    return Response.json({ creator: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}