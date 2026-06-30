'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CreatorProfile() {
  const [activeTab, setActiveTab] = useState('shop')
  const [following, setFollowing] = useState(false)

  return (
    <div style={{minHeight:'100vh',background:'#F7F3EE'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'70px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 4rem',zIndex:500,background:'rgba(247,243,238,.95)',backdropFilter:'blur(16px)',boxShadow:'0 1px 0 #D9CDB8'}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.65rem',fontWeight:400,color:'#3D2B1F',textDecoration:'none'}}>Gift<em style={{fontStyle:'italic',color:'#B5622A'}}>Soul</em></Link>
        <div style={{display:'flex',gap:'2rem',alignItems:'center'}}>
          <Link href="/marketplace" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Browse gifts</Link>
          <Link href="/creators" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Creators</Link>
          <Link href="/creator-register" style={{padding:'.5rem 1.4rem',background:'#3D2B1F',color:'#F7F3EE',borderRadius:'2rem',fontSize:'.78rem',textDecoration:'none'}}>Join as creator</Link>
        </div>
      </nav>

      {/* PROFILE HERO */}
      <div style={{background:'#3D2B1F',padding:'calc(70px + 3rem) 5rem 0',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 70% 50%, rgba(196,168,130,.1) 0%, transparent 60%)',pointerEvents:'none'}}></div>
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'2.5rem',alignItems:'end',paddingBottom:'3rem',position:'relative'}}>
          <div style={{width:'100px',height:'100px',borderRadius:'50%',background:'#FFF3E0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',color:'#3D2B1F',border:'3px solid rgba(255,255,255,.15)'}}>S</div>
          <div>
            <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:300,color:'#F7F3EE',marginBottom:'.3rem'}}>Sneha Patel</h1>
            <p style={{fontSize:'1rem',color:'#C4A882',marginBottom:'.8rem',fontFamily:'Cormorant Garamond, serif',fontStyle:'italic'}}>Sneha&apos;s Nook · Jaipur, Rajasthan</p>
            <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
              {[['48','sales'],['★ 4.9','rating'],['12','products'],['Jan 2025','member since']].map(([val,label]) => (
                <div key={label} style={{fontSize:'.8rem',color:'rgba(247,243,238,.5)'}}>
                  <strong style={{color:'rgba(247,243,238,.8)',fontWeight:500}}>{val}</strong> {label}
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:'.8rem',flexWrap:'wrap'}}>
              <a href="https://wa.me/91XXXXXXXXXX" style={{padding:'.55rem 1.4rem',background:'#B5622A',color:'white',borderRadius:'2rem',fontSize:'.78rem',textDecoration:'none',display:'inline-block'}}>WhatsApp Sneha</a>
              <button onClick={() => setFollowing(!following)}
                style={{padding:'.55rem 1.4rem',border:'1px solid rgba(247,243,238,.3)',borderRadius:'2rem',background:'transparent',color:'#F7F3EE',fontSize:'.78rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>
                {following ? '♥ Following' : '♡ Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:'#3D2B1F',borderBottom:'1px solid rgba(255,255,255,.08)',padding:'0 5rem'}}>
        <div style={{display:'flex'}}>
          {[['shop','Shop'],['about','About'],['reviews','Reviews (48)']].map(([id,label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{padding:'1rem 1.4rem',fontSize:'.8rem',letterSpacing:'.1em',textTransform:'uppercase',color: activeTab===id ? '#F7F3EE' : 'rgba(247,243,238,.4)',border:'none',borderBottom: activeTab===id ? '2px solid #B5622A' : '2px solid transparent',background:'transparent',cursor:'pointer',marginBottom:'-1px',fontFamily:'DM Sans, sans-serif',transition:'color .2s'}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:'3rem 5rem',maxWidth:'1300px',margin:'0 auto'}}>

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1.5rem'}}>
            {[{icon:'🕯️',bg:'#FFF3E0',emotion:'Celebration · Self-care',name:'Lavender soy candle',price:'₹480'},
              {icon:'🌸',bg:'#FCE4EC',emotion:'Love · Apology',name:'Rose & chamomile candle',price:'₹520'},
              {icon:'🎁',bg:'#FFF3E0',emotion:'Gratitude · New beginnings',name:'Candle gift set (3 pack)',price:'₹1,200'},
              {icon:'✨',bg:'#FFFDE7',emotion:'Self-care · Comfort',name:'Vanilla cedar candle',price:'₹480'},
            ].map((p,i) => (
              <Link key={i} href="/product" style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',overflow:'hidden',textDecoration:'none',display:'block',transition:'all .25s'}}
                onMouseEnter={e => {e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(61,43,31,.08)'}}
                onMouseLeave={e => {e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                <div style={{height:'180px',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'50px'}}>{p.icon}</div>
                <div style={{padding:'1rem'}}>
                  <div style={{fontSize:'.65rem',textTransform:'uppercase',letterSpacing:'.08em',color:'#B5622A',marginBottom:'.3rem'}}>{p.emotion}</div>
                  <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.1rem',color:'#3D2B1F',marginBottom:'.4rem'}}>{p.name}</div>
                  <div style={{fontSize:'.9rem',fontWeight:500,color:'#3D2B1F'}}>{p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'3rem'}}>
            <div>
              <div style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'1rem'}}>Sneha&apos;s story</div>
              {["I started making candles in my kitchen in Jaipur during the 2020 lockdown. What began as a way to cope with anxiety quickly became something I couldn't stop.",
                "Each candle in Sneha's Nook is made in small batches — never more than 20 at a time. I use 100% natural soy wax, unbleached cotton wicks, and essential oil blends I mix myself. No synthetic fragrances. Nothing that shouldn't be in your home.",
                "When someone buys from GiftSoul, they're not getting a product. They're getting a piece of a story."
              ].map((p,i) => (
                <p key={i} style={{fontSize:'.95rem',color:'#7A6A5A',lineHeight:1.85,fontWeight:300,marginBottom:'1rem'}}>{p}</p>
              ))}
              <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem',marginTop:'1.5rem'}}>
                {['Soy candles','Essential oils','Gift sets','Personalised'].map(t => (
                  <span key={t} style={{padding:'.3rem .9rem',borderRadius:'2rem',fontSize:'.72rem',border:'1px solid #D9CDB8',color:'#7A6A5A',background:'white'}}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{background:'#EDE6DA',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem',height:'fit-content'}}>
              {[['Location','Jaipur, Rajasthan'],['Ships to','All of India'],['Lead time','5 working days'],['Custom orders','Yes — always'],['Response time','Within 12 hours'],['Instagram','@snehajaipur']].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'.7rem 0',borderBottom:'1px solid #D9CDB8'}}>
                  <span style={{fontSize:'.78rem',color:'#7A6A5A'}}>{k}</span>
                  <span style={{fontSize:'.88rem',fontWeight:500,color:'#3D2B1F'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'3rem'}}>
            <div style={{background:'#EDE6DA',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem',height:'fit-content',textAlign:'center'}}>
              <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'4rem',fontWeight:300,color:'#3D2B1F',lineHeight:1}}>4.9</div>
              <div style={{color:'#B5622A',fontSize:'1.1rem',margin:'.4rem 0'}}>★★★★★</div>
              <div style={{fontSize:'.78rem',color:'#7A6A5A'}}>48 reviews</div>
            </div>
            <div>
              {[{name:'Riya Desai',city:'Mumbai',date:'March 2026',text:'My mother cried when she smelled it. Sneha packed it beautifully and even added a note just for her.'},
                {name:'Kabir Mehta',city:'Delhi',date:'Feb 2026',text:'The rose & oud scent is extraordinary. My partner kept it burning for three days straight.'},
                {name:'Anika Singh',city:'Bengaluru',date:'Jan 2026',text:'Beautiful candle, arrived perfectly packed. Sneha kept me updated the whole time. Would absolutely buy again.'}
              ].map(r => (
                <div key={r.name} style={{paddingBottom:'1.5rem',marginBottom:'1.5rem',borderBottom:'1px solid #D9CDB8'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.5rem'}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#EDE6DA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.85rem',color:'#7A6A5A',fontWeight:500}}>{r.name[0]}</div>
                    <span style={{fontSize:'.85rem',color:'#3D2B1F',fontWeight:500}}>{r.name}</span>
                    <span style={{fontSize:'.72rem',color:'#7A6A5A',marginLeft:'auto'}}>{r.date}</span>
                  </div>
                  <div style={{color:'#B5622A',fontSize:'.8rem',marginBottom:'.4rem'}}>★★★★★</div>
                  <p style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#3D2B1F',fontStyle:'italic',lineHeight:1.6}}>&ldquo;{r.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{background:'#3D2B1F',padding:'3rem 4rem 2rem',marginTop:'2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem',paddingBottom:'2rem',marginBottom:'2rem',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
          <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.8rem',fontWeight:300,color:'#F7F3EE'}}>Gift<em style={{fontStyle:'italic',color:'#D4856A'}}>Soul</em></div>
          <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
            {[['Home','/'],['Marketplace','/marketplace'],['Creators','/creators']].map(([l,h]) => (
              <Link key={l} href={h} style={{fontSize:'.82rem',color:'rgba(247,243,238,.45)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{fontSize:'.75rem',color:'rgba(247,243,238,.28)'}}>© 2026 GiftSoul. Made with love in India.</div>
      </footer>
    </div>
  )
}