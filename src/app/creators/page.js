'use client'
import Link from 'next/link'
import { useState } from 'react'

const CREATORS = [
  {init:'S',name:'Sneha Patel',city:'Jaipur, Rajasthan',craft:'Soy candles',bg:'#FFF3E0',sales:48,rating:'4.9',emotions:['Celebration','Self-care','Love']},
  {init:'M',name:'Meera Krishnan',city:'Kochi, Kerala',craft:'Macramé & fibre',bg:'#E8F5E9',sales:36,rating:'5.0',emotions:['Gratitude','Friendship','New beginnings']},
  {init:'P',name:'Priya Sharma',city:'Pune, Maharashtra',craft:'Resin art',bg:'#FCE4EC',sales:29,rating:'4.8',emotions:['Love','Nostalgia','Apology']},
  {init:'A',name:'Arjun Nair',city:'Bengaluru, Karnataka',craft:'Pottery & ceramics',bg:'#E3F2FD',sales:54,rating:'4.9',emotions:['Achievement','Gratitude','Self-care']},
  {init:'R',name:'Ritu Agarwal',city:'Delhi, NCR',craft:'Hand-lettering & cards',bg:'#FFF9C4',sales:22,rating:'4.7',emotions:['Friendship','Apology','Comfort']},
  {init:'V',name:'Vikram Rao',city:'Chennai, Tamil Nadu',craft:'Leather goods',bg:'#EFEBE9',sales:18,rating:'4.8',emotions:['Achievement','Nostalgia','Love']},
  {init:'N',name:'Nisha Kulkarni',city:'Mumbai, Maharashtra',craft:'Skincare & wellness',bg:'#E0F7FA',sales:41,rating:'5.0',emotions:['Self-care','Grief','Comfort']},
  {init:'K',name:'Kavya Reddy',city:'Hyderabad, Telangana',craft:'Embroidery & textiles',bg:'#F3E5F5',sales:15,rating:'4.9',emotions:['Love','Nostalgia','Friendship']},
]

