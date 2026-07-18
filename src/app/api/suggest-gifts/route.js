import { supabase } from '../../lib/supabase'

export async function POST(request) {
  try {
    const { story } = await request.json()

    if (!story || story.trim().length < 10) {
      return Response.json({ error: 'Please share a longer story' }, { status: 400 })
    }

    const key = process.env.GROQ_API_KEY
    if (!key) {
      return Response.json({ error: 'GROQ_API_KEY not found' }, { status: 500 })
    }

    // Step 1 — Ask AI to detect emotion from story
    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: `You are GiftSoul's emotion detection AI for an Indian handmade gifting platform.
Read the story and return ONLY valid JSON — no extra text, no markdown, no backticks.`
          },
          {
            role: 'user',
            content: `Analyze this gifting story:

"${story}"

Return ONLY this JSON:
{
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "occasion": "brief occasion",
  "recipient": "who the gift is for",
  "tone": "warm",
  "message": "A warm 2-sentence message to the gift-giver explaining what emotions you detected.",
  "gift_note": "What to write on the card or how to personalise the gift"
}

Choose emotions from: love, grief, celebration, gratitude, nostalgia, friendship, apology, new beginnings, self-care, achievement, comfort, romance, hope, pride`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const aiData = await aiResponse.json()
    if (aiData.error) {
      return Response.json({ error: aiData.error.message }, { status: 500 })
    }

    const rawText = aiData.choices?.[0]?.message?.content
    if (!rawText) {
      return Response.json({ error: 'No response from AI' }, { status: 500 })
    }

    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const aiResult = JSON.parse(cleaned)

    // Step 2 — Fetch real products from Supabase
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select(`
        *,
        creators (
          name,
          shop_name,
          city
        )
      `)
      .eq('is_published', true)

    if (dbError) {
      return Response.json({ error: dbError.message }, { status: 500 })
    }

    // Step 3 — Match products by emotion score
    const matched = products
      .map(p => ({
        ...p,
        icon: getCategoryIcon(p.category),
        score: p.emotion_tags
          ? p.emotion_tags.filter(e =>
              aiResult.emotions.some(ae =>
                ae.toLowerCase().includes(e.toLowerCase()) ||
                e.toLowerCase().includes(ae.toLowerCase())
              )
            ).length
          : 0
      }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)

    // If no matches use top 4 products
    const suggestions = matched.length > 0 ? matched : products.slice(0, 4).map(p => ({
      ...p,
      icon: getCategoryIcon(p.category)
    }))

    // Step 4 — Save this request to database for analytics
    await supabase.from('gift_requests').insert([{
      story_text: story,
      emotions_detected: aiResult.emotions,
      occasion: aiResult.occasion,
      recipient: aiResult.recipient,
    }])

    return Response.json({
      emotions: aiResult.emotions,
      occasion: aiResult.occasion,
      recipient: aiResult.recipient,
      tone: aiResult.tone,
      message: aiResult.message,
      gift_note: aiResult.gift_note,
      suggestions,
    })

  } catch (error) {
    console.error('Error:', error)
    return Response.json({
      error: 'Something went wrong. Please try again.'
    }, { status: 500 })
  }
}

function getCategoryIcon(category) {
  const icons = {
    'Candles': '🕯️',
    'Macramé': '🌿',
    'Resin art': '💌',
    'Pottery': '🏺',
    'Jewellery': '💍',
    'Skincare': '🧴',
    'Cards': '✉️',
    'Crochet': '🧶',
    'Gift hampers': '🎁',
    'Plants': '🪴',
    'Paintings': '🎨',
    'Embroidery': '🌸',
  }
  return icons[category] || '🎁'
}