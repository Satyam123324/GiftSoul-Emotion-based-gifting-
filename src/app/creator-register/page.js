'use client'
import Link from 'next/link'
import { useState } from 'react'

const STEPS = ['Identity','Craft','Story','Preview']
const CRAFTS = ['Candles','Jewellery','Pottery','Macramé','Greeting cards','Gift hampers','Paintings','Crochet & knit','Resin art','Skincare','Stationery','Personalised gifts']
const EMOTIONS = ['Love & romance','Grief & comfort','Celebration','Gratitude','New beginnings','Friendship','Nostalgia','Self-care','Achievement','Apology','Family bonding']

export default function CreatorRegister() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({fname:'',lname:'',shop:'',city:'',tagline:'',bio:'',instagram:'',crafts:[],emotions:[]})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (k,v) => setForm(f => ({...f,[k]:v}))
  const toggleArr = (k,v) => setForm(f => ({...f,[k]: f[k].includes(v) ? f[k].filter(x=>x!==v) : [...f[k],v]}))

  const inputStyle = {width:'100%',border:'1px solid #D9CDB8',borderRadius:'8px',padding:'.65rem 1rem',fontFamily:'DM Sans, sans-serif',fontSize:'.9rem',background:'white',color:'#3D2B1F',outline:'none'}
  const tagStyle = (active) => ({padding:'.35rem 1rem',borderRadius:'20px',fontSize:'.78rem',border: active ? '1px solid #B5622A' : '1px solid #D9CDB8',background: active ? 'rgba(181,98,42,.08)' : 'transparent',color: active ? '#B5622A' : '#7A6A5A',cursor:'pointer',transition:'all .15s',fontFamily:'DM Sans, sans-serif'})

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.fname} ${form.lname}`.trim(),
          shop_name: form.shop,
          bio: form.bio,
          city: form.city,
          craft_tags: form.crafts,
          emotion_tags: form.emotions,
          instagram: form.instagram,
        })
      })
      const data = await res.json()
      if (data.error) {
        setSubmitError(data.error)
      } else {
        setSubmitted(true)
      }
    } catch (e) {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return (
    <div style={{minHeight:'100vh',background:'#F7F3EE',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1.5rem',padding:'2rem',textAlign:'center'}}>
      <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'#4A6741',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',color:'white'}}>✓</div>
      <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',fontWeight:300,color:'#3D2B1F'}}>You&apos;re all set, {form.fname}!</h1>
      <p style={{fontSize:'1rem',color:'#7A6A5A',maxWidth:'400px',lineHeight:1.7}}>Your profile is under review. We&apos;ll email you within 24 hours when you&apos;re live on GiftSoul.</p>
      <Link href="/" style={{padding:'.75rem 2rem',background:'#B5622A',color:'white',borderRadius:'2rem',textDecoration:'none',fontSize:'.85rem'}}>Back to GiftSoul →</Link>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#F7F3EE'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'70px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 4rem',zIndex:500,background:'rgba(247,243,238,.95)',backdropFilter:'blur(16px)',boxShadow:'0 1px 0 #D9CDB8'}}>
        <Link href="/" style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.65rem',fontWeight:400,color:'#3D2B1F',textDecoration:'none'}}>Gift<em style={{fontStyle:'italic',color:'#B5622A'}}>Soul</em></Link>
      </nav>

      <div style={{maxWidth:'680px',margin:'0 auto',padding:'calc(70px + 3rem) 2rem 4rem'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <p style={{fontSize:'.72rem',letterSpacing:'.18em',textTransform:'uppercase',color:'#B5622A',marginBottom:'.5rem'}}>GiftSoul — Creator Studio</p>
          <h1 style={{fontFamily:'Cormorant Garamond, serif',fontSize:'2.5rem',fontWeight:300,color:'#3D2B1F',marginBottom:'.4rem'}}>Set up your maker profile</h1>
          <p style={{fontSize:'.9rem',color:'#7A6A5A'}}>Let gift-seekers discover your handcrafted creations</p>
        </div>

        <div style={{display:'flex',alignItems:'center',marginBottom:'2rem'}}>
          {STEPS.map((s,i) => (
            <div key={s} style={{display:'flex',alignItems:'center',flex: i < STEPS.length-1 ? 1 : 'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',whiteSpace:'nowrap'}}>
                <div style={{width:'28px',height:'28px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:500,background: i < step ? '#0F6E56' : i === step ? '#B5622A' : 'white',color: i <= step ? 'white' : '#7A6A5A',border: i > step ? '1px solid #D9CDB8' : 'none',flexShrink:0}}>
                  {i < step ? '✓' : i+1}
                </div>
                <span style={{fontSize:'12px',color: i === step ? '#B5622A' : '#7A6A5A',fontWeight: i === step ? 500 : 400}}>{s}</span>
              </div>
              {i < STEPS.length-1 && <div style={{flex:1,height:'1px',background:'#D9CDB8',margin:'0 8px'}}></div>}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.75rem'}}>
            <p style={{fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1.25rem'}}>Your identity</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              <div><label style={{fontSize:'13px',color:'#7A6A5A',display:'block',marginBottom:'5px'}}>First name</label><input style={inputStyle} value={form.fname} onChange={e=>update('fname',e.target.value)} placeholder="Sneha"/></div>
              <div><label style={{fontSize:'13px',color:'#7A6A5A',display:'block',marginBottom:'5px'}}>Last name</label><input style={inputStyle} value={form.lname} onChange={e=>update('lname',e.target.value)} placeholder="Patel"/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              <div><label style={{fontSize:'13px',color:'#7A6A5A',display:'block',marginBottom:'5px'}}>Shop / Studio name</label><input style={inputStyle} value={form.shop} onChange={e=>update('shop',e.target.value)} placeholder="Sneha's Nook"/></div>
              <div><label style={{fontSize:'13px',color:'#7A6A5A',display:'block',marginBottom:'5px'}}>City</label><input style={inputStyle} value={form.city} onChange={e=>update('city',e.target.value)} placeholder="Jaipur, Rajasthan"/></div>
            </div>
            <div style={{marginBottom:'1rem'}}><label style={{fontSize:'13px',color:'#7A6A5A',display:'block',marginBottom:'5px'}}>Tagline</label><input style={inputStyle} value={form.tagline} onChange={e=>update('tagline',e.target.value)} placeholder="Hand-poured soy candles with love from Rajasthan"/></div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.75rem',marginBottom:'1rem'}}>
              <p style={{fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1rem'}}>What do you make?</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem'}}>
                {CRAFTS.map(c => <button key={c} onClick={()=>toggleArr('crafts',c)} style={tagStyle(form.crafts.includes(c))}>{c}</button>)}
              </div>
            </div>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.75rem'}}>
              <p style={{fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'.4rem'}}>Emotions your gifts suit</p>
              <p style={{fontSize:'12px',color:'#7A6A5A',marginBottom:'1rem'}}>Our AI uses this to recommend your work when someone shares a heartfelt story.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem'}}>
                {EMOTIONS.map(e => <button key={e} onClick={()=>toggleArr('emotions',e)} style={tagStyle(form.emotions.includes(e))}>{e}</button>)}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.75rem',marginBottom:'1rem'}}>
              <p style={{fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1rem'}}>Your maker story</p>
              <div style={{marginBottom:'1rem'}}>
                <label style={{fontSize:'13px',color:'#7A6A5A',display:'block',marginBottom:'5px'}}>About you & your craft</label>
                <textarea rows={5} style={{...inputStyle,resize:'vertical',lineHeight:1.6}} value={form.bio} onChange={e=>update('bio',e.target.value)} placeholder="I started making candles in my kitchen during lockdown as a way to cope with stress..."/>
                <p style={{fontSize:'11px',color:'#7A6A5A',marginTop:'4px'}}>This is what gift-buyers will read. Write from the heart — stories sell.</p>
              </div>
            </div>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.75rem'}}>
              <p style={{fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1rem'}}>Social links</p>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'8px',border:'1px solid #D9CDB8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',color:'#7A6A5A',flexShrink:0}}>IG</div>
                <input style={inputStyle} value={form.instagram} onChange={e=>update('instagram',e.target.value)} placeholder="https://instagram.com/yourhandle"/>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{background:'white',border:'1px solid #D9CDB8',borderRadius:'20px',padding:'1.5rem',marginBottom:'1rem'}}>
              <p style={{fontSize:'.7rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6A5A',marginBottom:'1.25rem'}}>Profile preview</p>
              <div style={{background:'#EDE6DA',borderRadius:'16px',padding:'1.5rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'1rem'}}>
                  <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#FFF3E0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond, serif',fontSize:'1.3rem',color:'#3D2B1F'}}>
                    {(form.fname[0]||'S').toUpperCase()}{(form.lname[0]||'P').toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:'1.2rem',color:'#3D2B1F'}}>{form.fname||'Sneha'} {form.lname||'Patel'}</div>
                    <div style={{fontSize:'.78rem',color:'#7A6A5A'}}>{form.shop||"Sneha's Nook"} · {form.city||'Jaipur'}</div>
                  </div>
                </div>
                <p style={{fontSize:'.85rem',color:'#7A6A5A',marginBottom:'1rem',lineHeight:1.6}}>{form.tagline||'Hand-poured soy candles with love from Rajasthan'}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
                  {(form.crafts.length ? form.crafts : ['Candles']).slice(0,4).map(t => (
                    <span key={t} style={{fontSize:'.7rem',padding:'.22rem .7rem',borderRadius:'2rem',background:'rgba(181,98,42,.08)',border:'1px solid rgba(181,98,42,.2)',color:'#B5622A'}}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            {submitError && (
              <div style={{background:'#FEF3EE',border:'1px solid rgba(181,98,42,.3)',borderRadius:'12px',padding:'1rem 1.2rem',marginBottom:'1rem',fontSize:'.85rem',color:'#B5622A'}}>
                {submitError}
              </div>
            )}
          </div>
        )}

        <div style={{display:'flex',justifyContent:'space-between',marginTop:'1.5rem'}}>
          <button onClick={() => setStep(s => Math.max(0,s-1))} style={{padding:'.7rem 1.6rem',border:'1px solid #D9CDB8',borderRadius:'2rem',background:'white',color:'#3D2B1F',cursor: step===0 ? 'not-allowed' : 'pointer',opacity: step===0 ? 0.4 : 1,fontFamily:'DM Sans, sans-serif',fontSize:'.85rem'}} disabled={step===0}>
            ← Back
          </button>
          {step < 3
            ? <button onClick={() => setStep(s => s+1)} style={{padding:'.7rem 1.8rem',background:'#B5622A',color:'white',border:'none',borderRadius:'2rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif',fontSize:'.85rem',fontWeight:500}}>
                Next →
              </button>
            : <button onClick={handleSubmit} disabled={submitting} style={{padding:'.7rem 1.8rem',background: submitting ? '#C4A882' : '#B5622A',color:'white',border:'none',borderRadius:'2rem',cursor: submitting ? 'not-allowed' : 'pointer',fontFamily:'DM Sans, sans-serif',fontSize:'.85rem',fontWeight:500}}>
                {submitting ? 'Submitting...' : 'Submit profile →'}
              </button>
          }
        </div>
      </div>
    </div>
  )
}