export default function Creators() {
  const [search, setSearch] = useState('')
  const filtered = CREATORS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.craft.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{minHeight:'100vh',background:'#F7F3EE'}}>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'70px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 4rem',zIndex:500,background:'rgba(247,243,238,.95)',backdropFilter:'blur(16px)',boxShadow:'0 1px 0 #D9CDB8'}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.65rem',fontWeight:400,color:'#3D2B1F',textDecoration:'none'}}>Gift<em style={{fontStyle:'italic',color:'#B5622A'}}>Soul</em></Link>
        <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
          <Link href="/marketplace" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',textDecoration:'none'}}>Browse gifts</Link>
          <Link href="/creators" style={{fontSize:'.78rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#B5622A',textDecoration:'none',borderBottom:'1px solid #B5622A',paddingBottom:'2px'}}>Creators</Link>
          <Link href="/creator-register" style={{padding:'.5rem 1.4rem',background:'#3D2B1F',color:'#F7F3EE',borderRadius:'2rem',fontSize:'.78rem',textDecoration:'none'}}>Join as creator</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:'#3D2B1F',padding:'calc(70px + 3rem) 5rem 3rem'}}>
        <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#C4A882',marginBottom:'1rem'}}>The makers behind every gift</p>
        <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2.5rem,5vw,4.5rem)',fontWeight:300,color:'#F7F3EE',lineHeight:1.1,marginBottom:'1rem'}}>
          Real hands.<br/><em style={{fontStyle:'italic',color:'#D4856A'}}>Real stories.</em>
        </h1>
        <p style={{fontSize:'1rem',color:'rgba(247,243,238,.5)',maxWidth:'500px',marginBottom:'2rem',lineHeight:1.8}}>
          Every creator on GiftSoul makes by hand, in their home, with intention. Browse their work and connect directly.
        </p>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, city, or craft..."
          style={{width:'100%',maxWidth:'480px',border:'1px solid rgba(255,255,255,.15)',borderRadius:'2rem',padding:'.75rem 1.5rem',fontFamily:'DM Sans, sans-serif',fontSize:'.9rem',background:'rgba(255,255,255,.08)',color:'#F7F3EE',outline:'none'}}
        />
      </div>

      {/* STATS */}
      <div style={{background:'#EDE6DA',borderBottom:'1px solid #D9CDB8',padding:'1.2rem 5rem',display:'flex',gap:'3rem',flexWrap:'wrap'}}>
        {[['200+','verified creators'],['18','states represented'],['4.9★','average rating'],['2,400+','gifts sold']].map(([val,label]) => (
          <div key={label} style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
            <strong style={{fontSize:'.88rem',color:'#3D2B1F'}}>{val}</strong>
            <span style={{fontSize:'.82rem',color:'#7A6A5A'}}>{label}</span>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div style={{padding:'3rem 5rem 5rem'}}>
        <p style={{fontSize:'.85rem',color:'#7A6A5A',marginBottom:'2rem'}}>Showing {filtered.length} creators</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.8rem'}}>
          {filtered.map((c,i) => (
            <Link key={i} href="/creator-profile" style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.6rem',textDecoration:'none',display:'block',transition:'all .25s'}}
              onMouseEnter={e => {e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(61,43,31,.10)'}}
              onMouseLeave={e => {e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
              <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
                <div style={{width:'56px',height:'56px',borderRadius:'50%',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond, serif',fontSize:'1.4rem',color:'#3D2B1F',flexShrink:0}}>{c.init}</div>
                <div>
                  <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.15rem',color:'#3D2B1F',marginBottom:'.1rem'}}>{c.name}</div>
                  <div style={{fontSize:'.7rem',color:'#7A6A5A'}}>{c.city}</div>
                </div>
                <div style={{marginLeft:'auto',textAlign:'right'}}>
                  <div style={{fontSize:'.8rem',color:'#B5622A',fontWeight:500}}>★ {c.rating}</div>
                  <div style={{fontSize:'.68rem',color:'#7A6A5A'}}>{c.sales} sales</div>
                </div>
              </div>
              <div style={{fontSize:'.78rem',color:'#7A6A5A',marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid #EDE6DA'}}>
                <strong style={{color:'#3D2B1F',fontWeight:500}}>{c.craft}</strong>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem'}}>
                {c.emotions.map(em => (
                  <span key={em} style={{fontSize:'.68rem',padding:'.22rem .7rem',borderRadius:'2rem',background:'rgba(181,98,42,.07)',border:'1px solid rgba(181,98,42,.2)',color:'#B5622A'}}>{em}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* JOIN CTA */}
      <div style={{background:'#B5622A',padding:'5rem',textAlign:'center'}}>
        <h2 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:300,color:'white',marginBottom:'1rem'}}>
          Are you a maker?<br/><em style={{color:'rgba(255,255,255,.65)'}}>Join GiftSoul today</em>
        </h2>
        <p style={{fontSize:'1rem',color:'rgba(255,255,255,.75)',marginBottom:'2rem',maxWidth:'480px',margin:'0 auto 2rem'}}>
          Connect with gift-seekers who value handmade and meaningful. Set up your profile in minutes.
        </p>
        <Link href="/creator-register" style={{display:'inline-block',padding:'.85rem 2.5rem',border:'1px solid rgba(255,255,255,.4)',borderRadius:'2rem',color:'white',textDecoration:'none',fontSize:'.85rem',letterSpacing:'.08em',textTransform:'uppercase'}}>
          Create your profile →
        </Link>
      </div>

      <footer style={{background:'#3D2B1F',padding:'3rem 4rem 2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.8rem',fontWeight:300,color:'#F7F3EE'}}>Gift<em style={{fontStyle:'italic',color:'#D4856A'}}>Soul</em></div>
          <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
            {[['Home','/'],['Marketplace','/marketplace'],['Creators','/creators'],['Join','/creator-register']].map(([l,h]) => (
              <Link key={l} href={h} style={{fontSize:'.82rem',color:'rgba(247,243,238,.45)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{marginTop:'2rem',paddingTop:'2rem',borderTop:'1px solid rgba(255,255,255,.07)',fontSize:'.75rem',color:'rgba(247,243,238,.28)'}}>© 2026 GiftSoul. Made with love in India.</div>
      </footer>
    </div>
  )
}