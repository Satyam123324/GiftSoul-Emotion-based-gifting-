'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Corporate() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', quantity: '', occasion: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.quantity) {
      setError('Please add your name, email, and approximate quantity.')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: null,
          creator_id: null,
          buyer_name: form.name,
          buyer_email: form.email,
          buyer_phone: form.phone,
          message: `[Corporate/Bulk enquiry] Company: ${form.company || 'N/A'} · Occasion: ${form.occasion || 'N/A'} · Notes: ${form.message || 'None'}`,
          quantity: parseInt(form.quantity, 10) || 1,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSent(true)
      }
    } catch (e) {
      setError('Could not send your enquiry right now, please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px', zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem',
        background: '#FBF7F2', boxShadow: '0 1px 0 #E4D3BE',
      }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.65rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/faq" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Help</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#2B2019', padding: 'calc(70px + 4rem) 5rem 4rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem' }}>For teams &amp; businesses</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', fontWeight: 300, color: '#FBF7F2', lineHeight: 1.15, marginBottom: '1.2rem', maxWidth: '700px' }}>
          Corporate gifting that feels <em style={{ fontStyle: 'italic', color: '#C97B63' }}>personal</em>, not procured.
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(251,247,242,.6)', maxWidth: '520px', lineHeight: 1.8 }}>
          Handmade gifts for employee milestones, client thank-yous, festive hampers, and bulk events — sourced from real creators across India, at volume.
        </p>
      </div>

      {/* WHY CORPORATE */}
      <div style={{ padding: '5rem 5rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        {[
          { icon: '📦', title: 'Bulk-ready', desc: 'From 10 to 1,000+ units, with volume pricing from our creator network.' },
          { icon: '🎨', title: 'Brandable', desc: 'Add your logo, a custom note, or co-branded packaging on request.' },
          { icon: '🗓️', title: 'On schedule', desc: 'Dedicated coordination for events, appraisals, and festive deadlines.' },
          { icon: '🤝', title: 'One point of contact', desc: 'We coordinate with creators for you — one enquiry, one invoice.' },
        ].map(f => (
          <div key={f.title} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '18px', padding: '1.6rem' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '.7rem' }}>{f.icon}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', color: '#2B2019', marginBottom: '.4rem' }}>{f.title}</div>
            <p style={{ fontSize: '.85rem', color: '#7C6B60', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* USE CASES */}
      <div style={{ padding: '2rem 5rem 4rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 400, color: '#2B2019', marginBottom: '1.2rem' }}>Popular for</h2>
        <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
          {['Employee onboarding kits', 'Diwali & festive hampers', 'Client thank-you gifts', 'Work anniversaries', 'Team offsites', 'Conference swag'].map(u => (
            <span key={u} style={{ padding: '.6rem 1.3rem', borderRadius: '2rem', border: '1px solid #E4D3BE', background: '#F3E8DC', color: '#2B2019', fontSize: '.85rem' }}>{u}</span>
          ))}
        </div>
      </div>

      {/* LEAD FORM */}
      <div style={{ padding: '2rem 5rem 6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, color: '#2B2019', marginBottom: '1rem' }}>
            Tell us about your order
          </h2>
          <p style={{ fontSize: '.9rem', color: '#7C6B60', lineHeight: 1.8 }}>
            Share a few details and our team will get back to you within a business day with creators, pricing, and timelines that fit your event.
          </p>
        </div>

        <div>
          {sent ? (
            <div style={{ background: '#EAF3E1', border: '1px solid rgba(74,107,60,.3)', borderRadius: '18px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '.8rem' }}>✓</div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2B2019', marginBottom: '.4rem' }}>Thank you!</p>
              <p style={{ fontSize: '.88rem', color: '#7C6B60' }}>We&apos;ve received your enquiry and will reach out shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '18px', padding: '1.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company (optional)" style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="Work email" style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone (optional)" style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
                <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} type="number" min="1" placeholder="Approx. quantity" style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
                <input value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))} placeholder="Occasion (e.g. Diwali)" style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
              </div>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Anything else we should know? (budget range, branding needs, deadline...)"
                rows={3}
                style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', resize: 'none', marginBottom: '1rem', fontFamily: 'inherit' }}
              />
              {error && <div style={{ fontSize: '.8rem', color: '#B5533C', marginBottom: '.8rem' }}>{error}</div>}
              <button
                type="submit"
                disabled={sending}
                style={{ width: '100%', padding: '.8rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.9rem', fontWeight: 500, cursor: 'pointer', opacity: sending ? .7 : 1 }}
              >
                {sending ? 'Sending...' : 'Request a quote'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
