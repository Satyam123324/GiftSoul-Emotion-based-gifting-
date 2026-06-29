'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const EMOTIONS = ['all', 'love', 'celebration', 'grief', 'gratitude', 'nostalgia', 'friendship', 'new beginnings', 'self-care', 'achievement', 'apology', 'comfort']
const CARD_BG = ['#FFF3E0', '#E8F5E9', '#FCE4EC', '#E3F2FD', '#FFF9C4', '#E0F7FA', '#F3E5F5', '#FCECEA']
const CATEGORY_ICON = { 'Candles': '🕯️', 'Macramé': '🌿', 'Resin art': '💌', 'Pottery': '🏺', 'Jewellery': '💍', 'Skincare': '🧴', 'Cards': '✉️', 'Crochet': '🧶', 'Gift hampers': '🎁', 'Plants': '🪴', 'Paintings': '🎨', 'Embroidery': '🌸' }

// Fallback products if Supabase returns nothing
const FALLBACK = [
  { id: 1, icon: '🕯️', bg: '#FFF3E0', category: 'Candles', emotion_tags: ['celebration', 'self-care', 'love', 'comfort'], name: 'Hand-poured lavender soy candle', creators: { shop_name: "Sneha's Nook", city: 'Jaipur' }, base_price: 480, lead_time_days: 5 },
  { id: 2, icon: '🌿', bg: '#E8F5E9', category: 'Macramé', emotion_tags: ['gratitude', 'new beginnings', 'friendship'], name: 'Handwoven macramé wall hanging', creators: { shop_name: 'Thread & Knot', city: 'Kochi' }, base_price: 1200, lead_time_days: 7 },
  { id: 3, icon: '💌', bg: '#FCE4EC', category: 'Resin art', emotion_tags: ['love', 'nostalgia', 'grief', 'apology'], name: 'Resin keepsake memory box', creators: { shop_name: 'Crystal Craft', city: 'Pune' }, base_price: 890, lead_time_days: 7 },
  { id: 4, icon: '🏺', bg: '#E3F2FD', category: 'Pottery', emotion_tags: ['achievement', 'gratitude', 'self-care'], name: 'Hand-thrown ceramic mug', creators: { shop_name: 'Clay & Fire', city: 'Bengaluru' }, base_price: 650, lead_time_days: 10 },
  { id: 5, icon: '💍', bg: '#F3E5F5', category: 'Jewellery', emotion_tags: ['love', 'celebration', 'romance'], name: 'Handcrafted silver ring', creators: { shop_name: 'Silver Thread Co', city: 'Jaipur' }, base_price: 2200, lead_time_days: 5 },
  { id: 6, icon: '🧴', bg: '#E0F7FA', category: 'Skincare', emotion_tags: ['self-care', 'grief', 'comfort', 'new beginnings'], name: 'Ayurvedic skincare gift set', creators: { shop_name: 'Roots & Rituals', city: 'Mumbai' }, base_price: 1400, lead_time_days: 3 },
  { id: 7, icon: '✉️', bg: '#FFF9C4', category: 'Cards', emotion_tags: ['friendship', 'gratitude', 'apology', 'love'], name: 'Hand-lettered greeting card set', creators: { shop_name: 'Paper & Pen', city: 'Chennai' }, base_price: 320, lead_time_days: 2 },
  { id: 8, icon: '🧶', bg: '#FCECEA', category: 'Crochet', emotion_tags: ['grief', 'nostalgia', 'comfort', 'self-care'], name: 'Chunky crochet throw blanket', creators: { shop_name: 'Yarn & Soul', city: 'Ahmedabad' }, base_price: 3200, lead_time_days: 14 },
  { id: 9, icon: '🎁', bg: '#E8F5E9', category: 'Gift hampers', emotion_tags: ['celebration', 'achievement', 'gratitude'], name: 'Personalised gift hamper', creators: { shop_name: 'The Curated Basket', city: 'Delhi' }, base_price: 1800, lead_time_days: 4 },
  { id: 10, icon: '🪴', bg: '#F1F8E9', category: 'Plants', emotion_tags: ['new beginnings', 'self-care', 'friendship', 'hope'], name: 'Succulent terrarium kit', creators: { shop_name: 'Green Things Studio', city: 'Hyderabad' }, base_price: 750, lead_time_days: 2 },
  { id: 11, icon: '🎨', bg: '#FFF3E0', category: 'Paintings', emotion_tags: ['love', 'nostalgia', 'achievement', 'grief'], name: 'Custom watercolour portrait', creators: { shop_name: 'Brushwork', city: 'Kolkata' }, base_price: 4500, lead_time_days: 21 },
  { id: 12, icon: '🌸', bg: '#FCE4EC', category: 'Resin art', emotion_tags: ['apology', 'friendship', 'love', 'nostalgia'], name: 'Pressed flower resin bookmark', creators: { shop_name: 'Petal & Glass', city: 'Pune' }, base_price: 380, lead_time_days: 3 },
]

