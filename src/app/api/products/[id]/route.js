import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET a single product by id, with creator info joined
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('products')
      .select(`*, creators(id, name, shop_name, city, instagram_link)`)
      .eq('id', id)
      .single()

    if (error) throw error
    return Response.json({ product: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
