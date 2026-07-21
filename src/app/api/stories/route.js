import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/stories?emotion=love -> recent, anonymized stories from the AI gift-finder
// Reuses the existing gift_requests table (story_text, emotions_detected, occasion,
// recipient) which never stores buyer name/email/contact info, so it's safe to
// surface publicly as-is as a "Wall of Moments".
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const emotion = searchParams.get('emotion')

    let query = supabase
      .from('gift_requests')
      .select('id, story_text, emotions_detected, occasion, recipient, created_at')
      .order('created_at', { ascending: false })
      .limit(40)

    const { data, error } = await query
    if (error) throw error

    let stories = (data || []).filter(s => s.story_text && s.story_text.trim().length > 0)

    if (emotion && emotion !== 'all') {
      stories = stories.filter(s =>
        (s.emotions_detected || []).some(e => e.toLowerCase().includes(emotion.toLowerCase()))
      )
    }

    return Response.json({ stories })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
