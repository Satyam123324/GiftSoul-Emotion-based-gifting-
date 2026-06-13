'use client'
import Link from 'next/link'
import { useState } from 'react'

const EXAMPLE_STORIES = [
  "My best friend just got her dream job after years of trying. She loves plants and always lights a candle while she works. I want something that feels like a warm hug and says I always believed in you.",
  "My grandmother passed away last month and my mother is devastated. She used to cook with her every Sunday. I want to give her something that honours that memory and brings her comfort.",
  "My little brother is graduating from college next week. He's moving to a new city alone for the first time. I want something meaningful that reminds him home is always with him.",
  "I said something hurtful to my best friend and I want to apologise properly. Words don't feel enough. She loves handmade things and meaningful gestures over grand ones.",
]

export default function FindGift() {
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')

  const LOADING_MESSAGES = [
    'Reading your story...',
    'Detecting the emotion...',
    'Searching through 200+ handmade gifts...',
    'Matching to the perfect makers...',
    'Almost ready...',
  ]

  async function findGifts() {
    if (story.trim().length < 20) {
      setError('Please share a bit more about the person or situation — the more you tell us, the better we can match.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)

    let msgIdx = 0
    setLoadingMsg(LOADING_MESSAGES[0])
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIdx])
    }, 1200)

    try {
      const res = await fetch('/api/suggest-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const toneColors = {
    warm: '#B5622A', celebratory: '#4A6741',
    comforting: '#5B7FA6', solemn: '#6B5B7B', playful: '#C4622A'
  }

  return (
    <div style={{minHeight:'100vh',background:'#F7F3EE'}}>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'70px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 4rem',zIndex:500,background:'rgba(247,243,238,.97)',backdropFilter:'blur(16px)',boxShadow:'0 1px 0 #D9CDB8'}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.65rem',fontWeight:400,color:'#3D2B1F',textDecoration:'none'}}>
          Gift<em style={{fontStyle:'italic',color:'#B5622A'}}>Soul</em>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
          <Link href="/marketplace" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Browse gifts</Link>
          <Link href="/creators" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Creators</Link>
          <Link href="/creator-register" style={{padding:'.5rem 1.4rem',background:'#3D2B1F',color:'#F7F3EE',borderRadius:'2rem',fontSize:'.78rem',textDecoration:'none'}}>Join as creator</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:'#3D2B1F',padding:'calc(70px + 3rem) 5rem 3rem'}}>
        <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1rem'}}>AI-powered gift matching</p>
        <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:300,color:'#F7F3EE',lineHeight:1.1,marginBottom:'1rem'}}>
          Tell us the story.<br/>
          <em style={{fontStyle:'italic',color:'#D4856A'}}>We&apos;ll find the gift.</em>
        </h1>
        <p style={{fontSize:'1rem',color:'rgba(247,243,238,.5)',maxWidth:'520px',lineHeight:1.8}}>
          Our AI reads emotion, not just keywords. Describe the person, the moment, the feeling — and we&apos;ll match handcrafted gifts from real Indian makers that truly fit.
        </p>
      </div>

      <div style={{maxWidth:'860px',margin:'0 auto',padding:'3rem 2rem 5rem'}}>

        {/* STORY INPUT BOX */}
        <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'24px',padding:'2rem',boxShadow:'0 4px 24px rgba(61,43,31,.07)',marginBottom:'1.5rem',position:'relative'}}>
          <div style={{position:'absolute',top:'-1rem',left:'1.5rem',fontFamily:'Cormorant Garamond, serif',fontSize:'4rem',color:'#EDE6DA',lineHeight:1,pointerEvents:'none'}}>&ldquo;</div>
          <div style={{fontSize:'.7rem',letterSpacing:'.16em',textTransform:'uppercase',color:'#C4A882',marginBottom:'.8rem'}}>Share your story</div>
          <textarea
            value={story}
            onChange={e => { setStory(e.target.value); setError('') }}
            placeholder="Write freely — the more honest, the better. Tell us about the person you're gifting, what they're going through, what they love, and what you want them to feel when they receive it..."
            rows={7}
            style={{width:'100%',border:'none',outline:'none',fontFamily:'Cormorant Garamond, serif',fontSize:'1.15rem',lineHeight:1.75,color:'#3D2B1F',background:'transparent',resize:'none'}}
          />
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid #EDE6DA',flexWrap:'wrap',gap:'1rem'}}>
            <div style={{fontSize:'.78rem',color:'#C4A882'}}>{story.length} characters {story.length < 50 ? '— keep going...' : story.length < 100 ? '— good, a bit more...' : '— great!'}</div>
            <button
              onClick={findGifts}
              disabled={loading}
              style={{padding:'.75rem 2rem',background: loading ? '#C4A882' : '#B5622A',color:'white',border:'none',borderRadius:'2rem',fontSize:'.9rem',cursor: loading ? 'not-allowed' : 'pointer',fontFamily:'DM Sans, sans-serif',fontWeight:500,transition:'all .2s',display:'flex',alignItems:'center',gap:'.6rem',minWidth:'180px',justifyContent:'center'}}>
              {loading ? (
                <>
                  <span style={{display:'inline-block',width:'14px',height:'14px',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}></span>
                  Finding gifts...
                </>
              ) : 'Find the perfect gift →'}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{background:'#FEF3EE',border:'1px solid rgba(181,98,42,.3)',borderRadius:'12px',padding:'1rem 1.2rem',marginBottom:'1.5rem',fontSize:'.88rem',color:'#B5622A'}}>
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'3rem',textAlign:'center',marginBottom:'1.5rem'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'1.5rem'}}>
              <div style={{width:'56px',height:'56px',border:'3px solid #EDE6DA',borderTopColor:'#B5622A',borderRadius:'50%',animation:'spin .8s linear infinite'}}></div>
            </div>
            <p style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',color:'#3D2B1F',marginBottom:'.4rem'}}>{loadingMsg}</p>
            <p style={{fontSize:'.82rem',color:'#7A6A5A'}}>Our AI is reading the emotion in your story</p>
          </div>
        )}

        {/* RESULTS */}
        {result && !loading && (
          <div>
            {/* Emotion analysis card */}
            <div style={{background:'#3D2B1F',borderRadius:'20px',padding:'2rem',marginBottom:'1.5rem',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 80% 20%, rgba(181,98,42,.15) 0%, transparent 60%)',pointerEvents:'none'}}></div>
              <div style={{position:'relative'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.2rem',flexWrap:'wrap'}}>
                  <div style={{fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#C4A882'}}>Emotion detected</div>
                  {result.emotions.map(em => (
                    <span key={em} style={{padding:'.3rem 1rem',borderRadius:'2rem',background:'rgba(181,98,42,.2)',border:'1px solid rgba(181,98,42,.4)',color:'#D4856A',fontSize:'.8rem',fontFamily:'Cormorant Garamond, serif',fontStyle:'italic'}}>{em}</span>
                  ))}
                  {result.tone && (
                    <span style={{padding:'.3rem 1rem',borderRadius:'2rem',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',color:'rgba(247,243,238,.6)',fontSize:'.75rem'}}>tone: {result.tone}</span>
                  )}
                </div>
                <p style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.15rem',lineHeight:1.75,color:'#F7F3EE',marginBottom:'1rem',fontStyle:'italic'}}>&ldquo;{result.message}&rdquo;</p>
                {result.gift_note && (
                  <div style={{background:'rgba(255,255,255,.06)',borderRadius:'12px',padding:'.8rem 1rem',fontSize:'.82rem',color:'rgba(247,243,238,.6)',borderLeft:'2px solid #B5622A'}}>
                    💌 <strong style={{color:'rgba(247,243,238,.8)'}}>Personalisation tip:</strong> {result.gift_note}
                  </div>
                )}
              </div>
            </div>

            {/* Gift suggestions */}
            <div style={{marginBottom:'1rem'}}>
              <h2 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.8rem',fontWeight:300,color:'#3D2B1F',marginBottom:'.4rem'}}>
                Handpicked gifts for <em style={{fontStyle:'italic',color:'#B5622A'}}>{result.recipient || 'this moment'}</em>
              </h2>
              <p style={{fontSize:'.85rem',color:'#7A6A5A',marginBottom:'1.5rem'}}>Matched by emotion · Made by hand in India</p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
              {result.suggestions.map((g,i) => (
                <div key={g.id} style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',overflow:'hidden',transition:'all .25s',position:'relative'}}
                  onMouseEnter={e => {e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(61,43,31,.12)'}}
                  onMouseLeave={e => {e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                  {i === 0 && (
                    <div style={{position:'absolute',top:'.75rem',left:'.75rem',zIndex:2,fontSize:'.62rem',letterSpacing:'.1em',textTransform:'uppercase',padding:'.25rem .7rem',borderRadius:'2rem',background:'#B5622A',color:'white'}}>Best match</div>
                  )}
                  <div style={{height:'200px',background: i===0?'#FFF3E0':i===1?'#E8F5E9':i===2?'#FCE4EC':'#E3F2FD',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'64px'}}>
                    {g.icon}
                  </div>
                  <div style={{padding:'1.25rem'}}>
                    <div style={{fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.5rem'}}>
                      {g.emotions.slice(0,2).join(' · ')}
                    </div>
                    <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.2rem',color:'#3D2B1F',marginBottom:'.3rem',lineHeight:1.3}}>{g.name}</div>
                    <div style={{fontSize:'.75rem',color:'#7A6A5A',marginBottom:'1rem'}}>by {g.by} · {g.city}</div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontSize:'1.1rem',fontWeight:500,color:'#3D2B1F'}}>{g.price}</span>
                      <Link href="/product" style={{padding:'.45rem 1.1rem',background:'#B5622A',color:'white',borderRadius:'2rem',textDecoration:'none',fontSize:'.75rem',fontFamily:'DM Sans, sans-serif',fontWeight:500}}>
                        View gift →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Try again */}
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',padding:'1rem 0',borderTop:'1px solid #D9CDB8'}}>
              <button onClick={() => {setResult(null);setStory('');window.scrollTo({top:0,behavior:'smooth'})}}
                style={{padding:'.7rem 1.6rem',border:'1px solid #D9CDB8',borderRadius:'2rem',background:'white',color:'#3D2B1F',cursor:'pointer',fontFamily:'DM Sans, sans-serif',fontSize:'.85rem'}}>
                Try a different story
              </button>
              <Link href="/marketplace" style={{padding:'.7rem 1.6rem',background:'#3D2B1F',color:'#F7F3EE',borderRadius:'2rem',textDecoration:'none',fontSize:'.85rem'}}>
                Browse all gifts →
              </Link>
            </div>
          </div>
        )}

        {/* EXAMPLE STORIES — shown only when no result */}
        {!result && !loading && (
          <div style={{marginTop:'2rem'}}>
            <p style={{fontSize:'.72rem',letterSpacing:'.16em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1rem'}}>Need inspiration? Try one of these</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'1rem'}}>
              {EXAMPLE_STORIES.map((s,i) => (
                <button key={i} onClick={() => setStory(s)}
                  style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'16px',padding:'1.2rem 1.4rem',textAlign:'left',cursor:'pointer',transition:'all .2s',fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#7A6A5A',lineHeight:1.6}}
                  onMouseEnter={e => {e.currentTarget.style.borderColor='#B5622A';e.currentTarget.style.color='#3D2B1F'}}
                  onMouseLeave={e => {e.currentTarget.style.borderColor='#D9CDB8';e.currentTarget.style.color='#7A6A5A'}}>
                  <span style={{fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#C4A882',display:'block',marginBottom:'.5rem'}}>Example {i+1}</span>
                  &ldquo;{s.slice(0,120)}...&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HOW IT WORKS */}
      <div style={{background:'#EDE6DA',borderTop:'1px solid #D9CDB8',padding:'5rem'}}>
        <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'1rem',textAlign:'center'}}>How the AI works</p>
        <h2 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,3.5vw,3rem)',fontWeight:300,color:'#3D2B1F',textAlign:'center',marginBottom:'3rem'}}>
          More than keywords — it reads <em style={{fontStyle:'italic',color:'#B5622A'}}>meaning</em>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'2rem',maxWidth:'900px',margin:'0 auto'}}>
          {[{n:'01',title:'You share a story',desc:'Write naturally — describe the person, the moment, the relationship. No need to mention gift ideas.'},
            {n:'02',title:'Gemini reads emotion',desc:'Our AI powered by Gemini detects the underlying emotion — grief, pride, nostalgia, joy — not just surface words.'},
            {n:'03',title:'Gifts are matched',desc:'Products in our database are tagged by emotion. The best emotional matches are surfaced for you.'},
            {n:'04',title:'Makers are real',desc:'Every suggestion comes from a verified Indian artisan who made it by hand. You can message them directly.'},
          ].map(s => (
            <div key={s.n} style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'16px',padding:'1.5rem'}}>
              <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'3rem',fontWeight:300,color:'#D9CDB8',lineHeight:1,marginBottom:'.8rem'}}>{s.n}</div>
              <h3 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.2rem',color:'#3D2B1F',marginBottom:'.6rem'}}>{s.title}</h3>
              <p style={{fontSize:'.85rem',color:'#7A6A5A',lineHeight:1.7}}>{s.desc}</p>
            </div>
          ))}
        </div>
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
        <div style={{fontSize:'.75rem',color:'rgba(247,243,238,.28)'}}>© 2026 GiftSoul · Powered by Gemini AI · Made with love in India.</div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}