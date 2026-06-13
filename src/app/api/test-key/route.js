export async function GET() {
  try {
    const key = process.env.GROQ_API_KEY
    
    if (!key) {
      return Response.json({ 
        status: '❌ FAILED', 
        reason: 'GROQ_API_KEY missing from .env.local' 
      })
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ 
          role: 'user', 
          content: 'Say exactly this: GiftSoul AI is ready!' 
        }],
        max_tokens: 30
      })
    })

    const data = await res.json()

    if (data.error) {
      return Response.json({ 
        status: '❌ FAILED', 
        reason: data.error.message 
      })
    }

    const reply = data.choices?.[0]?.message?.content

    return Response.json({ 
      status: '✅ KEY WORKS!',
      ai_said: reply,
      model: 'LLaMA 3 via Groq',
      cost: '100% FREE'
    })

  } catch(e) {
    return Response.json({ 
      status: '❌ FAILED', 
      reason: e.message 
    })
  }
}