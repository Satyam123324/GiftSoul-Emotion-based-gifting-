'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Product() {
  const [qty, setQty] = useState(1)
  const [scent, setScent] = useState('Lavender')
  const [size, setSize] = useState('Small (100g) — ₹480')
  const [activeTab, setActiveTab] = useState('about')
  const [mainIcon, setMainIcon] = useState('🕯️')
  const [saved, setSaved] = useState(false)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const scents = ['Lavender','Rose & oud','Sandalwood','Vanilla cedar']
  const sizes = ['Small (100g) — ₹480','Large (200g) — ₹630']
  const thumbs = ['🕯️','✨','📦','🎁']

  return (
    <div style={{minHeight:'100vh',background:'#F7F3EE'}}>

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

      {/* BREADCRUMB */}
      <div style={{paddingTop:'90px',padding:'90px 5rem 0',fontSize:'.72rem',color:'#7A6A5A'}}>
        <Link href="/" style={{color:'#B5622A',textDecoration:'none'}}>Home</Link>
        {' / '}
        <Link href="/marketplace" style={{color:'#B5622A',textDecoration:'none'}}>Marketplace</Link>
        {' / '}
        Lavender soy candle
      </div>

      {/* MAIN LAYOUT */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',padding:'2rem 5rem 5rem',maxWidth:'1300px',margin:'0 auto'}}>

        {/* GALLERY */}
        <div style={{position:'sticky',top:'90px',height:'fit-content'}}>
          <div style={{width:'100%',aspectRatio:'1',background:'#FFF3E0',borderRadius:'24px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'100px',marginBottom:'1rem',border:'1px solid #D9CDB8'}}>
            {mainIcon}
          </div>
          <div style={{display:'flex',gap:'.8rem'}}>
            {thumbs.map(t => (
              <div key={t} onClick={() => setMainIcon(t)}
                style={{flex:1,aspectRatio:'1',borderRadius:'12px',border: mainIcon===t ? '2px solid #B5622A' : '1px solid #D9CDB8',background:'#EDE6DA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',cursor:'pointer',transition:'border-color .2s'}}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          {/* Badges */}
          <div style={{display:'flex',gap:'.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
            {['Celebration','Self-care','Love'].map(b => (
              <span key={b} style={{fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase',padding:'.28rem .8rem',borderRadius:'2rem',background:'rgba(181,98,42,.08)',border:'1px solid rgba(181,98,42,.3)',color:'#B5622A'}}>{b}</span>
            ))}
            <span style={{fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase',padding:'.28rem .8rem',borderRadius:'2rem',border:'1px solid #D9CDB8',color:'#7A6A5A'}}>Made to order</span>
          </div>

          <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(1.8rem,3vw,2.6rem)',fontWeight:300,lineHeight:1.15,color:'#3D2B1F',marginBottom:'.8rem'}}>
            Hand-poured lavender soy candle
          </h1>

          <div style={{display:'flex',alignItems:'baseline',gap:'.8rem',marginBottom:'1rem'}}>
            <span style={{fontSize:'2rem',fontWeight:500,color:'#3D2B1F'}}>₹480</span>
            <span style={{fontSize:'.75rem',color:'#7A6A5A'}}>+ ₹150 for large size</span>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1.5rem'}}>
            <span style={{color:'#B5622A',fontSize:'.9rem'}}>★★★★★</span>
            <span style={{fontSize:'.82rem',color:'#7A6A5A'}}>4.9 · 48 reviews</span>
          </div>

          <div style={{height:'1px',background:'#D9CDB8',margin:'1.5rem 0'}}></div>

          {/* Scent */}
          <div style={{marginBottom:'1.2rem'}}>
            <div style={{fontSize:'.72rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'.6rem'}}>Scent</div>
            <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
              {scents.map(s => (
                <button key={s} onClick={() => setScent(s)}
                  style={{padding:'.45rem 1.1rem',borderRadius:'2rem',border: scent===s ? '1px solid #B5622A' : '1px solid #D9CDB8',background: scent===s ? 'rgba(181,98,42,.05)' : 'white',color: scent===s ? '#B5622A' : '#3D2B1F',fontSize:'.85rem',cursor:'pointer',transition:'all .2s',fontFamily:'DM Sans, sans-serif'}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{marginBottom:'1.5rem'}}>
            <div style={{fontSize:'.72rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'.6rem'}}>Size</div>
            <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
              {sizes.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  style={{padding:'.45rem 1.1rem',borderRadius:'2rem',border: size===s ? '1px solid #B5622A' : '1px solid #D9CDB8',background: size===s ? 'rgba(181,98,42,.05)' : 'white',color: size===s ? '#B5622A' : '#3D2B1F',fontSize:'.85rem',cursor:'pointer',transition:'all .2s',fontFamily:'DM Sans, sans-serif'}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{height:'1px',background:'#D9CDB8',margin:'1.5rem 0'}}></div>

          {/* Enquiry box */}
          <div style={{background:'#EDE6DA',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.4rem',marginBottom:'1.5rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1rem'}}>
              <div style={{display:'flex',alignItems:'center',border:'1px solid #D9CDB8',borderRadius:'2rem',overflow:'hidden',background:'white'}}>
                <button onClick={() => setQty(q => Math.max(1,q-1))}
                  style={{width:'34px',height:'34px',border:'none',background:'transparent',cursor:'pointer',fontSize:'1.1rem',color:'#3D2B1F'}}>−</button>
                <span style={{width:'36px',textAlign:'center',fontSize:'.9rem',color:'#3D2B1F'}}>{qty}</span>
                <button onClick={() => setQty(q => q+1)}
                  style={{width:'34px',height:'34px',border:'none',background:'transparent',cursor:'pointer',fontSize:'1.1rem',color:'#3D2B1F'}}>+</button>
              </div>
              <div style={{fontSize:'.78rem',color:'#7A6A5A'}}>Ready in <strong style={{color:'#3D2B1F'}}>5 working days</strong> · Ships across India</div>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a personalisation note — name, message, or anything special..."
              rows={3}
              style={{width:'100%',border:'1px solid #D9CDB8',borderRadius:'12px',padding:'.7rem 1rem',fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#3D2B1F',background:'white',resize:'none',outline:'none',marginBottom:'1rem'}}
            />
            <div style={{display:'flex',gap:'.8rem',flexWrap:'wrap'}}>
              <button
                onClick={() => setSent(true)}
                style={{flex:1,padding:'.75rem',background:'#B5622A',color:'white',border:'none',borderRadius:'2rem',fontSize:'.85rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif',fontWeight:500}}>
                {sent ? '✓ Enquiry sent!' : 'Send enquiry to creator'}
              </button>
              <button
                onClick={() => setSaved(!saved)}
                style={{padding:'.75rem 1.2rem',border:'1px solid #D9CDB8',borderRadius:'2rem',background:'white',cursor:'pointer',fontSize:'.85rem',color: saved ? '#B5622A' : '#7A6A5A',fontFamily:'DM Sans, sans-serif'}}>
                {saved ? '♥ Saved' : '♡ Save'}
              </button>
            </div>
          </div>

          {/* Creator mini */}
          <Link href="/creator-profile" style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1.2rem',border:'1px solid #D9CDB8',borderRadius:'20px',background:'white',textDecoration:'none',marginBottom:'1.5rem',transition:'box-shadow .2s'}}
            onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 12px rgba(61,43,31,.07)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
            <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'#FFF3E0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',color:'#3D2B1F',flexShrink:0}}>S</div>
            <div>
              <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.1rem',color:'#3D2B1F',marginBottom:'.15rem'}}>Sneha Patel</div>
              <div style={{fontSize:'.72rem',color:'#7A6A5A'}}>Jaipur, Rajasthan · 48 sales on GiftSoul</div>
            </div>
            <span style={{marginLeft:'auto',color:'#C4A882',fontSize:'1.1rem'}}>→</span>
          </Link>

          {/* Tabs */}
          <div style={{display:'flex',borderBottom:'1px solid #D9CDB8',marginBottom:'1.5rem'}}>
            {[['about','About'],['specs','Details'],['reviews','Reviews (48)']].map(([id,label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{padding:'.7rem 1.4rem',fontSize:'.82rem',color: activeTab===id ? '#B5622A' : '#7A6A5A',border:'none',borderBottom: activeTab===id ? '2px solid #B5622A' : '2px solid transparent',background:'transparent',cursor:'pointer',marginBottom:'-1px',fontFamily:'DM Sans, sans-serif',transition:'color .2s'}}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'about' && (
            <div style={{fontSize:'.9rem',color:'#7A6A5A',lineHeight:1.8}}>
              <p>Each candle is hand-poured in small batches in Sneha&apos;s kitchen in Jaipur. She uses 100% natural soy wax, cotton wicks, and essential oil blends she crafts herself. Burn time 40–50 hours. Comes wrapped in kraft paper with a handwritten note card.</p>
              <p style={{marginTop:'.8rem'}}>Matched to <strong style={{color:'#3D2B1F'}}>celebration, self-care, and love</strong> — perfect for someone who deserves a quiet, warm moment.</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <table style={{width:'100%',fontSize:'.85rem',borderCollapse:'collapse'}}>
              {[['Material','100% natural soy wax'],['Wick','Unbleached cotton'],['Burn time','40–50 hours'],['Dimensions','7cm × 9cm'],['Packaging','Kraft paper + jute ribbon'],['Includes','Handwritten note card']].map(([k,v]) => (
                <tr key={k}>
                  <td style={{padding:'.55rem 0',borderBottom:'1px solid #EDE6DA',color:'#3D2B1F',fontWeight:500,width:'40%'}}>{k}</td>
                  <td style={{padding:'.55rem 0',borderBottom:'1px solid #EDE6DA',color:'#7A6A5A'}}>{v}</td>
                </tr>
              ))}
            </table>
          )}

          {activeTab === 'reviews' && (
            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
              {[{name:'Riya Desai',city:'Mumbai',text:'My mother cried when she smelled it. Sneha packed it beautifully and even added a note.'},
                {name:'Kabir Mehta',city:'Delhi',text:'The rose & oud scent is extraordinary. My partner kept it burning for three days straight.'}
              ].map(r => (
                <div key={r.name} style={{paddingBottom:'1.2rem',borderBottom:'1px solid #EDE6DA'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.4rem'}}>
                    <span style={{color:'#B5622A',fontSize:'.85rem'}}>★★★★★</span>
                    <span style={{fontSize:'.78rem',color:'#7A6A5A'}}>{r.name} · {r.city}</span>
                  </div>
                  <p style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#3D2B1F',fontStyle:'italic',lineHeight:1.6}}>&ldquo;{r.text}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RELATED */}
      <section style={{padding:'4rem 5rem',background:'#EDE6DA',borderTop:'1px solid #D9CDB8'}}>
        <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'1rem'}}>You might also love</p>
        <h2 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:300,color:'#3D2B1F',marginBottom:'2rem'}}>
          More gifts for <em style={{fontStyle:'italic',color:'#B5622A'}}>celebration</em>
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1.2rem'}}>
          {[{icon:'🌿',bg:'#E8F5E9',label:'Gratitude',name:'Macramé wall art',price:'₹1,200'},
            {icon:'💌',bg:'#FCE4EC',label:'Love',name:'Resin keepsake box',price:'₹890'},
            {icon:'✉️',bg:'#FFF9C4',label:'Friendship',name:'Lettered card set',price:'₹320'},
            {icon:'🏺',bg:'#E3F2FD',label:'Achievement',name:'Ceramic mug',price:'₹650'}
          ].map(g => (
            <Link key={g.name} href="/product" style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'16px',overflow:'hidden',textDecoration:'none',display:'block',transition:'all .25s'}}
              onMouseEnter={e => {e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(61,43,31,.08)'}}
              onMouseLeave={e => {e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
              <div style={{height:'130px',background:g.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>{g.icon}</div>
              <div style={{padding:'.9rem'}}>
                <div style={{fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.3rem'}}>{g.label}</div>
                <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',color:'#3D2B1F',marginBottom:'.2rem'}}>{g.name}</div>
                <div style={{fontSize:'.88rem',fontWeight:500,color:'#3D2B1F'}}>{g.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#3D2B1F',padding:'4rem 4rem 2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'1px solid rgba(255,255,255,.07)',flexWrap:'wrap',gap:'2rem'}}>
          <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem',fontWeight:300,color:'#F7F3EE'}}>Gift<em style={{fontStyle:'italic',color:'#D4856A'}}>Soul</em></div>
          <div style={{display:'flex',gap:'3rem',flexWrap:'wrap'}}>
            {[['Home','/'],['Marketplace','/marketplace'],['Creators','/creators'],['Join as creator','/creator-register']].map(([label,href]) => (
              <Link key={label} href={href} style={{fontSize:'.85rem',color:'rgba(247,243,238,.45)',textDecoration:'none'}}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{fontSize:'.75rem',color:'rgba(247,243,238,.28)'}}>© 2026 GiftSoul. Made with love in India.</div>
      </footer>
    </div>
  )
}