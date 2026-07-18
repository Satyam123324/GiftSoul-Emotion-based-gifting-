'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'

export default function ProductDetail({ params }) {
  const { id } = use(params)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('about')
  const [saved, setSaved] = useState(false)
  const [note, setNote] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchProduct() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setProduct(data.product || null)
      }
    } catch (e) {
      setError('Could not load this gift right now.')
    } finally {
      setLoading(false)
    }
  }

  async function sendEnquiry() {
    if (!buyerName || !buyerEmail) {
      setSendError('Please add your name and email so the creator can reach you.')
      return
    }
    setSending(true)
    setSendError('')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          creator_id: product.creator_id,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone,
          message: `Enquiry about ${product.name}`,
          personalisation_note: note,
          quantity: qty,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setSendError(data.error)
      } else {
        setSent(true)
      }
    } catch (e) {
      setSendError('Could not send your enquiry right now, please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E9' }}>

      {/* NAV */}
      <nav className="gs-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', zIndex: 600,
        background: 'rgba(246,241,233,.95)', backdropFilter: 'blur(16px)', boxShadow: '0 1px 0 #D6C2A0'
      }}>
        <Link href="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.65rem', fontWeight: 400, color: '#241809', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#A8501F' }}>Soul</em>
        </Link>
        <div className="gs-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#5E4E3A', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#5E4E3A', textDecoration: 'none' }}>Creators</Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#241809', color: '#F6F1E9', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none' }}>Join as creator</Link>
        </div>
        <button className="gs-nav-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ display: 'none', width: '40px', height: '40px', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span style={{ width: '22px', height: '2px', background: '#241809' }} />
          <span style={{ width: '22px', height: '2px', background: '#241809' }} />
          <span style={{ width: '16px', height: '2px', background: '#241809', alignSelf: 'flex-end' }} />
        </button>
      </nav>

      <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(36,24,9,.45)', zIndex: 700, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity .3s ease' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: '340px', background: '#F6F1E9', zIndex: 800, padding: '1.5rem', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .35s cubic-bezier(.32,.72,0,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', color: '#241809' }}>Gift<em style={{ fontStyle: 'italic', color: '#A8501F' }}>Soul</em></span>
          <button onClick={() => setMenuOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #D6C2A0', background: 'white', cursor: 'pointer' }}>✕</button>
        </div>
        {[['Browse gifts', '/marketplace'], ['Creators', '/creators']].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '1rem .25rem', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#241809', textDecoration: 'none', borderBottom: '1px solid #ECE2D0' }}>{label}</Link>
        ))}
        <Link href="/creator-register" onClick={() => setMenuOpen(false)} style={{ marginTop: 'auto', padding: '.9rem 1.4rem', background: '#A8501F', color: 'white', borderRadius: '2rem', fontSize: '.85rem', textAlign: 'center', textDecoration: 'none' }}>Join as creator</Link>
      </div>

      {loading && (
        <div style={{ padding: '150px 5rem 5rem', color: '#5E4E3A', fontSize: '.9rem' }}>Loading gift...</div>
      )}

      {!loading && error && (
        <div style={{ padding: '150px 5rem 5rem' }}>
          <div style={{ background: '#FEF3EE', border: '1px solid rgba(168,80,31,.3)', borderRadius: '12px', padding: '1.2rem', fontSize: '.9rem', color: '#A8501F' }}>
            {error}
          </div>
        </div>
      )}

      {!loading && !error && product && (
        <>
          {/* BREADCRUMB */}
          <div className="gs-breadcrumb" style={{ padding: '90px 5rem 0', fontSize: '.72rem', color: '#5E4E3A' }}>
            <Link href="/" style={{ color: '#A8501F', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <Link href="/marketplace" style={{ color: '#A8501F', textDecoration: 'none' }}>Marketplace</Link>
            {' / '}
            {product.name}
          </div>

          {/* MAIN LAYOUT */}
          <div className="gs-product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', padding: '2rem 5rem 5rem', maxWidth: '1300px', margin: '0 auto' }}>

            {/* GALLERY */}
            <div className="gs-gallery" style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
              <div style={{ width: '100%', aspectRatio: '1', background: '#FFF3E0', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px', border: '1px solid #D6C2A0', overflow: 'hidden' }}>
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🎁'}
              </div>
            </div>

            {/* INFO */}
            <div>
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {(product.emotion_tags || []).map(b => (
                  <span key={b} style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '.28rem .8rem', borderRadius: '2rem', background: 'rgba(168,80,31,.08)', border: '1px solid rgba(168,80,31,.3)', color: '#A8501F' }}>{b}</span>
                ))}
              </div>

              <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.7rem,3vw,2.6rem)', fontWeight: 400, lineHeight: 1.15, color: '#241809', marginBottom: '.8rem' }}>
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '.8rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 500, color: '#241809' }}>₹{product.base_price}</span>
              </div>

              <div style={{ height: '1px', background: '#D6C2A0', margin: '1.5rem 0' }} />

              <div style={{ background: '#ECE2D0', border: '1px solid #D6C2A0', borderRadius: '20px', padding: '1.4rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D6C2A0', borderRadius: '2rem', overflow: 'hidden', background: 'white' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: '#241809' }}>−</button>
                    <span style={{ width: '36px', textAlign: 'center', fontSize: '.9rem', color: '#241809' }}>{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: '#241809' }}>+</button>
                  </div>
                  <div style={{ fontSize: '.78rem', color: '#5E4E3A' }}>Ready in <strong style={{ color: '#241809' }}>{product.lead_time_days || 5} working days</strong></div>
                </div>

                {!sent && (
                  <>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Add a personalisation note..."
                      rows={3}
                      style={{ width: '100%', border: '1px solid #D6C2A0', borderRadius: '12px', padding: '.7rem 1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', color: '#241809', background: 'white', resize: 'none', outline: 'none', marginBottom: '.8rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginBottom: '.8rem' }}>
                      <input
                        value={buyerName}
                        onChange={e => setBuyerName(e.target.value)}
                        placeholder="Your name"
                        style={{ border: '1px solid #D6C2A0', borderRadius: '12px', padding: '.6rem .9rem', fontSize: '.85rem', outline: 'none' }}
                      />
                      <input
                        value={buyerEmail}
                        onChange={e => setBuyerEmail(e.target.value)}
                        placeholder="Your email"
                        type="email"
                        style={{ border: '1px solid #D6C2A0', borderRadius: '12px', padding: '.6rem .9rem', fontSize: '.85rem', outline: 'none' }}
                      />
                    </div>
                    <input
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      placeholder="Your phone (optional)"
                      style={{ width: '100%', border: '1px solid #D6C2A0', borderRadius: '12px', padding: '.6rem .9rem', fontSize: '.85rem', outline: 'none', marginBottom: '1rem' }}
                    />
                    {sendError && (
                      <div style={{ fontSize: '.8rem', color: '#A8501F', marginBottom: '.8rem' }}>{sendError}</div>
                    )}
                  </>
                )}

                <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                  <button onClick={sendEnquiry} disabled={sending || sent} style={{ flex: 1, minWidth: '160px', padding: '.75rem', background: '#A8501F', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.85rem', cursor: sent ? 'default' : 'pointer', fontWeight: 500, opacity: sending ? .7 : 1 }}>
                    {sent ? '✓ Enquiry sent!' : sending ? 'Sending...' : 'Send enquiry to creator'}
                  </button>
                  <button onClick={() => setSaved(!saved)} style={{ padding: '.75rem 1.2rem', border: '1px solid #D6C2A0', borderRadius: '2rem', background: 'white', cursor: 'pointer', fontSize: '.85rem', color: saved ? '#A8501F' : '#5E4E3A' }}>
                    {saved ? '♥ Saved' : '♡ Save'}
                  </button>
                </div>
              </div>

              {product.creators && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', border: '1px solid #D6C2A0', borderRadius: '20px', background: 'white', marginBottom: '1.5rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#241809', flexShrink: 0 }}>
                    {(product.creators.name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.1rem', color: '#241809' }}>{product.creators.name || product.creators.shop_name}</div>
                    <div style={{ fontSize: '.72rem', color: '#5E4E3A' }}>{product.creators.city}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', borderBottom: '1px solid #D6C2A0', marginBottom: '1.5rem', overflowX: 'auto' }}>
                {[['about', 'About'], ['specs', 'Details'], ['reviews', 'Reviews']].map(([tid, label]) => (
                  <button key={tid} onClick={() => setActiveTab(tid)} style={{ padding: '.7rem 1.4rem', fontSize: '.82rem', color: activeTab === tid ? '#A8501F' : '#5E4E3A', border: 'none', borderBottom: activeTab === tid ? '2px solid #A8501F' : '2px solid transparent', background: 'transparent', cursor: 'pointer', marginBottom: '-1px', whiteSpace: 'nowrap' }}>
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'about' && (
                <p style={{ fontSize: '.9rem', color: '#5E4E3A', lineHeight: 1.8 }}>
                  {product.description || 'This creator hasn\u2019t added a description yet.'}
                </p>
              )}
              {activeTab === 'specs' && (
                <table style={{ width: '100%', fontSize: '.85rem' }}>
                  <tbody>
                    {[
                      ['Category', product.category || '—'],
                      ['Lead time', `${product.lead_time_days || 5} days`],
                      ['Type', product.product_type || 'handmade'],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ padding: '.55rem 0', borderBottom: '1px solid #ECE2D0', color: '#241809', fontWeight: 500, width: '40%' }}>{k}</td>
                        <td style={{ padding: '.55rem 0', borderBottom: '1px solid #ECE2D0', color: '#5E4E3A' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'reviews' && (
                <p style={{ fontSize: '.9rem', color: '#5E4E3A' }}>No reviews yet — be the first to buy this gift!</p>
              )}
            </div>
          </div>
        </>
      )}

      <footer style={{ background: '#241809', padding: '4rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#F6F1E9' }}>Gift<em style={{ fontStyle: 'italic', color: '#C06B4F' }}>Soul</em></div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Marketplace', '/marketplace'], ['Creators', '/creators']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: '.85rem', color: 'rgba(246,241,233,.45)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: '.75rem', color: 'rgba(246,241,233,.28)' }}>© 2026 GiftSoul.</div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .gs-nav { padding: 0 1.25rem !important; }
          .gs-nav-links { display: none !important; }
          .gs-nav-burger { display: flex !important; }
          .gs-breadcrumb { padding: 90px 1.5rem 0 !important; }
          .gs-product-layout { grid-template-columns: 1fr !important; padding: 1.5rem !important; gap: 1.5rem !important; }
          .gs-gallery { position: static !important; }
          footer { padding: 3rem 1.5rem 2rem !important; }
        }
      `}</style>
    </div>
  )
}
