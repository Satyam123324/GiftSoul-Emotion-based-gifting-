'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [story, setStory] = useState('')
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }), { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div>
      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'70px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 4rem',zIndex:500,background:'rgba(247,243,238,.95)',backdropFilter:'blur(16px)',boxShadow:'0 1px 0 #D9CDB8'}}>
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
      <section style={{minHeight:'100vh',background:'#F7F3EE',display:'flex',alignItems:'center',padding:'calc(70px + 4rem) 5rem 5rem'}}>
        <div style={{maxWidth:'600px'}}>
          <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'1.6rem'}}>Emotion-based gifting · Made in India</p>
          <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(3rem,5vw,5.5rem)',fontWeight:300,lineHeight:1.06,color:'#3D2B1F',marginBottom:'1.6rem'}}>
            Every gift tells<br/>
            <em style={{fontStyle:'italic',color:'#B5622A'}}>someone&apos;s story</em>
          </h1>
          <p style={{fontSize:'1rem',color:'#7A6A5A',lineHeight:1.8,maxWidth:'440px',fontWeight:300,marginBottom:'2.8rem'}}>
            Share a moment, a memory, a feeling. Our AI finds handcrafted gifts made by real artisans — chosen for the emotion, not the occasion.
          </p>

          <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem',maxWidth:'520px',boxShadow:'0 2px 12px rgba(61,43,31,.07)'}}>
            <div style={{fontSize:'.7rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#C4A882',marginBottom:'.5rem'}}>Tell us your story</div>
            <textarea
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="My best friend just got her dream job after years of trying..."
              rows={4}
              style={{width:'100%',border:'none',outline:'none',fontFamily:'Cormorant Garamond, serif',fontSize:'1.1rem',lineHeight:1.65,color:'#3D2B1F',background:'transparent',resize:'none'}}
            />
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid #EDE6DA',flexWrap:'wrap',gap:'.8rem'}}>
              <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
                {['celebration','gratitude','love','comfort'].map(tag => (
                  <span key={tag}
                    style={{padding:'.3rem .9rem',borderRadius:'2rem',fontSize:'.72rem',border:'1px solid #D9CDB8',color:'#7A6A5A',cursor:'pointer'}}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => window.location.href = '/find-gift'}
                style={{padding:'.65rem 1.4rem',background:'#B5622A',color:'white',border:'none',borderRadius:'2rem',fontSize:'.82rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>
                Find gifts →
              </button>
            </div>
          </div>

          {showResult && (
            <div style={{marginTop:'1rem',background:'#EDE6DA',border:'1px solid #D9CDB8',borderRadius:'12px',padding:'1.2rem'}}>
              <div style={{fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#C4A882',marginBottom:'.8rem'}}>Suggested — celebration + warmth</div>
              <div style={{display:'flex',gap:'.8rem',flexWrap:'wrap'}}>
                {[{icon:'🕯️',name:'Soy candle',by:"Sneha's Nook",price:'₹480'},
                  {icon:'🌿',name:'Terrarium kit',by:'Green Things',price:'₹750'},
                  {icon:'✉️',name:'Card set',by:'Paper & Pen',price:'₹320'}
                ].map(g => (
                  <div key={g.name} style={{flex:1,minWidth:'120px',background:'white',borderRadius:'8px',padding:'.8rem',border:'1px solid #D9CDB8'}}>
                    <div style={{fontSize:'1.4rem',marginBottom:'.3rem'}}>{g.icon}</div>
                    <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#3D2B1F'}}>{g.name}</div>
                    <div style={{fontSize:'.7rem',color:'#7A6A5A'}}>{g.by}</div>
                    <div style={{fontSize:'.78rem',color:'#B5622A',fontWeight:500,marginTop:'.2rem'}}>{g.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'7rem 5rem',background:'white'}}>
        <p className="reveal" style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'1rem'}}>How it works</p>
        <h2 className="reveal" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,3.5vw,3.2rem)',fontWeight:300,color:'#3D2B1F',marginBottom:'4rem',maxWidth:'520px'}}>
          Gifting that actually <em style={{color:'#B5622A'}}>means something</em>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'3rem'}}>
          {[{n:'01',title:'Share your story',desc:'Write a few lines about the person, the moment, or the feeling. There are no wrong answers.'},
            {n:'02',title:'AI reads the emotion',desc:'Our AI detects the underlying emotion — grief, pride, nostalgia — and finds what truly fits.'},
            {n:'03',title:'Get matched to makers',desc:'Real artisans matched to your emotion. Every gift comes with their story and their care.'}
          ].map((s,i) => (
            <div key={s.n} className="reveal" style={{transitionDelay:`${i*.1}s`}}>
              <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'4.5rem',fontWeight:300,color:'#D9CDB8',lineHeight:1,marginBottom:'.8rem'}}>{s.n}</div>
              <h3 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.5rem',color:'#3D2B1F',marginBottom:'.7rem'}}>{s.title}</h3>
              <p style={{fontSize:'.88rem',color:'#7A6A5A',lineHeight:1.75,fontWeight:300}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED GIFTS */}
      <section style={{padding:'5rem',background:'#F7F3EE'}}>
        <p className="reveal" style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'1rem'}}>Featured gifts</p>
        <h2 className="reveal" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,3.5vw,3.2rem)',fontWeight:300,color:'#3D2B1F',marginBottom:'3rem'}}>
          Gifts chosen by <em style={{color:'#B5622A'}}>emotion</em>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'2rem'}}>
          {[{icon:'🕯️',bg:'#FFF3E0',emotion:'Celebration · Self-care',name:'Hand-poured lavender soy candle',by:"Sneha's Nook · Jaipur",price:'₹480'},
            {icon:'🌿',bg:'#E8F5E9',emotion:'Gratitude · New beginnings',name:'Handwoven macramé wall hanging',by:'Thread & Knot · Kochi',price:'₹1,200'},
            {icon:'💌',bg:'#FCE4EC',emotion:'Love · Nostalgia',name:'Resin keepsake memory box',by:'Crystal Craft · Pune',price:'₹890'}
          ].map((g,i) => (
            <Link key={g.name} href="/product" className="reveal" style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',overflow:'hidden',textDecoration:'none',display:'block',transition:'transform .25s',transitionDelay:`${i*.1}s`}}>
              <div style={{height:'200px',background:g.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'52px'}}>{g.icon}</div>
              <div style={{padding:'1.25rem'}}>
                <div style={{fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.5rem'}}>{g.emotion}</div>
                <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.2rem',color:'#3D2B1F',marginBottom:'.3rem'}}>{g.name}</div>
                <div style={{fontSize:'.72rem',color:'#7A6A5A',marginBottom:'.6rem'}}>by {g.by}</div>
                <div style={{fontSize:'1rem',fontWeight:500,color:'#3D2B1F'}}>{g.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CREATORS */}
      <section style={{background:'#3D2B1F',padding:'6rem 5rem'}}>
        <p className="reveal" style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1rem'}}>Meet the makers</p>
        <h2 className="reveal" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,3.5vw,3.2rem)',fontWeight:300,color:'#F7F3EE',marginBottom:'3rem'}}>
          Gifts made by <em style={{fontStyle:'italic',color:'#D4856A'}}>real hands</em>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem',marginBottom:'3rem'}}>
          {[{init:'S',name:'Sneha Patel',city:'Jaipur',craft:'Soy candles',bg:'#FFF3E0'},
            {init:'M',name:'Meera Krishnan',city:'Kochi',craft:'Macramé',bg:'#E8F5E9'},
            {init:'P',name:'Priya Sharma',city:'Pune',craft:'Resin art',bg:'#FCE4EC'},
            {init:'A',name:'Arjun Nair',city:'Bengaluru',craft:'Pottery',bg:'#E3F2FD'}
          ].map((c,i) => (
            <Link key={c.name} href="/creator-profile" className="reveal" style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'20px',padding:'1.4rem',textDecoration:'none',display:'block',transitionDelay:`${i*.08}s`}}>
              <div style={{width:'48px',height:'48px',borderRadius:'50%',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond, serif',fontSize:'1.2rem',color:'#3D2B1F',marginBottom:'.9rem'}}>{c.init}</div>
              <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.1rem',color:'#F7F3EE',marginBottom:'.15rem'}}>{c.name}</div>
              <div style={{fontSize:'.7rem',color:'rgba(247,243,238,.4)',marginBottom:'.7rem'}}>{c.city}</div>
              <span style={{fontSize:'.7rem',padding:'.25rem .7rem',background:'rgba(196,168,130,.15)',border:'1px solid rgba(196,168,130,.25)',borderRadius:'2rem',color:'#C4A882'}}>{c.craft}</span>
            </Link>
          ))}
        </div>
        <div style={{textAlign:'center'}}>
          <Link href="/creators" style={{display:'inline-block',padding:'.85rem 2.2rem',border:'1px solid rgba(247,243,238,.3)',borderRadius:'2rem',color:'#F7F3EE',textDecoration:'none',fontSize:'.82rem'}}>
            Browse all 200+ creators →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'7rem 5rem',textAlign:'center',background:'#B5622A'}}>
        <h2 className="reveal" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:300,color:'white',marginBottom:'1.5rem'}}>
          Start with a story.<br/>
          We&apos;ll find the <em style={{color:'rgba(255,255,255,.65)'}}>perfect gift</em>
        </h2>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/marketplace" style={{padding:'.85rem 2rem',border:'1px solid rgba(255,255,255,.4)',borderRadius:'2rem',color:'white',textDecoration:'none',fontSize:'.82rem'}}>
            Browse marketplace →
          </Link>
          <Link href="/creator-register" style={{padding:'.85rem 2rem',background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.3)',borderRadius:'2rem',color:'white',textDecoration:'none',fontSize:'.82rem'}}>
            Join as a creator
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#3D2B1F',padding:'5rem 4rem 2.5rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'3rem',paddingBottom:'3rem',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
          <div>
            <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem',fontWeight:300,color:'#F7F3EE'}}>
              Gift<em style={{fontStyle:'italic',color:'#D4856A'}}>Soul</em>
            </div>
            <div style={{fontSize:'.82rem',color:'rgba(247,243,238,.38)',marginTop:'.5rem',lineHeight:1.6}}>
              Gifts that carry emotion, made by hand across India.
            </div>
          </div>
          {[{title:'Platform',links:[['Browse gifts','/marketplace'],['Creators','/creators']]},
            {title:'Creators',links:[['Join as creator','/creator-register'],['Dashboard','/dashboard']]},
            {title:'Company',links:[['About','#'],['Contact','#']]}
          ].map(col => (
            <div key={col.title}>
              <h4 style={{fontSize:'.68rem',letterSpacing:'.16em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1.1rem'}}>{col.title}</h4>
              {col.links.map(([label,href]) => (
                <Link key={label} href={href} style={{display:'block',fontSize:'.85rem',color:'rgba(247,243,238,.45)',textDecoration:'none',marginBottom:'.55rem'}}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'.75rem',color:'rgba(247,243,238,.28)'}}>
          <span>© 2026 GiftSoul. Made with love in India.</span>
          <span>Gurugram, Haryana</span>
        </div>
      </footer>
    </div>
  )
}