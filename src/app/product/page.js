'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Product() {
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('about')
  const [saved, setSaved] = useState(false)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>

      {/* NAV */}
      <nav className="gs-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', zIndex: 600,
        background: 'rgba(251,247,242,.95)', backdropFilter: 'blur(16px)', boxShadow: '0 1px 0 #F3E8DC'
      }}>
        <Link href="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.65rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
        </Link>
        <div className="gs-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Creators</Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#2B2019', color: '#FBF7F2', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none' }}>Join as creator</Link>
        </div>
        <button className="gs-nav-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ display: 'none', width: '40px', height: '40px', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span style={{ width: '22px', height: '2px', background: '#2B2019' }} />
          <span style={{ width: '22px', height: '2px', background: '#2B2019' }} />
          <span style={{ width: '16px', height: '2px', background: '#2B2019', alignSelf: 'flex-end' }} />
        </button>
      </nav>

      <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(43,32,25,.45)', zIndex: 700, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity .3s ease' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: '340px', background: '#FBF7F2', zIndex: 800, padding: '1.5rem', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .35s cubic-bezier(.32,.72,0,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', color: '#2B2019' }}>Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em></span>
          <button onClick={() => setMenuOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E4D3BE', background: 'white', cursor: 'pointer' }}>✕</button>
        </div>
        {[['Browse gifts', '/marketplace'], ['Creators', '/creators']].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '1rem .25rem', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#2B2019', textDecoration: 'none', borderBottom: '1px solid #E4D3BE' }}>{label}</Link>
        ))}
        <Link href="/creator-register" onClick={() => setMenuOpen(false)} style={{ marginTop: 'auto', padding: '.9rem 1.4rem', background: '#B5533C', color: 'white', borderRadius: '2rem', fontSize: '.85rem', textAlign: 'center', textDecoration: 'none' }}>Join as creator</Link>
      </div>

      {/* BREADCRUMB */}
      <div className="gs-breadcrumb" style={{ padding: '90px 5rem 0', fontSize: '.72rem', color: '#7C6B60' }}>
        <Link href="/" style={{ color: '#B5533C', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href="/marketplace" style={{ color: '#B5533C', textDecoration: 'none' }}>Marketplace</Link>
        {' / '}
        Lavender soy candle
      </div>

      {/* MAIN LAYOUT */}
      <div className="gs-product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', padding: '2rem 5rem 5rem', maxWidth: '1300px', margin: '0 auto' }}>

        {/* GALLERY */}
        <div className="gs-gallery" style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
          <div style={{ width: '100%', aspectRatio: '1', background: '#F3E8DC', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px', border: '1px solid #E4D3BE' }}>
            🕯️
          </div>
        </div>

        {/* INFO */}
        <div>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['Celebration', 'Self-care', 'Love'].map(b => (
              <span key={b} style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '.28rem .8rem', borderRadius: '2rem', background: 'rgba(181,83,60,.08)', border: '1px solid rgba(181,83,60,.3)', color: '#B5533C' }}>{b}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.7rem,3vw,2.6rem)', fontWeight: 400, lineHeight: 1.15, color: '#2B2019', marginBottom: '.8rem' }}>
            Hand-poured lavender soy candle
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 500, color: '#2B2019' }}>₹480</span>
          </div>

          <div style={{ height: '1px', background: '#F3E8DC', margin: '1.5rem 0' }} />

          <div style={{ background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.4rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E4D3BE', borderRadius: '2rem', overflow: 'hidden', background: 'white' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: '#2B2019' }}>−</button>
                <span style={{ width: '36px', textAlign: 'center', fontSize: '.9rem', color: '#2B2019' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: '#2B2019' }}>+</button>
              </div>
              <div style={{ fontSize: '.78rem', color: '#7C6B60' }}>Ready in <strong style={{ color: '#2B2019' }}>5 working days</strong></div>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a personalisation note..."
              rows={3}
              style={{ width: '100%', border: '1px solid #E4D3BE', borderRadius: '12px', padding: '.7rem 1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', color: '#2B2019', background: 'white', resize: 'none', outline: 'none', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
              <button onClick={() => setSent(true)} style={{ flex: 1, minWidth: '160px', padding: '.75rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.85rem', cursor: 'pointer', fontWeight: 500 }}>
                {sent ? '✓ Enquiry sent!' : 'Send enquiry to creator'}
              </button>
              <button onClick={() => setSaved(!saved)} style={{ padding: '.75rem 1.2rem', border: '1px solid #E4D3BE', borderRadius: '2rem', background: 'white', cursor: 'pointer', fontSize: '.85rem', color: saved ? '#B5533C' : '#7C6B60' }}>
                {saved ? '♥ Saved' : '♡ Save'}
              </button>
            </div>
          </div>

          <Link href="/creator-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', border: '1px solid #E4D3BE', borderRadius: '20px', background: 'white', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#2B2019', flexShrink: 0 }}>S</div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.1rem', color: '#2B2019' }}>Sneha Patel</div>
              <div style={{ fontSize: '.72rem', color: '#7C6B60' }}>Jaipur, Rajasthan · 48 sales</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#C99A54', fontSize: '1.1rem' }}>→</span>
          </Link>

          <div style={{ display: 'flex', borderBottom: '1px solid #E4D3BE', marginBottom: '1.5rem', overflowX: 'auto' }}>
            {[['about', 'About'], ['specs', 'Details'], ['reviews', 'Reviews']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '.7rem 1.4rem', fontSize: '.82rem', color: activeTab === id ? '#B5533C' : '#7C6B60', border: 'none', borderBottom: activeTab === id ? '2px solid #B5533C' : '2px solid transparent', background: 'transparent', cursor: 'pointer', marginBottom: '-1px', whiteSpace: 'nowrap' }}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'about' && (
            <p style={{ fontSize: '.9rem', color: '#7C6B60', lineHeight: 1.8 }}>
              Each candle is hand-poured in small batches in Sneha&apos;s kitchen in Jaipur, using 100% natural soy wax and essential oils. Burns 40–50 hours.
            </p>
          )}
          {activeTab === 'specs' && (
            <table style={{ width: '100%', fontSize: '.85rem' }}>
              <tbody>
                {[['Material', '100% soy wax'], ['Burn time', '40–50 hours'], ['Dimensions', '7cm × 9cm']].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: '.55rem 0', borderBottom: '1px solid #E4D3BE', color: '#2B2019', fontWeight: 500, width: '40%' }}>{k}</td>
                    <td style={{ padding: '.55rem 0', borderBottom: '1px solid #E4D3BE', color: '#7C6B60' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <p style={{ fontSize: '.9rem', color: '#7C6B60' }}>★★★★★ 4.9 · 48 reviews</p>
          )}
        </div>
      </div>

      <footer style={{ background: '#2B2019', padding: '4rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#FBF7F2' }}>Gift<em style={{ fontStyle: 'italic', color: '#C99A54' }}>Soul</em></div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Marketplace', '/marketplace'], ['Creators', '/creators']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: '.85rem', color: 'rgba(251,247,242,.45)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: '.75rem', color: 'rgba(251,247,242,.28)' }}>© 2026 GiftSoul.</div>
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