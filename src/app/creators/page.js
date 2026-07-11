'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Creators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetchCreators()
  }, [])

  async function fetchCreators() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/creators')
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setCreators(data.creators || [])
      }
    } catch (e) {
      setError('Could not load creators right now.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = creators.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.shop_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.craft_tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
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
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#5E4E3A', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/find-gift" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#5E4E3A', textDecoration: 'none' }}>Find a gift (AI)</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#A8501F', textDecoration: 'none', fontWeight: 500 }}>Creators</Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#241809', color: '#F6F1E9', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none' }}>Join as creator</Link>
        </div>
        <button
          className="gs-nav-burger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{ display: 'none', width: '40px', height: '40px', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
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
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#BE9A66', marginBottom: '1rem' }}>The makers behind every gift</p>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.2rem,5vw,4.5rem)', fontWeight: 400, color: '#F6F1E9', lineHeight: 1.1, marginBottom: '1rem' }}>
          Real hands.<br /><em style={{ fontStyle: 'italic', color: '#C06B4F' }}>Real stories.</em>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(246,241,233,.5)', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.8 }}>
          Every creator on GiftSoul makes by hand, in their home, with intention. Browse their work and connect directly.
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, city, or craft..."
          style={{ width: '100%', maxWidth: '480px', border: '1px solid rgba(255,255,255,.15)', borderRadius: '2rem', padding: '.75rem 1.5rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'rgba(255,255,255,.08)', color: '#F6F1E9', outline: 'none' }}
        />
      </div>

      {/* STATS */}
      <div className="gs-stats" style={{ background: '#ECE2D0', borderBottom: '1px solid #D6C2A0', padding: '1.2rem 5rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        {[[`${creators.length}+`, 'verified creators'], ['18', 'states represented'], ['4.9★', 'average rating'], ['2,400+', 'gifts sold']].map(([val, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <strong style={{ fontSize: '.88rem', color: '#241809' }}>{val}</strong>
            <span style={{ fontSize: '.82rem', color: '#5E4E3A' }}>{label}</span>
          </div>
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
          <p style={{ fontSize: '.85rem', color: '#5E4E3A', marginBottom: '2rem' }}>Showing {filtered.length} creator{filtered.length !== 1 ? 's' : ''}</p>
        )}

        {loading && (
          <div className="gs-creators-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.8rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', height: '190px', animation: 'gsPulse 1.4s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#5E4E3A' }}>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem' }}>No creators match your search yet.</p>
            <p style={{ fontSize: '.85rem' }}>Try a different name, city, or craft.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="gs-creators-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.8rem' }}>
            {filtered.map((c, i) => (
              <Link
                key={c.id || i}
                href="/creator-profile"
                style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', padding: '1.6rem', textDecoration: 'none', display: 'block', transition: 'all .25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(36,24,9,.10)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {c.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photo_url} alt={c.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EFE1CC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', color: '#241809', flexShrink: 0 }}>
                      {(c.name || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.15rem', color: '#241809', marginBottom: '.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize: '.7rem', color: '#5E4E3A' }}>{c.city}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '.8rem', color: '#A8501F', fontWeight: 500 }}>★ 4.9</div>
                  </div>
                </div>
                <div style={{ fontSize: '.78rem', color: '#5E4E3A', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #ECE2D0' }}>
                  <strong style={{ color: '#241809', fontWeight: 500 }}>{c.shop_name || (c.craft_tags || [])[0] || 'Handmade gifts'}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                  {(c.emotion_tags || []).slice(0, 3).map(em => (
                    <span key={em} style={{ fontSize: '.68rem', padding: '.22rem .7rem', borderRadius: '2rem', background: 'rgba(168,80,31,.07)', border: '1px solid rgba(168,80,31,.2)', color: '#A8501F' }}>{em}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* JOIN CTA */}
      <div className="gs-cta-section" style={{ background: '#A8501F', padding: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem,4vw,3.5rem)', fontWeight: 400, color: 'white', marginBottom: '1rem' }}>
          Are you a maker?<br /><em style={{ color: 'rgba(255,255,255,.65)' }}>Join GiftSoul today</em>
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.75)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Connect with gift-seekers who value handmade and meaningful. Set up your profile in minutes.
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
          .gs-stats { padding: 1.2rem 1.5rem !important; gap: 1.5rem !important; }
          .gs-grid-section { padding: 2rem 1.5rem 3rem !important; }
          .gs-cta-section { padding: 3rem 1.5rem !important; }
          footer { padding: 3rem 1.5rem 2rem !important; }
        }

        @media (max-width: 520px) {
          .gs-creators-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}