export default function Marketplace() {
  const [activeEmo, setActiveEmo] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('relevant')
  const [priceMax, setPriceMax] = useState(10000)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const url = activeEmo === 'all'
          ? '/api/products'
          : `/api/products?emotion=${encodeURIComponent(activeEmo)}`
        const res = await fetch(url)
        const data = await res.json()
        if (data.products && data.products.length > 0) {
          setProducts(data.products)
        } else {
          setProducts(FALLBACK)
        }
      } catch {
        setProducts(FALLBACK)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeEmo])

  // Client-side filter + sort
  const filtered = products
    .filter(p => {
      const price = p.base_price || 0
      const name = (p.name || '').toLowerCase()
      const shop = (p.creators?.shop_name || p.by || '').toLowerCase()
      const city = (p.creators?.city || p.city || '').toLowerCase()
      const q = search.toLowerCase()
      return price <= priceMax && (name.includes(q) || shop.includes(q) || city.includes(q) || !q)
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.base_price || 0) - (b.base_price || 0)
      if (sortBy === 'price-desc') return (b.base_price || 0) - (a.base_price || 0)
      return 0
    })

  const getIcon = p => p.icon || CATEGORY_ICON[p.category] || '🎁'
  const getBg = (p, i) => p.bg || CARD_BG[i % CARD_BG.length]
  const getPrice = p => p.price || (p.base_price ? `₹${p.base_price.toLocaleString('en-IN')}` : '₹500')
  const getLead = p => p.lead_time_days ? `${p.lead_time_days} days` : 'Made to order'
  const getShop = p => p.creators?.shop_name || p.by || 'Artisan'
  const getCity = p => p.creators?.city || p.city || 'India'
  const getEmotions = p => (p.emotion_tags || []).slice(0, 2).join(' · ')

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px', zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4rem',
        background: scrolled ? 'rgba(247,243,238,.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 #D9CDB8' : 'none',
        transition: 'all .35s',
      }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.65rem', fontWeight: 400, color: '#3D2B1F', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#B5622A' }}>Soul</em>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#B5622A', textDecoration: 'none', borderBottom: '1px solid #B5622A', paddingBottom: 2 }}>Browse gifts</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A6A5A', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#B5622A'}
            onMouseLeave={e => e.currentTarget.style.color = '#7A6A5A'}>Creators</Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#3D2B1F', color: '#F7F3EE', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#B5622A'}
            onMouseLeave={e => e.currentTarget.style.background = '#3D2B1F'}>Join as creator</Link>
        </div>
      </nav>

      {/* ── EMOTION HERO ────────────────────────────────── */}
      <div style={{ background: '#3D2B1F', padding: 'calc(70px + 2.5rem) 4rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(181,98,42,.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '.8rem' }}>Browse by feeling</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: '#F7F3EE', marginBottom: '.8rem' }}>
          Find a gift for <em style={{ fontStyle: 'italic', color: '#D4856A' }}>
            {activeEmo === 'all' ? 'every emotion' : activeEmo}
          </em>
        </h1>
        <p style={{ fontSize: '.9rem', color: 'rgba(247,243,238,.45)', maxWidth: '500px', marginBottom: '2rem' }}>
          Every gift on GiftSoul is tagged by the emotion it suits best. Click a feeling to filter.
        </p>
        <div style={{ display: 'flex', gap: '.7rem', flexWrap: 'wrap' }}>
          {EMOTIONS.map(em => (
            <button key={em} onClick={() => setActiveEmo(em)}
              style={{
                padding: '.45rem 1.2rem', borderRadius: '2rem',
                border: `1px solid ${activeEmo === em ? '#B5622A' : 'rgba(247,243,238,.2)'}`,
                background: activeEmo === em ? '#B5622A' : 'transparent',
                color: activeEmo === em ? 'white' : 'rgba(247,243,238,.55)',
                fontFamily: 'DM Sans, sans-serif', fontSize: '.8rem',
                cursor: 'pointer', transition: 'all .2s',
                fontWeight: activeEmo === em ? 500 : 400,
                transform: activeEmo === em ? 'scale(1.05)' : 'scale(1)',
              }}>
              {em === 'all' ? 'All gifts' : em}
            </button>
          ))}
        </div>
      </div>

      {/* ── SEARCH + SORT BAR ────────────────────────────── */}
      <div style={{ background: '#EDE6DA', borderBottom: '1px solid #D9CDB8', padding: '1.2rem 4rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, shop, or city…"
          style={{ flex: 1, minWidth: '240px', maxWidth: '420px', border: '1px solid #D9CDB8', borderRadius: '2rem', padding: '.65rem 1.4rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.88rem', background: 'white', outline: 'none', color: '#3D2B1F', transition: 'box-shadow .2s' }}
          onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(181,98,42,.12)'}
          onBlur={e => e.target.style.boxShadow = 'none'}
        />
        <Link href="/find-gift" style={{ padding: '.65rem 1.6rem', background: '#B5622A', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#8C4519'}
          onMouseLeave={e => e.currentTarget.style.background = '#B5622A'}>
          AI match my story →
        </Link>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ fontSize: '.82rem', border: '1px solid #D9CDB8', padding: '.5rem 1rem', borderRadius: '2rem', background: 'white', color: '#3D2B1F', outline: 'none', cursor: 'pointer' }}>
          <option value="relevant">Most relevant</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      {/* ── MAIN LAYOUT ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', padding: '2rem 4rem 5rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── SIDEBAR ───── */}
        <aside style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>

          {/* Price filter */}
          <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #D9CDB8' }}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: '#7A6A5A', marginBottom: '1rem' }}>Max price</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
              <input type="range" min="200" max="10000" step="100" value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#B5622A' }} />
              <span style={{ fontSize: '.85rem', fontWeight: 500, color: '#3D2B1F', minWidth: '48px' }}>
                ₹{priceMax >= 10000 ? '10k+' : priceMax.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #D9CDB8' }}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: '#7A6A5A', marginBottom: '1rem' }}>Category</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
              {['All', 'Candles', 'Jewellery', 'Pottery', 'Macramé', 'Resin', 'Cards', 'Skincare'].map(cat => (
                <button key={cat}
                  style={{ padding: '.28rem .8rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #D9CDB8', color: '#7A6A5A', cursor: 'pointer', background: 'transparent', transition: 'all .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#B5622A'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#B5622A' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A6A5A'; e.currentTarget.style.borderColor = '#D9CDB8' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: '#7A6A5A', marginBottom: '1rem' }}>Recipient</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
              {['Her', 'Him', 'Them', 'Kids', 'Parents', 'Colleague'].map(r => (
                <button key={r}
                  style={{ padding: '.28rem .8rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #D9CDB8', color: '#7A6A5A', cursor: 'pointer', background: 'transparent', transition: 'all .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#B5622A'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#B5622A' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A6A5A'; e.currentTarget.style.borderColor = '#D9CDB8' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* AI suggest box */}
          <div style={{ background: '#3D2B1F', borderRadius: '16px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.6rem' }}>✨</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#F7F3EE', marginBottom: '.5rem' }}>Not sure?</p>
            <p style={{ fontSize: '.78rem', color: 'rgba(247,243,238,.5)', marginBottom: '1rem', lineHeight: 1.5 }}>Tell us the story and our AI will find the perfect match</p>
            <Link href="/find-gift" style={{ display: 'block', padding: '.6rem 1rem', background: '#B5622A', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.78rem', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#8C4519'}
              onMouseLeave={e => e.currentTarget.style.background = '#B5622A'}>
              Try AI matcher →
            </Link>
          </div>
        </aside>

        {/* ── PRODUCTS GRID ── */}
        <main>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '.85rem', color: '#7A6A5A' }}>
              {loading ? 'Loading…' : `Showing ${filtered.length} gifts`}
              {activeEmo !== 'all' && ` for "${activeEmo}"`}
            </span>
          </div>

          {/* Skeleton loader */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{ height: '170px', background: 'linear-gradient(90deg, #EDE6DA 25%, #D9CDB8 50%, #EDE6DA 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ height: 10, background: '#EDE6DA', borderRadius: 6, marginBottom: 8, width: '60%', animation: 'shimmer 1.4s infinite' }} />
                    <div style={{ height: 14, background: '#EDE6DA', borderRadius: 6, marginBottom: 8, animation: 'shimmer 1.4s infinite' }} />
                    <div style={{ height: 10, background: '#EDE6DA', borderRadius: 6, width: '40%', animation: 'shimmer 1.4s infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product cards */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((p, i) => (
                <Link key={p.id || i} href="/product"
                  style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all .25s', animation: `fadeUp .4s ${Math.min(i, 5) * .06}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(61,43,31,.11)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ height: '175px', background: getBg(p, i), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', position: 'relative' }}>
                    {getIcon(p)}
                  </div>
                  <div style={{ padding: '1rem 1.1rem 1.2rem' }}>
                    {getEmotions(p) && (
                      <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '.4rem' }}>{getEmotions(p)}</div>
                    )}
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.08rem', color: '#3D2B1F', marginBottom: '.25rem', lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: '.7rem', color: '#7A6A5A', marginBottom: '.7rem' }}>by {getShop(p)} · {getCity(p)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '.95rem', fontWeight: 500, color: '#3D2B1F' }}>{getPrice(p)}</span>
                      <span style={{ fontSize: '.65rem', color: '#7A6A5A' }}>{getLead(p)}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {!loading && filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#3D2B1F', marginBottom: '.5rem' }}>No gifts found</h3>
                  <p style={{ fontSize: '.88rem', color: '#7A6A5A', marginBottom: '1.5rem' }}>Try a different emotion or clear your search</p>
                  <button onClick={() => { setActiveEmo('all'); setSearch(''); setPriceMax(10000) }}
                    style={{ padding: '.7rem 1.8rem', background: '#B5622A', color: 'white', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem' }}>
                    Show all gifts
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ background: '#3D2B1F', padding: '3rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,.07)', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: '#F7F3EE' }}>
            Gift<em style={{ fontStyle: 'italic', color: '#D4856A' }}>Soul</em>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Marketplace', '/marketplace'], ['Creators', '/creators'], ['Find a gift', '/find-gift']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: '.82rem', color: 'rgba(247,243,238,.45)', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(247,243,238,.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(247,243,238,.45)'}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '.75rem', color: 'rgba(247,243,238,.28)' }}>© 2026 GiftSoul. Made with love in India.</div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 220px"] { grid-template-columns: 1fr !important; }
          nav { padding: 0 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}