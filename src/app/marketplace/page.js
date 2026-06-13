'use client'
import Link from 'next/link'
import { useState } from 'react'

const PRODUCTS = [
  {icon:'🕯️',bg:'#FFF3E0',emotion:'Celebration · Self-care',name:'Hand-poured lavender soy candle',by:"Sneha's Nook · Jaipur",price:'₹480',lead:'5 days',emotions:['celebration','self-care','love']},
  {icon:'🌿',bg:'#E8F5E9',emotion:'Gratitude · New beginnings',name:'Handwoven macramé wall hanging',by:'Thread & Knot · Kochi',price:'₹1,200',lead:'3 days',emotions:['gratitude','new beginnings','friendship']},
  {icon:'💌',bg:'#FCE4EC',emotion:'Love · Nostalgia',name:'Resin keepsake memory box',by:'Crystal Craft · Pune',price:'₹890',lead:'7 days',emotions:['love','nostalgia','grief']},
  {icon:'🏺',bg:'#E3F2FD',emotion:'Achievement · Gratitude',name:'Hand-thrown ceramic mug',by:'Clay & Fire · Bengaluru',price:'₹650',lead:'10 days',emotions:['achievement','gratitude','self-care']},
  {icon:'💍',bg:'#F3E5F5',emotion:'Love · Romance',name:'Handcrafted silver ring',by:'Silver Thread · Jaipur',price:'₹2,200',lead:'5 days',emotions:['love','celebration']},
  {icon:'🧴',bg:'#E0F7FA',emotion:'Self-care · Comfort',name:'Ayurvedic skincare gift set',by:'Roots & Rituals · Mumbai',price:'₹1,400',lead:'In stock',emotions:['self-care','grief','comfort']},
  {icon:'✉️',bg:'#FFF9C4',emotion:'Friendship · Gratitude',name:'Hand-lettered greeting card set',by:'Paper & Pen · Chennai',price:'₹320',lead:'2 days',emotions:['friendship','gratitude','apology']},
  {icon:'🧶',bg:'#FCECEA',emotion:'Comfort · Nostalgia',name:'Chunky crochet throw blanket',by:'Yarn & Soul · Ahmedabad',price:'₹3,200',lead:'14 days',emotions:['grief','nostalgia','self-care']},
  {icon:'🎁',bg:'#E8F5E9',emotion:'Celebration · Achievement',name:'Personalised gift hamper',by:'The Curated Basket · Delhi',price:'₹1,800',lead:'4 days',emotions:['celebration','achievement','gratitude']},
  {icon:'🪴',bg:'#F1F8E9',emotion:'New beginnings · Hope',name:'Succulent terrarium kit',by:'Green Things · Hyderabad',price:'₹750',lead:'In stock',emotions:['new beginnings','self-care','friendship']},
  {icon:'🎨',bg:'#FFF3E0',emotion:'Nostalgia · Love',name:'Custom watercolour portrait',by:'Brushwork · Kolkata',price:'₹4,500',lead:'21 days',emotions:['love','nostalgia','achievement']},
  {icon:'🌸',bg:'#FCE4EC',emotion:'Apology · Friendship',name:'Pressed flower resin bookmark',by:'Petal & Glass · Pune',price:'₹380',lead:'3 days',emotions:['apology','friendship','love']},
]

const EMOTIONS = ['all','love','celebration','grief','gratitude','nostalgia','friendship','new beginnings','self-care','achievement','apology','comfort']

