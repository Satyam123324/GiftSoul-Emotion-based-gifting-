// src/app/api/enquiries/route.js
// Saves enquiry to Supabase + sends email to creator via Resend (free tier)

export async function POST(request) {
  try {
    const body = await request.json()

    const {
      product_id,
      creator_id,
      creator_email,   // creator's email — fetch from DB or pass from frontend
      creator_name,
      product_name,
      buyer_name,
      buyer_email,
      buyer_phone,
      message,
      personalisation_note,
      quantity = 1,
    } = body

    // ── 1. Validate required fields ───────────────────────
    if (!buyer_name || !buyer_email || !message) {
      return Response.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    // ── 2. Save enquiry to Supabase ───────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let savedEnquiry = null

    if (supabaseUrl && supabaseKey) {
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/enquiries`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          product_id: product_id || null,
          creator_id: creator_id || null,
          buyer_name,
          buyer_email,
          buyer_phone: buyer_phone || null,
          message,
          personalisation_note: personalisation_note || null,
          quantity,
          status: 'new',
        }),
      })

      const dbData = await dbRes.json()
      if (Array.isArray(dbData) && dbData.length > 0) {
        savedEnquiry = dbData[0]
      }
    }

    // ── 3. Send email via Resend ──────────────────────────
    const resendKey = process.env.RESEND_API_KEY
    let emailSent = false

    if (resendKey && creator_email) {
      // Email TO creator
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'GiftSoul <noreply@giftsoul.in>',
          to: [creator_email],
          reply_to: buyer_email,
          subject: `✨ New enquiry for "${product_name || 'your product'}" — GiftSoul`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
</head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;border:1px solid #D9CDB8;">
    
    <!-- Header -->
    <div style="background:#3D2B1F;padding:32px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#F7F3EE;margin:0;">
        Gift<em style="font-style:italic;color:#D4856A;">Soul</em>
      </p>
      <p style="font-size:13px;color:rgba(247,243,238,.5);margin:8px 0 0;letter-spacing:.1em;text-transform:uppercase;">New enquiry received</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:300;color:#3D2B1F;margin:0 0 8px;">
        Hi ${creator_name || 'there'}! ✨
      </p>
      <p style="font-size:15px;color:#7A6A5A;line-height:1.7;margin:0 0 24px;">
        Someone is interested in your work on GiftSoul. Here are the details:
      </p>

      <!-- Enquiry box -->
      <div style="background:#F7F3EE;border-radius:14px;padding:24px;margin-bottom:24px;border:1px solid #D9CDB8;">
        <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#C4A882;margin:0 0 16px;">Enquiry details</p>
        
        ${product_name ? `
        <div style="margin-bottom:12px;">
          <span style="font-size:11px;color:#7A6A5A;display:block;margin-bottom:2px;">Gift enquired about</span>
          <span style="font-size:15px;font-weight:500;color:#3D2B1F;">${product_name}</span>
        </div>` : ''}

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div>
            <span style="font-size:11px;color:#7A6A5A;display:block;margin-bottom:2px;">From</span>
            <span style="font-size:15px;font-weight:500;color:#3D2B1F;">${buyer_name}</span>
          </div>
          <div>
            <span style="font-size:11px;color:#7A6A5A;display:block;margin-bottom:2px;">Quantity</span>
            <span style="font-size:15px;font-weight:500;color:#3D2B1F;">${quantity}</span>
          </div>
        </div>

        <div style="background:white;border-radius:10px;padding:16px;border:1px solid #D9CDB8;">
          <span style="font-size:11px;color:#7A6A5A;display:block;margin-bottom:6px;">Their message</span>
          <p style="font-family:Georgia,serif;font-size:15px;color:#3D2B1F;font-style:italic;line-height:1.65;margin:0;">"${message}"</p>
        </div>

        ${personalisation_note ? `
        <div style="margin-top:12px;background:rgba(181,98,42,.06);border-radius:10px;padding:14px;border-left:3px solid #B5622A;">
          <span style="font-size:11px;color:#B5622A;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.1em;">Personalisation note</span>
          <p style="font-size:14px;color:#3D2B1F;margin:0;line-height:1.6;">${personalisation_note}</p>
        </div>` : ''}
      </div>

      <!-- Reply CTA -->
      <a href="mailto:${buyer_email}?subject=Re: Your GiftSoul enquiry for ${encodeURIComponent(product_name || 'your item')}"
        style="display:block;text-align:center;padding:14px 24px;background:#B5622A;color:white;text-decoration:none;border-radius:40px;font-size:14px;font-weight:500;letter-spacing:.06em;margin-bottom:20px;">
        Reply to ${buyer_name} →
      </a>

      <p style="font-size:13px;color:#C4A882;text-align:center;margin:0;">
        Or email them directly at <a href="mailto:${buyer_email}" style="color:#B5622A;">${buyer_email}</a>
        ${buyer_phone ? `<br>Phone: ${buyer_phone}` : ''}
      </p>
    </div>

    <!-- Tips -->
    <div style="background:#EDE6DA;padding:24px 40px;border-top:1px solid #D9CDB8;">
      <p style="font-size:12px;font-weight:500;color:#3D2B1F;margin:0 0 8px;">💡 Tips for a great response</p>
      <ul style="font-size:12px;color:#7A6A5A;margin:0;padding-left:16px;line-height:1.8;">
        <li>Reply within 12 hours — fast replies get more orders</li>
        <li>Confirm availability and lead time upfront</li>
        <li>Share a photo of a similar piece if you have one</li>
        <li>Mention your payment method (UPI / bank transfer)</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px;text-align:center;border-top:1px solid #D9CDB8;">
      <p style="font-size:12px;color:#C4A882;margin:0;">© 2026 GiftSoul · Made with love in India</p>
    </div>
  </div>
</body>
</html>
          `,
        }),
      })
      emailSent = true
    }

    // ── 4. Send confirmation email TO buyer ───────────────
    if (resendKey && buyer_email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'GiftSoul <noreply@giftsoul.in>',
          to: [buyer_email],
          subject: `Your gift enquiry has been sent — GiftSoul`,
          html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'DM Sans',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;border:1px solid #D9CDB8;">
    <div style="background:#3D2B1F;padding:32px 40px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#F7F3EE;margin:0;">
        Gift<em style="font-style:italic;color:#D4856A;">Soul</em>
      </p>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:300;color:#3D2B1F;margin:0 0 12px;">
        Your enquiry is on its way, ${buyer_name.split(' ')[0]}! 🎁
      </p>
      <p style="font-size:15px;color:#7A6A5A;line-height:1.7;margin:0 0 20px;">
        ${creator_name ? `We've notified <strong style="color:#3D2B1F;">${creator_name}</strong> about your interest` : 'The creator has been notified'} in <strong style="color:#3D2B1F;">${product_name || 'their handmade gift'}</strong>. They usually respond within 12 hours.
      </p>
      <div style="background:#F7F3EE;border-radius:14px;padding:20px;margin-bottom:24px;">
        <p style="font-size:13px;color:#7A6A5A;margin:0 0 10px;font-weight:500;">Your message:</p>
        <p style="font-family:Georgia,serif;font-size:15px;color:#3D2B1F;font-style:italic;margin:0;line-height:1.65;">"${message}"</p>
      </div>
      <a href="https://gift-soul-emotion-based-gifting-fw6m-eepoakvcs.vercel.app/marketplace"
        style="display:block;text-align:center;padding:14px 24px;background:#B5622A;color:white;text-decoration:none;border-radius:40px;font-size:14px;font-weight:500;margin-bottom:16px;">
        Browse more gifts →
      </a>
    </div>
    <div style="padding:16px 40px;text-align:center;border-top:1px solid #D9CDB8;">
      <p style="font-size:12px;color:#C4A882;margin:0;">© 2026 GiftSoul · Made with love in India</p>
    </div>
  </div>
</body>
</html>
          `,
        }),
      })
    }

    return Response.json({
      success: true,
      enquiry: savedEnquiry,
      emailSent,
      message: 'Enquiry sent! The creator has been notified.',
    })

  } catch (error) {
    console.error('Enquiry error:', error)
    return Response.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creator_id')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Database not configured' }, { status: 500 })
    }

    const url = creatorId
      ? `${supabaseUrl}/rest/v1/enquiries?creator_id=eq.${creatorId}&order=created_at.desc`
      : `${supabaseUrl}/rest/v1/enquiries?order=created_at.desc&limit=50`

    const res = await fetch(url, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })

    const data = await res.json()
    return Response.json({ enquiries: data })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}