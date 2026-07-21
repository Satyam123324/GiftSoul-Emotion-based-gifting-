'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CATEGORIES, categoryLabel, RECIPIENTS } from '../lib/constants'
import { getWishlist, getRecentlyViewed } from '../lib/wishlist'

const EMOTIONS = ['all', 'love', 'gratitude', 'celebration', 'comfort', 'self-care']
const OCCASIONS = ['all', 'birthday', 'anniversary', 'wedding', 'babyshower', 'graduation', 'housewarming', 'diwali', 'rakhi', 'karva-chauth', 'eid', 'christmas', 'new-year']
const BUDGETS = [
  { label: 'Any budget', value: null },
  { label: 'Under ₹299', value: 299 },
  { label: 'Under ₹499', value: 499 },
  { label: 'Under ₹799', value: 799 },
  { label: 'Under ₹1499', value: 1499 },
]

function MarketplaceInner() {
  const searchParams = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [emotion, setEmotion] = useState('all')
  const [occasion, setOccasion] = useState('all')
  const [category, setCategory] = useState('all')
  const [recipient, setRecipient] = useState('all')
  const [maxPrice, setMaxPrice] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => {
    const refreshWishlistCount = () => setWishlistCount(getWishlist().length)
    refreshWishlistCount()
    setRecentlyViewed(getRecentlyViewed())
    window.addEventListener('giftsoul-wishlist-updated', refreshWishlistCount)
    return () => window.removeEventListener('giftsoul-wishlist-updated', refreshWishlistCount)
  }, [])

  // Pick up ?emotion=, ?occasion=, ?category=, ?recipient=, ?maxPrice= from links like the homepage quick-filters
  useEffect(() => {
    const em = searchParams.get('emotion')
    const oc = searchParams.get('occasion')
    const cat = searchParams.get('category')
    const rec = searchParams.get('recipient')
    const mp = searchParams.get('maxPrice')
    if (em) setEmotion(em)
    if (oc) setOccasion(oc)
    if (cat) setCategory(cat)
    if (rec) setRecipient(rec)
    if (mp) setMaxPrice(Number(mp))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const filtered = products.filter(p => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.creators?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.creators?.shop_name || '').toLowerCase().includes(search.toLowerCase())
    const matchesOccasion = occasion === 'all' || (p.occasion_tags || []).includes(occasion)
    const matchesCategory = category === 'all' || (p.category || '').toLowerCase() === categoryLabel(category).toLowerCase()
    const matchesRecipient = recipient === 'all' || (p.recipient_tags || []).includes(recipient)
    const matchesBudget = !maxPrice || (p.base_price || 0) <= maxPrice
    return matchesSearch && matchesOccasion && matchesCategory && matchesRecipient && matchesBudget
  })

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
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#B5533C', textDecoration: 'none', fontWeight: 500 }}>Browse gifts</Link>
          <Link href="/find-gift" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Find a gift (AI)</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Creators</Link>
          <Link href="/wishlist" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
            ♡ Saved{wishlistCount > 0 && <span style={{ background: '#B5533C', color: 'white', borderRadius: '999px', fontSize: '.65rem', padding: '.05rem .4rem', fontWeight: 600 }}>{wishlistCount}</span>}
          </Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#2B2019', color: '#FBF7F2', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none' }}>Join as creator</Link>
        </div>
        <button className="gs-nav-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ display: 'none', width: '40px', height: '40px', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span style={{ width: '22px', height: '2px', background: '#2B2019' }} />
          <span style={{ width: '22px', height: '2px', background: '#2B2019' }} />
          <span style={{ width: '16px', height: '2px', background: '#2B2019', alignSelf: 'flex-end' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(43,32,25,.45)', zIndex: 700, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity .3s ease' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: '340px', background: '#FBF7F2', zIndex: 800, padding: '1.5rem', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .35s cubic-bezier(.32,.72,0,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', color: '#2B2019' }}>Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em></span>
          <button onClick={() => setMenuOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E4D3BE', background: 'white', cursor: 'pointer' }}>✕</button>
        </div>
        {[['Browse gifts', '/marketplace'], ['Find a gift (AI)', '/find-gift'], ['Creators', '/creators']].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '1rem .25rem', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#2B2019', textDecoration: 'none', borderBottom: '1px solid #E4D3BE' }}>{label}</Link>
        ))}
        <Link href="/creator-register" onClick={() => setMenuOpen(false)} style={{ marginTop: 'auto', padding: '.9rem 1.4rem', background: '#B5533C', color: 'white', borderRadius: '2rem', fontSize: '.85rem', textAlign: 'center', textDecoration: 'none' }}>Join as creator</Link>
      </div>

      {/* HERO */}
      <div className="gs-hero-section" style={{ background: '#2B2019', padding: 'calc(70px + 3rem) 5rem 3rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem' }}>Handmade, with heart</p>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.2rem,5vw,4.5rem)', fontWeight: 400, color: '#FBF7F2', lineHeight: 1.1, marginBottom: '1rem' }}>
          Gifts that carry<br /><em style={{ fontStyle: 'italic', color: '#C99A54' }}>real meaning.</em>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(251,247,242,.5)', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.8 }}>
          Every piece here is made by hand by an independent creator. Browse by feeling, or search for something specific.
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by gift, category, or creator..."
          style={{ width: '100%', maxWidth: '480px', border: '1px solid rgba(255,255,255,.15)', borderRadius: '2rem', padding: '.75rem 1.5rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'rgba(255,255,255,.08)', color: '#FBF7F2', outline: 'none' }}
        />
      </div>

      {/* EMOTION FILTER */}
      <div className="gs-filter-bar" style={{ background: '#F3E8DC', borderBottom: '1px solid #E4D3BE', padding: '1rem 5rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
        {EMOTIONS.map(em => (
          <button
            key={em}
            onClick={() => setEmotion(em)}
            style={{
              padding: '.45rem 1.1rem', borderRadius: '2rem', fontSize: '.78rem', textTransform: 'capitalize',
              border: emotion === em ? '1px solid #B5533C' : '1px solid #E4D3BE',
              background: emotion === em ? '#B5533C' : 'white',
              color: emotion === em ? 'white' : '#7C6B60',
              cursor: 'pointer', transition: 'all .2s ease'
            }}
            onMouseEnter={e => { if (emotion !== em) { e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.color = '#B5533C' } }}
            onMouseLeave={e => { if (emotion !== em) { e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.color = '#7C6B60' } }}
          >
            {em}
          </button>
        ))}
      </div>

      {/* OCCASION + CATEGORY + BUDGET FILTERS */}
      <div className="gs-filter-bar-2" style={{ background: 'white', borderBottom: '1px solid #E4D3BE', padding: '1rem 5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.7rem', color: '#7C6B60', textTransform: 'uppercase', letterSpacing: '.08em', marginRight: '.3rem' }}>Category:</span>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ padding: '.4rem .8rem', borderRadius: '2rem', border: '1px solid #E4D3BE', background: '#FBF7F2', color: '#2B2019', fontSize: '.78rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.7rem', color: '#7C6B60', textTransform: 'uppercase', letterSpacing: '.08em', marginRight: '.3rem' }}>For:</span>
          <select
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            style={{ padding: '.4rem .8rem', borderRadius: '2rem', border: '1px solid #E4D3BE', background: '#FBF7F2', color: '#2B2019', fontSize: '.78rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Anyone</option>
            {RECIPIENTS.map(r => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.7rem', color: '#7C6B60', textTransform: 'uppercase', letterSpacing: '.08em', marginRight: '.3rem' }}>Occasion:</span>
          <select
            value={occasion}
            onChange={e => setOccasion(e.target.value)}
            style={{ padding: '.4rem .8rem', borderRadius: '2rem', border: '1px solid #E4D3BE', background: '#FBF7F2', color: '#2B2019', fontSize: '.78rem', textTransform: 'capitalize', cursor: 'pointer', outline: 'none' }}
          >
            {OCCASIONS.map(o => <option key={o} value={o}>{o === 'all' ? 'All occasions' : o}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.7rem', color: '#7C6B60', textTransform: 'uppercase', letterSpacing: '.08em', marginRight: '.3rem' }}>Budget:</span>
          {BUDGETS.map(b => (
            <button
              key={b.label}
              onClick={() => setMaxPrice(b.value)}
              style={{
                padding: '.4rem 1rem', borderRadius: '2rem', fontSize: '.76rem',
                border: maxPrice === b.value ? '1px solid #B5533C' : '1px solid #E4D3BE',
                background: maxPrice === b.value ? '#B5533C' : '#FBF7F2',
                color: maxPrice === b.value ? 'white' : '#7C6B60',
                cursor: 'pointer', transition: 'all .2s ease'
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <div style={{ padding: '2rem 5rem 0' }}>
          <h3 style={{ fontSize: '.85rem', letterSpacing: '.06em', textTransform: 'uppercase', color: '#7C6B60', marginBottom: '1rem' }}>Recently viewed</h3>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '.5rem' }}>
            {recentlyViewed.map(p => (
              <Link key={p.id} href={`/product/${p.id}`}
                style={{ flex: '0 0 auto', width: '160px', background: 'white', border: '1px solid #E4D3BE', borderRadius: '14px', overflow: 'hidden', textDecoration: 'none' }}>
                <div style={{ width: '100%', aspectRatio: '1', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🎁'}
                </div>
                <div style={{ padding: '.6rem .8rem' }}>
                  <div style={{ fontSize: '.78rem', color: '#2B2019', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '.8rem', color: '#B5533C', marginTop: '.15rem' }}>₹{p.base_price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="gs-grid-section" style={{ padding: '3rem 5rem 5rem' }}>
        {error && (
          <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '12px', padding: '1rem 1.2rem', fontSize: '.88rem', color: '#B5533C', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <p style={{ fontSize: '.85rem', color: '#7C6B60', marginBottom: '2rem' }}>Showing {filtered.length} gift{filtered.length !== 1 ? 's' : ''}</p>
        )}

        {loading && (
          <div className="gs-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.8rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', height: '320px', animation: 'gsPulse 1.4s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem' }}>No gifts match yet.</p>
            <p style={{ fontSize: '.85rem' }}>Try a different search or feeling.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="gs-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.8rem' }}>
            {filtered.map((p, i) => (
              <Link key={p.id || i} href={`/product/${p.id}`}
                style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all .25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(43,32,25,.10)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: '100%', aspectRatio: '1', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🎁'}
                </div>
                <div style={{ padding: '1.1rem 1.2rem' }}>
                  <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.05rem', color: '#2B2019', marginBottom: '.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: '.72rem', color: '#7C6B60', marginBottom: '.4rem' }}>by {p.creators?.name || p.creators?.shop_name || 'GiftSoul creator'}</div>
                  {p.reviews?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', marginBottom: '.5rem' }}>
                      <span style={{ color: '#C99A54', fontSize: '.75rem' }}>★</span>
                      <span style={{ fontSize: '.75rem', color: '#2B2019', fontWeight: 500 }}>
                        {(p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)}
                      </span>
                      <span style={{ fontSize: '.68rem', color: '#7C6B60' }}>({p.reviews.length})</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 500, color: '#2B2019' }}>₹{p.base_price}</span>
                    <span style={{ fontSize: '.68rem', color: '#C99A54' }}>{p.lead_time_days || 5}d lead time</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* JOIN CTA */}
      <div className="gs-cta-section" style={{ background: '#B5533C', padding: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.8rem,4vw,3.5rem)', fontWeight: 400, color: 'white', marginBottom: '1rem' }}>
          Making something?<br /><em style={{ color: 'rgba(255,255,255,.65)' }}>Sell it on GiftSoul.</em>
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.75)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Join creators across India selling handmade, meaningful gifts directly to buyers.
        </p>
        <Link
          href="/creator-register"
          style={{ display: 'inline-block', padding: '.85rem 2.5rem', border: '1px solid rgba(255,255,255,.4)', borderRadius: '2rem', color: 'white', textDecoration: 'none', fontSize: '.85rem', transition: 'all .2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.7)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)' }}
        >
          Create your profile →
        </Link>
      </div>

      <footer style={{ background: '#2B2019', padding: '3rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#FBF7F2' }}>Gift<em style={{ fontStyle: 'italic', color: '#C99A54' }}>Soul</em></div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Marketplace', '/marketplace'], ['Creators', '/creators'], ['Join', '/creator-register']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: '.82rem', color: 'rgba(251,247,242,.45)', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: '.75rem', color: 'rgba(251,247,242,.28)' }}>© 2026 GiftSoul. Made with love in India.</div>
      </footer>

      <style>{`
        @keyframes gsPulse { 0%,100% { opacity: .5; } 50% { opacity: .8; } }

        @media (max-width: 900px) {
          .gs-nav { padding: 0 1.25rem !important; }
          .gs-nav-links { display: none !important; }
          .gs-nav-burger { display: flex !important; }
          .gs-hero-section { padding: calc(70px + 2rem) 1.5rem 2rem !important; }
          .gs-filter-bar { padding: 1rem 1.5rem !important; }
          .gs-filter-bar-2 { padding: 1rem 1.5rem !important; gap: 1rem !important; }
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

export default function Marketplace() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FBF7F2' }} />}>
      <MarketplaceInner />
    </Suspense>
  )
}