export default function Marketplace() {
  const [activeEmo, setActiveEmo] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter(p =>
    activeEmo === 'all' || p.emotions.some(e => e.includes(activeEmo.split(' ')[0]))
  )

  return (
    <div style={{minHeight:'100vh',background:'#F7F3EE'}}>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'70px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 4rem',zIndex:500,background:'rgba(247,243,238,.95)',backdropFilter:'blur(16px)',boxShadow:'0 1px 0 #D9CDB8'}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.65rem',fontWeight:400,color:'#3D2B1F',textDecoration:'none'}}>
          Gift<em style={{fontStyle:'italic',color:'#B5622A'}}>Soul</em>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
          <Link href="/marketplace" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#B5622A',textDecoration:'none',borderBottom:'1px solid #B5622A',paddingBottom:'2px'}}>Browse gifts</Link>
          <Link href="/creators" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Creators</Link>
          <Link href="/creator-register" style={{padding:'.5rem 1.4rem',background:'#3D2B1F',color:'#F7F3EE',borderRadius:'2rem',fontSize:'.78rem',textDecoration:'none'}}>Join as creator</Link>
        </div>
      </nav>

      {/* EMOTION HERO BAR */}
      <div style={{background:'#3D2B1F',padding:'calc(70px + 2.5rem) 4rem 2.5rem'}}>
        <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#C4A882',marginBottom:'.8rem'}}>Browse by feeling</p>
        <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:300,color:'#F7F3EE',marginBottom:'.8rem'}}>
          Find a gift for <em style={{fontStyle:'italic',color:'#D4856A'}}>{activeEmo === 'all' ? 'every emotion' : activeEmo}</em>
        </h1>
        <p style={{fontSize:'.9rem',color:'rgba(247,243,238,.5)',maxWidth:'500px',marginBottom:'2rem'}}>
          Select an emotion to filter gifts chosen for that feeling.
        </p>
        <div style={{display:'flex',gap:'.7rem',flexWrap:'wrap'}}>
          {EMOTIONS.map(em => (
            <button key={em} onClick={() => setActiveEmo(em)}
              style={{padding:'.45rem 1.2rem',borderRadius:'2rem',border:'1px solid rgba(247,243,238,.2)',background: activeEmo===em ? '#B5622A' : 'transparent',color: activeEmo===em ? 'white' : 'rgba(247,243,238,.55)',fontFamily:'DM Sans, sans-serif',fontSize:'.8rem',cursor:'pointer',transition:'all .2s',fontWeight: activeEmo===em ? 500 : 400}}>
              {em === 'all' ? 'All gifts' : em}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{background:'#EDE6DA',borderBottom:'1px solid #D9CDB8',padding:'1.2rem 4rem',display:'flex',alignItems:'center',gap:'1rem'}}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Or describe your situation — we'll find the right gift..."
          style={{flex:1,maxWidth:'600px',border:'1px solid #D9CDB8',borderRadius:'2rem',padding:'.65rem 1.4rem',fontFamily:'Cormorant Garamond, serif',fontSize:'1rem',background:'white',outline:'none',color:'#3D2B1F'}}
        />
        <button style={{padding:'.65rem 1.6rem',background:'#B5622A',color:'white',border:'none',borderRadius:'2rem',fontSize:'.82rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif',fontWeight:500,whiteSpace:'nowrap'}}>
          AI match →
        </button>
      </div>

      {/* LAYOUT */}
      <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:'2.5rem',padding:'2rem 4rem 5rem',maxWidth:'1400px',margin:'0 auto'}}>

        {/* SIDEBAR */}
        <aside style={{position:'sticky',top:'90px',height:'fit-content'}}>
          <div style={{marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'1px solid #D9CDB8'}}>
            <div style={{fontSize:'.7rem',letterSpacing:'.15em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1rem'}}>Category</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              {['All','Candles','Jewellery','Pottery','Macramé','Resin','Cards','Skincare'].map(cat => (
                <span key={cat} style={{padding:'.3rem .9rem',borderRadius:'2rem',fontSize:'.72rem',border:'1px solid #D9CDB8',color:'#7A6A5A',cursor:'pointer',background:'transparent',transition:'all .18s'}}
                  onMouseEnter={e => {e.target.style.background='#B5622A';e.target.style.color='white';e.target.style.borderColor='#B5622A'}}
                  onMouseLeave={e => {e.target.style.background='transparent';e.target.style.color='#7A6A5A';e.target.style.borderColor='#D9CDB8'}}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div style={{marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'1px solid #D9CDB8'}}>
            <div style={{fontSize:'.7rem',letterSpacing:'.15em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1rem'}}>Price range</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.8rem',fontSize:'.85rem',color:'#7A6A5A'}}>
                <span>Min</span>
                <input type="range" min="0" max="5000" step="50" defaultValue="0" style={{flex:1,accentColor:'#B5622A'}}/>
                <span style={{fontWeight:500,color:'#3D2B1F',minWidth:'40px'}}>₹0</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.8rem',fontSize:'.85rem',color:'#7A6A5A'}}>
                <span>Max</span>
                <input type="range" min="0" max="10000" step="100" defaultValue="5000" style={{flex:1,accentColor:'#B5622A'}}/>
                <span style={{fontWeight:500,color:'#3D2B1F',minWidth:'40px'}}>₹5k</span>
              </div>
            </div>
          </div>
          <div style={{marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'1px solid #D9CDB8'}}>
            <div style={{fontSize:'.7rem',letterSpacing:'.15em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1rem'}}>Recipient</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              {['Her','Him','Them','Kids','Parents'].map(r => (
                <span key={r} style={{padding:'.3rem .9rem',borderRadius:'2rem',fontSize:'.72rem',border:'1px solid #D9CDB8',color:'#7A6A5A',cursor:'pointer'}}>{r}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
            <span style={{fontSize:'.85rem',color:'#7A6A5A'}}>Showing {filtered.length} gifts</span>
            <select style={{fontSize:'.82rem',border:'1px solid #D9CDB8',padding:'.45rem .9rem',borderRadius:'2rem',background:'white',color:'#3D2B1F',outline:'none'}}>
              <option>Most relevant</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
              <option>Newest</option>
            </select>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1.5rem'}}>
            {filtered.map((p,i) => (
              <Link key={i} href="/product" style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',overflow:'hidden',textDecoration:'none',display:'block',transition:'all .25s'}}
                onMouseEnter={e => {e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(61,43,31,.10)'}}
                onMouseLeave={e => {e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                <div style={{height:'180px',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'48px',position:'relative'}}>
                  {p.icon}
                </div>
                <div style={{padding:'1rem 1.1rem 1.2rem'}}>
                  <div style={{fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.4rem'}}>{p.emotion}</div>
                  <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.1rem',color:'#3D2B1F',marginBottom:'.2rem',lineHeight:1.3}}>{p.name}</div>
                  <div style={{fontSize:'.7rem',color:'#7A6A5A',marginBottom:'.6rem'}}>by {p.by}</div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontSize:'.95rem',fontWeight:500,color:'#3D2B1F'}}>{p.price}</span>
                    <span style={{fontSize:'.65rem',color:'#7A6A5A'}}>{p.lead}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer style={{background:'#3D2B1F',padding:'4rem 4rem 2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'3rem',paddingBottom:'3rem',borderBottom:'1px solid rgba(255,255,255,.07)',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2rem',fontWeight:300,color:'#F7F3EE'}}>Gift<em style={{fontStyle:'italic',color:'#D4856A'}}>Soul</em></div>
            <div style={{fontSize:'.82rem',color:'rgba(247,243,238,.38)',marginTop:'.5rem'}}>Gifts that carry emotion, made by hand.</div>
          </div>
          <div style={{display:'flex',gap:'4rem',flexWrap:'wrap'}}>
            {[{title:'Platform',links:[['Home','/'],['Browse gifts','/marketplace'],['Creators','/creators']]},
              {title:'Creators',links:[['Join as creator','/creator-register'],['Dashboard','/dashboard']]}
            ].map(col => (
              <div key={col.title}>
                <h4 style={{fontSize:'.68rem',letterSpacing:'.16em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1rem'}}>{col.title}</h4>
                {col.links.map(([label,href]) => (
                  <Link key={label} href={href} style={{display:'block',fontSize:'.85rem',color:'rgba(247,243,238,.45)',textDecoration:'none',marginBottom:'.5rem'}}>{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{fontSize:'.75rem',color:'rgba(247,243,238,.28)'}}>© 2026 GiftSoul. Made with love in India.</div>
      </footer>
    </div>
  )
}