'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [toggles, setToggles] = useState({candle:true,rose:true,gift:false})

  const stats = [
    {label:'Total earnings',val:'₹23,040',change:'↑ 18% this month',up:true},
    {label:'Total sales',val:'48',change:'↑ 6 this week',up:true},
    {label:'Profile views',val:'1,204',change:'↑ 24% this month',up:true},
    {label:'Avg. rating',val:'4.9 ★',change:'48 reviews',up:null},
  ]

  const enquiries = [
    {name:'Riya Desai',city:'Mumbai',msg:'Something warm for my mum\'s retirement...',product:'Lavender soy candle',status:'new',date:'Today'},
    {name:'Kabir Mehta',city:'Delhi',msg:'Can I get rose & oud in a large size?',product:'Rose & chamomile',status:'new',date:'Yesterday'},
    {name:'Priya Iyer',city:'Chennai',msg:'Can you add a custom label with my friend\'s name?',product:'Gift set (3 pack)',status:'new',date:'2 days ago'},
    {name:'Anika Singh',city:'Bengaluru',msg:'Custom order for a baby shower, 10 units',product:'Gift set (3 pack)',status:'replied',date:'4 days ago'},
  ]

  const products = [
    {icon:'🕯️',bg:'#FFF3E0',name:'Lavender soy candle',price:'₹480',sales:22,views:340,key:'candle'},
    {icon:'🌸',bg:'#E8F5E9',name:'Rose & chamomile candle',price:'₹520',sales:18,views:210,key:'rose'},
    {icon:'🎁',bg:'#FFF9C4',name:'Candle gift set (3 pack)',price:'₹1,200',sales:8,views:180,key:'gift'},
  ]

  const sidebarItems = [
    {id:'overview',label:'📊 Dashboard'},
    {id:'enquiries',label:'✉️ Enquiries',badge:3},
    {id:'products',label:'🎁 My products'},
    {id:'profile',label:'👤 Edit profile'},
  ]

  return (
    <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'240px 1fr',background:'#F7F3EE'}}>

      {/* SIDEBAR */}
      <div style={{background:'#3D2B1F',position:'sticky',top:0,height:'100vh',overflow:'auto'}}>
        <div style={{padding:'1.5rem',borderBottom:'1px solid rgba(255,255,255,.07)',marginBottom:'1.5rem'}}>
          <Link href="/" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.4rem',fontWeight:400,color:'#F7F3EE',textDecoration:'none',display:'block',marginBottom:'1.2rem'}}>Gift<em style={{fontStyle:'italic',color:'#D4856A'}}>Soul</em></Link>
          <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#FFF3E0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond, serif',fontSize:'1.2rem',color:'#3D2B1F',marginBottom:'.7rem'}}>S</div>
          <div style={{fontSize:'.9rem',color:'#F7F3EE',fontWeight:500}}>Sneha Patel</div>
          <div style={{fontSize:'.72rem',color:'rgba(247,243,238,.4)'}}>Sneha&apos;s Nook</div>
        </div>
        <div>
          <div style={{fontSize:'.62rem',letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(247,243,238,.25)',padding:'.8rem 1.5rem .4rem'}}>Overview</div>
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{display:'flex',alignItems:'center',gap:'.8rem',width:'100%',padding:'.65rem 1.5rem',fontSize:'.82rem',color: activeTab===item.id ? '#F7F3EE' : 'rgba(247,243,238,.45)',background: activeTab===item.id ? 'rgba(255,255,255,.07)' : 'transparent',border:'none',borderRight: activeTab===item.id ? '2px solid #B5622A' : '2px solid transparent',cursor:'pointer',textAlign:'left',fontFamily:'DM Sans, sans-serif',transition:'all .2s'}}>
              {item.label}
              {item.badge && <span style={{background:'#B5622A',color:'white',fontSize:'.62rem',padding:'.15rem .5rem',borderRadius:'10px',marginLeft:'auto'}}>{item.badge}</span>}
            </button>
          ))}
          <div style={{padding:'1.5rem',marginTop:'1rem',borderTop:'1px solid rgba(255,255,255,.07)'}}>
            <Link href="/creator-profile" style={{fontSize:'.78rem',color:'rgba(247,243,238,.45)',textDecoration:'none',display:'block',marginBottom:'.5rem'}}>View my shop →</Link>
            <Link href="/" style={{fontSize:'.78rem',color:'rgba(247,243,238,.45)',textDecoration:'none',display:'block'}}>← Back to GiftSoul</Link>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{padding:'2.5rem',overflowY:'auto'}}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.5rem'}}>Creator dashboard</p>
            <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',fontWeight:300,color:'#3D2B1F',marginBottom:'2rem'}}>Good morning, <em style={{fontStyle:'italic',color:'#B5622A'}}>Sneha</em></h1>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.2rem',marginBottom:'2rem'}}>
              {stats.map(s => (
                <div key={s.label} style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'16px',padding:'1.25rem 1.4rem'}}>
                  <div style={{fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'.5rem'}}>{s.label}</div>
                  <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.2rem',fontWeight:300,color:'#3D2B1F',lineHeight:1}}>{s.val}</div>
                  <div style={{fontSize:'.72rem',marginTop:'.4rem',color: s.up===true ? '#4A6741' : s.up===false ? '#B5301A' : '#7A6A5A'}}>{s.change}</div>
                </div>
              ))}
            </div>

            {/* AI insight */}
            <div style={{background:'#EDE6DA',border:'1px solid #D9CDB8',borderRadius:'16px',padding:'1rem 1.2rem',display:'flex',alignItems:'flex-start',gap:'.8rem',marginBottom:'1.5rem'}}>
              <div style={{width:'32px',height:'32px',background:'#B5622A',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',color:'white',flexShrink:0,fontWeight:600}}>AI</div>
              <div style={{fontSize:'.82rem',color:'#7A6A5A',lineHeight:1.6}}>
                <strong style={{color:'#3D2B1F'}}>This week&apos;s insight:</strong> Your candles are being matched to &ldquo;grief & comfort&rdquo; stories 34% more than last month. Consider adding a description that speaks to difficult moments — it will increase matches.
              </div>
            </div>

            {/* Recent enquiries */}
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem',marginBottom:'1.5rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.2rem'}}>
                <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',color:'#3D2B1F'}}>Recent enquiries</div>
                <button onClick={() => setActiveTab('enquiries')} style={{fontSize:'.78rem',color:'#B5622A',background:'none',border:'none',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>View all →</button>
              </div>
              {enquiries.slice(0,3).map((e,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:'1rem',alignItems:'center',padding:'.9rem 0',borderBottom: i<2 ? '1px solid #EDE6DA' : 'none'}}>
                  <div>
                    <div style={{fontSize:'.88rem',fontWeight:500,color:'#3D2B1F'}}>{e.name} · {e.city}</div>
                    <div style={{fontSize:'.78rem',color:'#7A6A5A',fontStyle:'italic',marginTop:'.1rem'}}>"{e.msg}"</div>
                  </div>
                  <span style={{fontSize:'.68rem',padding:'.22rem .8rem',borderRadius:'2rem',background: e.status==='new' ? 'rgba(181,98,42,.1)' : 'rgba(74,103,65,.1)',border: `1px solid ${e.status==='new' ? 'rgba(181,98,42,.25)' : 'rgba(74,103,65,.25)'}`,color: e.status==='new' ? '#B5622A' : '#4A6741',whiteSpace:'nowrap'}}>{e.status==='new' ? 'New' : 'Replied'}</span>
                  <button style={{padding:'.3rem .8rem',borderRadius:'2rem',fontSize:'.72rem',border:'1px solid #D9CDB8',background:'transparent',color:'#7A6A5A',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Reply</button>
                </div>
              ))}
            </div>

            {/* Products mini */}
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.2rem'}}>
                <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',color:'#3D2B1F'}}>Your listings</div>
                <Link href="/creator-register" style={{fontSize:'.78rem',color:'#B5622A',textDecoration:'none'}}>+ Add listing</Link>
              </div>
              {products.map((p,i) => (
                <div key={p.key} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.8rem 0',borderBottom: i<products.length-1 ? '1px solid #EDE6DA' : 'none'}}>
                  <div style={{width:'44px',height:'44px',borderRadius:'8px',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>{p.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'.88rem',fontWeight:500,color:'#3D2B1F'}}>{p.name}</div>
                    <div style={{fontSize:'.75rem',color:'#7A6A5A'}}>{p.price}</div>
                  </div>
                  <div style={{textAlign:'right',marginRight:'.5rem'}}>
                    <div style={{fontSize:'.88rem',fontWeight:500,color:'#3D2B1F'}}>{p.sales} sales</div>
                    <div style={{fontSize:'.72rem',color:'#7A6A5A'}}>{p.views} views</div>
                  </div>
                  <div onClick={() => setToggles(t => ({...t,[p.key]:!t[p.key]}))}
                    style={{width:'36px',height:'20px',background: toggles[p.key] ? '#4A6741' : '#D9CDB8',borderRadius:'10px',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
                    <div style={{width:'14px',height:'14px',background:'white',borderRadius:'50%',position:'absolute',top:'3px',left: toggles[p.key] ? '19px' : '3px',transition:'left .2s'}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div>
            <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.5rem'}}>Inbox</p>
            <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',fontWeight:300,color:'#3D2B1F',marginBottom:'2rem'}}>Your <em style={{color:'#B5622A'}}>enquiries</em></h1>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem'}}>
              {enquiries.map((e,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:'1rem',alignItems:'center',padding:'.9rem 0',borderBottom: i<enquiries.length-1 ? '1px solid #EDE6DA' : 'none'}}>
                  <div>
                    <div style={{fontSize:'.88rem',fontWeight:500,color:'#3D2B1F'}}>{e.name} · {e.city}</div>
                    <div style={{fontSize:'.78rem',color:'#7A6A5A',fontStyle:'italic',marginTop:'.1rem'}}>"{e.msg}"</div>
                    <div style={{fontSize:'.72rem',color:'#C4A882',marginTop:'.2rem'}}>{e.product}</div>
                  </div>
                  <span style={{fontSize:'.7rem',color:'#7A6A5A',whiteSpace:'nowrap'}}>{e.date}</span>
                  <span style={{fontSize:'.68rem',padding:'.22rem .8rem',borderRadius:'2rem',background: e.status==='new' ? 'rgba(181,98,42,.1)' : 'rgba(74,103,65,.1)',border: `1px solid ${e.status==='new' ? 'rgba(181,98,42,.25)' : 'rgba(74,103,65,.25)'}`,color: e.status==='new' ? '#B5622A' : '#4A6741',whiteSpace:'nowrap'}}>{e.status==='new' ? 'New' : 'Replied'}</span>
                  <button style={{padding:'.3rem .8rem',borderRadius:'2rem',fontSize:'.72rem',border:'1px solid #D9CDB8',background:'transparent',color:'#7A6A5A',cursor:'pointer',fontFamily:'DM Sans, sans-serif',whiteSpace:'nowrap'}}>
                    {e.status==='new' ? 'Reply' : 'View'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'2rem'}}>
              <div>
                <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.5rem'}}>Listings</p>
                <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',fontWeight:300,color:'#3D2B1F'}}>Your <em style={{color:'#B5622A'}}>gift listings</em></h1>
              </div>
              <Link href="/creator-register" style={{padding:'.75rem 1.6rem',background:'#B5622A',color:'white',borderRadius:'2rem',textDecoration:'none',fontSize:'.85rem'}}>+ Add listing</Link>
            </div>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem',marginBottom:'1rem'}}>
              {products.map((p,i) => (
                <div key={p.key} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.9rem 0',borderBottom: i<products.length-1 ? '1px solid #EDE6DA' : 'none'}}>
                  <div style={{width:'48px',height:'48px',borderRadius:'10px',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',flexShrink:0}}>{p.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'.9rem',fontWeight:500,color:'#3D2B1F'}}>{p.name}</div>
                    <div style={{fontSize:'.75rem',color:'#7A6A5A'}}>{p.price} · Made to order</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'.88rem',fontWeight:500,color:'#3D2B1F'}}>{p.sales} sales</div>
                    <div style={{fontSize:'.72rem',color:'#7A6A5A'}}>{p.views} views</div>
                  </div>
                  <button style={{padding:'.4rem 1rem',border:'1px solid #D9CDB8',borderRadius:'2rem',background:'transparent',color:'#7A6A5A',fontSize:'.78rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Edit</button>
                  <div onClick={() => setToggles(t => ({...t,[p.key]:!t[p.key]}))}
                    style={{width:'36px',height:'20px',background: toggles[p.key] ? '#4A6741' : '#D9CDB8',borderRadius:'10px',position:'relative',cursor:'pointer',transition:'background .2s',flexShrink:0}}>
                    <div style={{width:'14px',height:'14px',background:'white',borderRadius:'50%',position:'absolute',top:'3px',left: toggles[p.key] ? '19px' : '3px',transition:'left .2s'}}></div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => window.location.href='/creator-register'} style={{width:'100%',padding:'1.5rem',border:'2px dashed #D9CDB8',borderRadius:'20px',background:'transparent',cursor:'pointer',fontSize:'.88rem',color:'#7A6A5A',fontFamily:'DM Sans, sans-serif',transition:'all .2s'}}
              onMouseEnter={e => {e.target.style.borderColor='#B5622A';e.target.style.color='#B5622A'}}
              onMouseLeave={e => {e.target.style.borderColor='#D9CDB8';e.target.style.color='#7A6A5A'}}>
              + Add a new gift listing
            </button>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.5rem'}}>Settings</p>
            <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',fontWeight:300,color:'#3D2B1F',marginBottom:'2rem'}}>Edit your <em style={{color:'#B5622A'}}>profile</em></h1>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.75rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                {[['First name','Sneha'],['Last name','Patel'],['Shop name',"Sneha's Nook"],['City','Jaipur, Rajasthan']].map(([label,val]) => (
                  <div key={label}>
                    <label style={{fontSize:'.72rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',display:'block',marginBottom:'.4rem'}}>{label}</label>
                    <input defaultValue={val} style={{width:'100%',border:'1px solid #D9CDB8',borderRadius:'8px',padding:'.65rem 1rem',fontFamily:'DM Sans, sans-serif',fontSize:'.9rem',background:'white',color:'#3D2B1F',outline:'none'}}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:'1rem'}}>
                <label style={{fontSize:'.72rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',display:'block',marginBottom:'.4rem'}}>Your story (bio)</label>
                <textarea rows={5} defaultValue="I started making candles in my kitchen in Jaipur during the 2020 lockdown..." style={{width:'100%',border:'1px solid #D9CDB8',borderRadius:'8px',padding:'.65rem 1rem',fontFamily:'DM Sans, sans-serif',fontSize:'.9rem',background:'white',color:'#3D2B1F',outline:'none',resize:'vertical',lineHeight:1.6}}/>
              </div>
              <button onClick={() => alert('Profile saved!')} style={{padding:'.7rem 2rem',background:'#B5622A',color:'white',border:'none',borderRadius:'2rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif',fontSize:'.85rem',fontWeight:500}}>
                Save changes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}