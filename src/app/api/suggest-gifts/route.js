const PRODUCTS = [
  {id:1,icon:'🕯️',name:'Hand-poured lavender soy candle',by:"Sneha's Nook",city:'Jaipur',price:'₹480',emotions:['celebration','self-care','love','comfort','grief'],category:'Candles'},
  {id:2,icon:'🌿',name:'Handwoven macramé wall hanging',by:'Thread & Knot',city:'Kochi',price:'₹1,200',emotions:['gratitude','new beginnings','friendship','achievement'],category:'Macramé'},
  {id:3,icon:'💌',name:'Resin keepsake memory box',by:'Crystal Craft',city:'Pune',price:'₹890',emotions:['love','nostalgia','grief','apology'],category:'Resin art'},
  {id:4,icon:'🏺',name:'Hand-thrown ceramic mug',by:'Clay & Fire Studio',city:'Bengaluru',price:'₹650',emotions:['achievement','gratitude','self-care','friendship'],category:'Pottery'},
  {id:5,icon:'💍',name:'Handcrafted silver ring',by:'Silver Thread Co',city:'Jaipur',price:'₹2,200',emotions:['love','celebration','romance','apology'],category:'Jewellery'},
  {id:6,icon:'🧴',name:'Ayurvedic skincare gift set',by:'Roots & Rituals',city:'Mumbai',price:'₹1,400',emotions:['self-care','grief','comfort','new beginnings'],category:'Skincare'},
  {id:7,icon:'✉️',name:'Hand-lettered greeting card set',by:'Paper & Pen',city:'Chennai',price:'₹320',emotions:['friendship','gratitude','apology','love','comfort'],category:'Cards'},
  {id:8,icon:'🧶',name:'Chunky crochet throw blanket',by:'Yarn & Soul',city:'Ahmedabad',price:'₹3,200',emotions:['grief','nostalgia','comfort','self-care'],category:'Crochet'},
  {id:9,icon:'🎁',name:'Personalised gift hamper',by:'The Curated Basket',city:'Delhi',price:'₹1,800',emotions:['celebration','achievement','gratitude','friendship'],category:'Hampers'},
  {id:10,icon:'🪴',name:'Succulent terrarium kit',by:'Green Things Studio',city:'Hyderabad',price:'₹750',emotions:['new beginnings','self-care','friendship','hope'],category:'Plants'},
  {id:11,icon:'🎨',name:'Custom watercolour portrait',by:'Brushwork',city:'Kolkata',price:'₹4,500',emotions:['love','nostalgia','achievement','grief'],category:'Art'},
  {id:12,icon:'🌸',name:'Pressed flower resin bookmark',by:'Petal & Glass',city:'Pune',price:'₹380',emotions:['apology','friendship','love','nostalgia'],category:'Resin art'},
]

export async function POST(request) {
  try {
    const { story } = await request.json()

    if (!story || story.trim().length < 10) {
      return Response.json({ error: 'Please share a longer story' }, { status: 400 })
    }

    const key = process.env.GROQ_API_KEY
    if (!key) {
      return Response.json({ error: 'GROQ_API_KEY not found in .env.local' }, { status: 500 })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are GiftSoul's emotion detection AI for an Indian handmade gifting platform.
Your job is to read a gifting story and detect the human emotion behind it.
You understand Indian relationships deeply — between mothers and daughters, siblings, friends, colleagues.
IMPORTANT: Return ONLY valid JSON — no extra text, no markdown, no backticks whatsoever.`
          },
          {
            role: 'user',
            content: `Analyze this gifting story and return ONLY a JSON object:

"${story}"

Return exactly this structure:
{
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "occasion": "brief occasion description",
  "recipient": "who the gift is for",
  "tone": "warm",
  "message": "A warm 2-sentence message explaining what emotions you detected. Speak directly to the gift-giver with empathy.",
  "gift_note": "A specific suggestion for what to write on the card or how to personalise the gift"
}

Choose emotions only from this list: love, grief, celebration, gratitude, nostalgia, friendship, apology, new beginnings, self-care, achievement, comfort, romance, hope, pride`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const data = await response.json()

    if (data.error) {
      return Response.json({ error: `AI error: ${data.error.message}` }, { status: 500 })
    }

    const rawText = data.choices?.[0]?.message?.content
    if (!rawText) {
      return Response.json({ error: 'No response from AI' }, { status: 500 })
    }

    const cleaned = rawText.replace(/```json|```/g, '').trim()
    const aiResult = JSON.parse(cleaned)

    const matched = PRODUCTS
      .map(p => ({
        ...p,
        score: p.emotions.filter(e =>
          aiResult.emotions.some(ae =>
            ae.toLowerCase().includes(e) || e.includes(ae.toLowerCase())
          )
        ).length
      }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)

    const suggestions = matched.length > 0 ? matched : PRODUCTS.slice(0, 4)

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