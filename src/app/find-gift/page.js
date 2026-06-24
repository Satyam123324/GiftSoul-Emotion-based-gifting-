'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function FindGift() {
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function findGifts() {
    if (story.trim().length < 20) {
      setError('Please share a bit more about the person or situation.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch('/api/suggest-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story })
      })
      const data = await res.json()
      console.log('Response:', JSON.stringify(data))
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (e) {
      setError('Network error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#F7F3EE'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'70px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 4rem',zIndex:500,background:'rgba(247,243,238,.95)',backdropFilter:'blur(16px)',boxShadow:'0 1px 0 #D9CDB8'}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.65rem',fontWeight:400,color:'#3D2B1F',textDecoration:'none'}}>
          Gift<em style={{fontStyle:'italic',color:'#B5622A'}}>Soul</em>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
          <Link href="/marketplace" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Browse gifts</Link>
          <Link href="/creators" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Creators</Link>
        </div>
      </nav>

      <div style={{background:'#3D2B1F',padding:'calc(70px + 3rem) 5rem 3rem'}}>
        <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1rem'}}>AI-powered gift matching</p>
        <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:300,color:'#F7F3EE',lineHeight:1.1,marginBottom:'1rem'}}>
          Tell us the story.<br/>
          <em style={{fontStyle:'italic',color:'#D4856A'}}>We&apos;ll find the gift.</em>
        </h1>
        <p style={{fontSize:'1rem',color:'rgba(247,243,238,.5)',maxWidth:'520px',lineHeight:1.8}}>
          Our AI reads emotion, not just keywords. Describe the person, the moment, the feeling.
        </p>
      </div>

      <div style={{maxWidth:'860px',margin:'0 auto',padding:'3rem 2rem 5rem'}}>

        <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'24px',padding:'2rem',boxShadow:'0 4px 24px rgba(61,43,31,.07)',marginBottom:'1.5rem'}}>
          <div style={{fontSize:'.7rem',letterSpacing:'.16em',textTransform:'uppercase',color:'#C4A882',marginBottom:'.8rem'}}>Share your story</div>
          <textarea
            value={story}
            onChange={e => { setStory(e.target.value); setError('') }}
            placeholder="Write freely — describe the person, what they mean to you, what you want them to feel..."
            rows={6}
            style={{width:'100%',border:'none',outline:'none',fontFamily:'Cormorant Garamond, serif',fontSize:'1.15rem',lineHeight:1.75,color:'#3D2B1F',background:'transparent',resize:'none'}}
          />
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid #EDE6DA',flexWrap:'wrap',gap:'1rem'}}>
            <div style={{fontSize:'.78rem',color:'#C4A882'}}>{story.length} characters {story.length < 50 ? '— keep going...' : story.length < 100 ? '— a bit more...' : '— great!'}</div>
            <button
              onClick={findGifts}
              disabled={loading}
              style={{padding:'.75rem 2rem',background:loading?'#C4A882':'#B5622A',color:'white',border:'none',borderRadius:'2rem',fontSize:'.9rem',cursor:loading?'not-allowed':'pointer',fontFamily:'DM Sans, sans-serif',fontWeight:500,minWidth:'180px'}}>
              {loading ? 'Finding gifts...' : 'Find the perfect gift →'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{background:'#FEF3EE',border:'1px solid rgba(181,98,42,.3)',borderRadius:'12px',padding:'1rem 1.2rem',marginBottom:'1.5rem',fontSize:'.88rem',color:'#B5622A'}}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'3rem',textAlign:'center',marginBottom:'1.5rem'}}>
            <p style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',color:'#3D2B1F',marginBottom:'.4rem'}}>Reading your story...</p>
            <p style={{fontSize:'.82rem',color:'#7A6A5A'}}>Our AI is detecting the emotion</p>
          </div>
        )}

        {result && !loading && (
          <div>
            <div style={{background:'#3D2B1F',borderRadius:'20px',padding:'2rem',marginBottom:'1.5rem'}}>
              <div style={{display:'flex',gap:'.8rem',marginBottom:'1rem',flexWrap:'wrap'}}>
                <div style={{fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#C4A882'}}>Emotions detected:</div>
                {Array.isArray(result.emotions) && result.emotions.map(em => (
                  <span key={em} style={{padding:'.3rem 1rem',borderRadius:'2rem',background:'rgba(181,98,42,.2)',border:'1px solid rgba(181,98,42,.4)',color:'#D4856A',fontSize:'.8rem',fontFamily:'Cormorant Garamond, serif',fontStyle:'italic'}}>{em}</span>
                ))}
              </div>
              {result.message && (
                <p style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.15rem',lineHeight:1.75,color:'#F7F3EE',marginBottom:'1rem',fontStyle:'italic'}}>&ldquo;{result.message}&rdquo;</p>
              )}
              {result.gift_note && (
                <div style={{background:'rgba(255,255,255,.06)',borderRadius:'12px',padding:'.8rem 1rem',fontSize:'.82rem',color:'rgba(247,243,238,.6)',borderLeft:'2px solid #B5622A'}}>
                  💌 <strong style={{color:'rgba(247,243,238,.8)'}}>Card tip:</strong> {result.gift_note}
                </div>
              )}
            </div>

            <h2 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.8rem',fontWeight:300,color:'#3D2B1F',marginBottom:'.4rem'}}>
              Handpicked gifts for <em style={{fontStyle:'italic',color:'#B5622A'}}>{result.recipient || 'this moment'}</em>
            </h2>
            <p style={{fontSize:'.85rem',color:'#7A6A5A',marginBottom:'1.5rem'}}>Matched by emotion · Made by hand in India</p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
              {Array.isArray(result.suggestions) && result.suggestions.map((g, i) => (
                <div key={i} style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',overflow:'hidden',position:'relative'}}>
                  {i === 0 && (
                    <div style={{position:'absolute',top:'.75rem',left:'.75rem',zIndex:2,fontSize:'.62rem',letterSpacing:'.1em',textTransform:'uppercase',padding:'.25rem .7rem',borderRadius:'2rem',background:'#B5622A',color:'white'}}>Best match</div>
                  )}
                  <div style={{height:'180px',background:i===0?'#FFF3E0':i===1?'#E8F5E9':i===2?'#FCE4EC':'#E3F2FD',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'56px'}}>
                    {g.icon || '🎁'}
                  </div>
                  <div style={{padding:'1.25rem'}}>
                    <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.2rem',color:'#3D2B1F',marginBottom:'.3rem',lineHeight:1.3}}>
                      {g.name || 'Handmade gift'}
                    </div>
                    <div style={{fontSize:'.75rem',color:'#7A6A5A',marginBottom:'1rem'}}>
                      by {g.by || (g.creators && g.creators.shop_name) || 'Artisan'} · {g.city || (g.creators && g.creators.city) || 'India'}
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontSize:'1.1rem',fontWeight:500,color:'#3D2B1F'}}>
                        {g.price || (g.base_price ? `₹${g.base_price}` : '₹500')}
                      </span>
                      <Link href="/product" style={{padding:'.45rem 1.1rem',background:'#B5622A',color:'white',borderRadius:'2rem',textDecoration:'none',fontSize:'.75rem',fontFamily:'DM Sans, sans-serif',fontWeight:500}}>
                        View gift →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',padding:'1rem 0',borderTop:'1px solid #D9CDB8'}}>
              <button onClick={() => {setResult(null);setStory('')}}
                style={{padding:'.7rem 1.6rem',border:'1px solid #D9CDB8',borderRadius:'2rem',background:'white',color:'#3D2B1F',cursor:'pointer',fontFamily:'DM Sans, sans-serif',fontSize:'.85rem'}}>
                Try a different story
              </button>
              <Link href="/marketplace" style={{padding:'.7rem 1.6rem',background:'#3D2B1F',color:'#F7F3EE',borderRadius:'2rem',textDecoration:'none',fontSize:'.85rem'}}>
                Browse all gifts →
              </Link>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div style={{marginTop:'2rem'}}>
            <p style={{fontSize:'.72rem',letterSpacing:'.16em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1rem'}}>Need inspiration? Try one of these</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'1rem'}}>
              {[
                'My best friend just got her dream job after years of trying. She loves plants and always lights a candle while she works. I want something warm and meaningful.',
                'My grandmother passed away last month and my mother is devastated. She used to cook with her every Sunday. I want to give her something that honours that memory.',
                'My little brother is graduating from college and moving to a new city alone. I want something that reminds him home is always with him.',
                'I said something hurtful to my best friend and want to apologise properly. She loves handmade things and meaningful gestures over grand ones.'
              ].map((s, i) => (
                <button key={i} onClick={() => setStory(s)}
                  style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'16px',padding:'1.2rem 1.4rem',textAlign:'left',cursor:'pointer',fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#7A6A5A',lineHeight:1.6}}>
                  <span style={{fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#C4A882',display:'block',marginBottom:'.5rem'}}>Example {i+1}</span>
                  &ldquo;{s.slice(0,120)}...&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{background:'#3D2B1F',padding:'3rem 4rem 2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem',paddingBottom:'2rem',marginBottom:'2rem',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
          <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.8rem',fontWeight:300,color:'#F7F3EE'}}>Gift<em style={{fontStyle:'italic',color:'#D4856A'}}>Soul</em></div>
          <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
            {[['Home','/'],['Find a gift','/find-gift'],['Marketplace','/marketplace'],['Creators','/creators']].map(([l,h]) => (
              <Link key={l} href={h} style={{fontSize:'.82rem',color:'rgba(247,243,238,.45)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{fontSize:'.75rem',color:'rgba(247,243,238,.28)'}}>© 2026 GiftSoul · Powered by AI · Made with love in India.</div>
      </footer>
    </div>
  )
}