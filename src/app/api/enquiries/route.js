import { supabase } from '../../../lib/supabase'

// POST send enquiry
export async function POST(request) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{
        product_id: body.product_id,
        creator_id: body.creator_id,
        buyer_name: body.buyer_name,
        buyer_email: body.buyer_email,
        buyer_phone: body.buyer_phone,
        message: body.message,
        personalisation_note: body.personalisation_note,
        quantity: body.quantity || 1,
        status: 'new',
      }])
      .select()
      .single()

    if (error) throw error
    return Response.json({ enquiry: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// GET enquiries for a creator
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creator_id')

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ enquiries: data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}