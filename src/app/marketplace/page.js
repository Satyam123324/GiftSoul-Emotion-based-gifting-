'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const EMOTIONS = ['all', 'love', 'gratitude', 'celebration', 'comfort', 'self-care']

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [emotion, setEmotion] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotion])

  async function fetchProducts() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/products?emotion=${emotion}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data.products || [])
      }
    } catch (e) {
      setError('Could not load gifts right now.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.creators?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.creators?.shop_name || '').toLowerCase().includes(search.toLowerCase())
  )

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
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#A8501F', textDecoration: 'none', fontWeight: 500 }}>Browse gifts</Link>
          <Link href="/find-gift" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#5E4E3A', textDecoration: 'none' }}>Find a gift (AI)</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#5E4E3A', textDecoration: 'none' }}>Creators</Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#241809', color: '#F6F1E9', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none' }}>Join as creator</Link>
        </div>
        <button className="gs-nav-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ display: 'none', width: '40px', height: '40px', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span style={{ width: '22px', height: '2px', background: '#241809' }} />
          <span style={{ width: '22px', height: '2px', background: '#241809' }} />
          <span style={{ width: '16px', height: '2px', background: '#241809', alignSelf: 'flex-end' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(36,24,9,.45)', zIndex: 700, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity .3s ease' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: '340px', background: '#F6F1E9', zIndex: 800, padding: '1.5rem', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .35s cubic-bezier(.32,.72,0,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', color: '#241809' }}>Gift<em style={{ fontStyle: 'italic', color: '#A8501F' }}>Soul</em></span>
          <button onClick={() => setMenuOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #D6C2A0', background: 'white', cursor: 'pointer' }}>✕</button>
        </div>
        {[['Browse gifts', '/marketplace'], ['Find a gift (AI)', '/find-gift'], ['Creators', '/creators']].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '1rem .25rem', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#241809', textDecoration: 'none', borderBottom: '1px solid #ECE2D0' }}>{label}</Link>
        ))}
        <Link href="/creator-register" onClick={() => setMenuOpen(false)} style={{ marginTop: 'auto', padding: '.9rem 1.4rem', background: '#A8501F', color: 'white', borderRadius: '2rem', fontSize: '.85rem', textAlign: 'center', textDecoration: 'none' }}>Join as creator</Link>
      </div>

      {/* HERO */}
      <div className="gs-hero-section" style={{ background: '#241809', padding: 'calc(70px + 3rem) 5rem 3rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#BE9A66', marginBottom: '1rem' }}>Handmade, with heart</p>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.2rem,5vw,4.5rem)', fontWeight: 400, color: '#F6F1E9', lineHeight: 1.1, marginBottom: '1rem' }}>
          Gifts that carry<br /><em style={{ fontStyle: 'italic', color: '#C06B4F' }}>real meaning.</em>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(246,241,233,.5)', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.8 }}>
          Every piece here is made by hand by an independent creator. Browse by feeling, or search for something specific.
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by gift, category, or creator..."
          style={{ width: '100%', maxWidth: '480px', border: '1px solid rgba(255,255,255,.15)', borderRadius: '2rem', padding: '.75rem 1.5rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'rgba(255,255,255,.08)', color: '#F6F1E9', outline: 'none' }}
        />
      </div>

      {/* EMOTION FILTER */}
      <div className="gs-filter-bar" style={{ background: '#ECE2D0', borderBottom: '1px solid #D6C2A0', padding: '1rem 5rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
        {EMOTIONS.map(em => (
          <button
            key={em}
            onClick={() => setEmotion(em)}
            style={{
              padding: '.45rem 1.1rem', borderRadius: '2rem', fontSize: '.78rem', textTransform: 'capitalize',
              border: emotion === em ? '1px solid #A8501F' : '1px solid #D6C2A0',
              background: emotion === em ? '#A8501F' : 'white',
              color: emotion === em ? 'white' : '#5E4E3A',
              cursor: 'pointer', transition: 'all .2s ease'
            }}
          >
            {em}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="gs-grid-section" style={{ padding: '3rem 5rem 5rem' }}>
        {error && (
          <div style={{ background: '#FEF3EE', border: '1px solid rgba(168,80,31,.3)', borderRadius: '12px', padding: '1rem 1.2rem', fontSize: '.88rem', color: '#A8501F', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <p style={{ fontSize: '.85rem', color: '#5E4E3A', marginBottom: '2rem' }}>Showing {filtered.length} gift{filtered.length !== 1 ? 's' : ''}</p>
        )}

        {loading && (
          <div className="gs-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.8rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', height: '320px', animation: 'gsPulse 1.4s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#5E4E3A' }}>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem' }}>No gifts match yet.</p>
            <p style={{ fontSize: '.85rem' }}>Try a different search or feeling.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="gs-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.8rem' }}>
            {filtered.map((p, i) => (
              <Link key={p.id || i} href={`/product/${p.id}`}
                style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all .25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(36,24,9,.10)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: '100%', aspectRatio: '1', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🎁'}
                </div>
                <div style={{ padding: '1.1rem 1.2rem' }}>
                  <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.05rem', color: '#241809', marginBottom: '.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '.72rem', color: '#5E4E3A', marginBottom: '.7rem' }}>by {p.creators?.name || p.creators?.shop_name || 'GiftSoul creator'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 500, color: '#241809' }}>₹{p.base_price}</span>
                    <span style={{ fontSize: '.68rem', color: '#BE9A66' }}>{p.lead_time_days || 5}d lead time</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* JOIN CTA */}
      <div className="gs-cta-section" style={{ background: '#A8501F', padding: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem,4vw,3.5rem)', fontWeight: 400, color: 'white', marginBottom: '1rem' }}>
          Making something?<br /><em style={{ color: 'rgba(255,255,255,.65)' }}>Sell it on GiftSoul.</em>
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.75)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Join creators across India selling handmade, meaningful gifts directly to buyers.
        </p>
        <Link href="/creator-register" style={{ display: 'inline-block', padding: '.85rem 2.5rem', border: '1px solid rgba(255,255,255,.4)', borderRadius: '2rem', color: 'white', textDecoration: 'none', fontSize: '.85rem' }}>
          Create your profile →
        </Link>
      </div>

      <footer style={{ background: '#241809', padding: '3rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#F6F1E9' }}>Gift<em style={{ fontStyle: 'italic', color: '#C06B4F' }}>Soul</em></div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Marketplace', '/marketplace'], ['Creators', '/creators'], ['Join', '/creator-register']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: '.82rem', color: 'rgba(246,241,233,.45)', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: '.75rem', color: 'rgba(246,241,233,.28)' }}>© 2026 GiftSoul. Made with love in India.</div>
      </footer>

      <style>{`
        @keyframes gsPulse { 0%,100% { opacity: .5; } 50% { opacity: .8; } }

        @media (max-width: 900px) {
          .gs-nav { padding: 0 1.25rem !important; }
          .gs-nav-links { display: none !important; }
          .gs-nav-burger { display: flex !important; }
          .gs-hero-section { padding: calc(70px + 2rem) 1.5rem 2rem !important; }
          .gs-filter-bar { padding: 1rem 1.5rem !important; }
          .gs-grid-section { padding: 2rem 1.5rem 3rem !important; }
          .gs-cta-section { padding: 3rem 1.5rem !important; }
          footer { padding: 3rem 1.5rem 2rem !important; }
        }

        @media (max-width: 520px) {
          .gs-products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
