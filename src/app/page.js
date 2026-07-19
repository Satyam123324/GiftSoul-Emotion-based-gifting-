'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { CATEGORIES, RECIPIENTS } from './lib/constants'

const EMOTIONS = [
  'love', 'grief', 'celebration', 'gratitude', 'nostalgia',
  'friendship', 'apology', 'new beginnings', 'self-care',
  'pride', 'comfort', 'achievement'
]

const FLOATING_CARDS = [
  { icon: '🕯️', label: 'For celebration', name: 'Soy candle', price: '₹480', by: "Sneha's Nook", top: '18%', left: '8%', rot: '-4deg', delay: '0s' },
  { icon: '🌿', label: 'For gratitude', name: 'Macramé art', price: '₹1,200', by: 'Thread & Knot', top: '44%', right: '6%', rot: '3deg', delay: '.15s' },
  { icon: '💌', label: 'For love', name: 'Resin box', price: '₹890', by: 'Crystal Craft', bottom: '16%', left: '14%', rot: '-2deg', delay: '.3s' },
]

const FEATURED = [
  { icon: '🕯️', bg: '#F3E8DC', emotion: 'Celebration · Self-care', name: 'Hand-poured lavender soy candle', by: "Sneha's Nook · Jaipur", price: '₹480', lead: '5 days' },
  { icon: '👜', bg: '#EAF1F7', emotion: 'Pride · Self-care', name: 'Hand-embroidered sling purse', by: 'Kalakari Studio · Lucknow', price: '₹1,150', lead: '6 days' },
  { icon: '🥻', bg: '#F9EAE6', emotion: 'Celebration · Nostalgia', name: 'Hand block-printed designer kurta', by: 'Ranga Textiles · Jaipur', price: '₹1,850', lead: '7 days' },
  { icon: '🍫', bg: '#EAF3E1', emotion: 'Gratitude · Celebration', name: 'Assorted handmade chocolate hamper', by: 'Cocoa Tales · Mumbai', price: '₹899', lead: '2 days' },
  { icon: '🪔', bg: '#F7EAC8', emotion: 'Celebration · Gratitude', name: 'Diwali festive gift box', by: 'Utsav Crafts · Ahmedabad', price: '₹1,299', lead: '4 days' },
  { icon: '💍', bg: '#F9EAE6', emotion: 'Love · Pride', name: 'Oxidised silver jhumka earrings', by: 'Chandi Crafts · Jodhpur', price: '₹650', lead: '3 days' },
]

const CREATORS = [
  { init: 'S', name: 'Sneha Patel', city: 'Jaipur', craft: 'Soy candles', bg: '#F3E8DC' },
  { init: 'M', name: 'Meera Krishnan', city: 'Kochi', craft: 'Macramé', bg: '#EAF3E1' },
  { init: 'P', name: 'Priya Sharma', city: 'Pune', craft: 'Resin art', bg: '#F9EAE6' },
  { init: 'A', name: 'Arjun Nair', city: 'Bengaluru', craft: 'Pottery', bg: '#EAF1F7' },
]

const TESTIMONIALS = [
  { stars: '★★★★★', text: 'I typed three sentences about my mother\'s retirement and GiftSoul found her the most perfect pottery bowl. She cried when she opened it.', name: 'Riya Desai', city: 'Mumbai' },
  { stars: '★★★★★', text: 'Every gift I\'ve given from here has made someone cry — in the best possible way. The emotion matching is scary accurate.', name: 'Kabir Mehta', city: 'Delhi' },
  { stars: '★★★★★', text: 'As a creator, GiftSoul brings me buyers who actually understand what I make. Every sale feels meaningful.', name: 'Sneha Patel', city: 'Jaipur (creator)' },
]

function HeroDecorativePanel() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let ticking = false
    const onMove = e => {
      if (!ticking) {
        const clientX = e.clientX
        const clientY = e.clientY
        window.requestAnimationFrame(() => {
          const x = (clientX / window.innerWidth - 0.5) * 18
          const y = (clientY / window.innerHeight - 0.5) * 10
          setMousePos({ x, y })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div style={{ background: '#F3E8DC', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(201,154,84,.4) 0%, transparent 60%)' }} />

      {/* Floating word backdrop */}
      {[
        { word: 'love', size: '5.5rem', top: '8%', left: '8%', delay: '0s' },
        { word: 'joy', size: '3rem', top: '40%', right: '8%', delay: '.4s' },
        { word: 'grief', size: '4rem', bottom: '20%', left: '6%', delay: '.8s' },
        { word: 'care', size: '2.5rem', top: '24%', right: '22%', delay: '.2s' },
        { word: 'gratitude', size: '3.5rem', bottom: '8%', right: '6%', delay: '.6s' },
      ].map(w => (
        <div key={w.word} style={{
          position: 'absolute',
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          color: '#C99A54',
          opacity: .14,
          fontSize: w.size,
          top: w.top, left: w.left, right: w.right, bottom: w.bottom,
          pointerEvents: 'none',
          animation: `floatWord 6s ${w.delay} ease-in-out infinite`,
          userSelect: 'none',
        }}>{w.word}</div>
      ))}

      {/* Parallax gift cards */}
      {FLOATING_CARDS.map((c, i) => (
        <div key={c.name} style={{
          position: 'absolute',
          background: 'white',
          border: '1px solid #E4D3BE',
          borderRadius: '14px',
          padding: '1rem 1.2rem',
          boxShadow: '0 8px 32px rgba(43,32,25,.1)',
          width: '165px',
          top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          transform: `rotate(${c.rot}) translate(${mousePos.x * (i % 2 === 0 ? 0.3 : -0.3)}px, ${mousePos.y * 0.3}px)`,
          transition: 'transform .1s linear',
          animation: `cardFloat ${3 + i * 0.8}s ${c.delay} ease-in-out infinite`,
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '.5rem' }}>{c.icon}</div>
          <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '.3rem' }}>{c.label}</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#2B2019' }}>{c.name}</div>
          <div style={{ fontSize: '.8rem', color: '#B5533C', marginTop: '.2rem' }}>{c.price}</div>
          <div style={{ fontSize: '.68rem', color: '#7C6B60' }}>by {c.by}</div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [story, setStory] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [activeEmotion, setActiveEmotion] = useState('love')
  const heroRef = useRef(null)

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }), { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2', overflowX: 'hidden' }}>

      {/* ── FIXED TOP BAR (promo strip + nav combined, so they always move as one unit) ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500 }}>

        {/* Promo strip */}
        <div style={{ background: '#2B2019', color: '#FBF7F2', textAlign: 'center', padding: '.55rem 1rem', fontSize: '.75rem', letterSpacing: '.03em' }}>
          Free shipping on your first order · No platform fees for creators <span style={{ color: '#C99A54', marginLeft: '.5rem' }}>· Limited time</span>
        </div>

        {/* Nav — solid background always, so nothing behind it can ever show through or overlap */}
        <nav style={{
          height: '70px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 4rem',
          background: '#FBF7F2',
          boxShadow: '0 1px 0 #E4D3BE',
        }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.65rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
            Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            {[['Browse gifts', '/marketplace'], ['By emotion', '/marketplace'], ['Creators', '/creators'], ['Corporate', '/corporate']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#B5533C'}
                onMouseLeave={e => e.currentTarget.style.color = '#7C6B60'}>
                {label}
              </Link>
            ))}
            <Link href="/wishlist" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#B5533C'}
              onMouseLeave={e => e.currentTarget.style.color = '#7C6B60'}>
              ♡ Saved
            </Link>
            <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#2B2019', color: '#FBF7F2', borderRadius: '2rem', fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#B5533C'}
              onMouseLeave={e => e.currentTarget.style.background = '#2B2019'}>
              Join as creator
          </Link>
        </div>
      </nav>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '55% 45%', overflow: 'hidden' }}>

        {/* Left — story input */}
        <div style={{ padding: 'calc(70px + 5rem + 34px) 4rem 5rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1.6rem', animation: 'fadeUp .6s .1s both' }}>
            Emotion-based gifting · Made in India
          </p>

          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 5vw, 5.5rem)', fontWeight: 300, lineHeight: 1.06, color: '#2B2019', marginBottom: '1.6rem', animation: 'fadeUp .6s .2s both' }}>
            Every gift tells<br />
            <em style={{ fontStyle: 'italic', color: '#B5533C' }}>someone&apos;s story</em>
          </h1>

          <p style={{ fontSize: '1rem', color: '#7C6B60', lineHeight: 1.8, maxWidth: '440px', fontWeight: 300, marginBottom: '2.8rem', animation: 'fadeUp .6s .3s both' }}>
            Share a moment, a memory, a feeling. Our AI finds handcrafted gifts made by real artisans — chosen for the emotion, not the occasion.
          </p>

          {/* Story box */}
          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.5rem', maxWidth: '520px', boxShadow: '0 4px 24px rgba(43,32,25,.09)', position: 'relative', animation: 'fadeUp .6s .4s both', transition: 'box-shadow .25s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 36px rgba(43,32,25,.13)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(43,32,25,.09)'}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '.5rem' }}>Tell us your story</div>
            <textarea
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="My best friend just got her dream job after years of trying. She loves plants and always lights a candle while she works. I want something that feels like a warm hug…"
              rows={4}
              style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', lineHeight: 1.65, color: '#2B2019', background: 'transparent', resize: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E4D3BE', flexWrap: 'wrap', gap: '.8rem' }}>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {['celebration', 'gratitude', 'love', 'comfort'].map(tag => (
                  <span key={tag}
                    onClick={e => { const el = e.target; el.dataset.active = el.dataset.active === '1' ? '' : '1'; el.style.background = el.dataset.active === '1' ? '#B5533C' : 'transparent'; el.style.color = el.dataset.active === '1' ? 'white' : '#7C6B60'; el.style.borderColor = el.dataset.active === '1' ? '#B5533C' : '#E4D3BE' }}
                    style={{ padding: '.3rem .9rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #E4D3BE', color: '#7C6B60', cursor: 'pointer', transition: 'all .18s', userSelect: 'none' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => { if (story.length > 8) setShowResult(true) }}
                style={{ padding: '.65rem 1.5rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7D3526'; e.currentTarget.style.transform = 'scale(1.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#B5533C'; e.currentTarget.style.transform = 'scale(1)' }}>
                Find gifts →
              </button>
            </div>
          </div>

          {/* Quick result preview */}
          {showResult && (
            <div style={{ marginTop: '1rem', background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '12px', padding: '1.2rem', maxWidth: '520px', animation: 'fadeUp .4s both' }}>
              <div style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '.8rem' }}>Suggested — celebration + warmth</div>
              <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                {[{ icon: '🕯️', name: 'Soy candle', by: "Sneha's Nook", price: '₹480' },
                  { icon: '🌿', name: 'Terrarium kit', by: 'Green Things', price: '₹750' },
                  { icon: '✉️', name: 'Card set', by: 'Paper & Pen', price: '₹320' }
                ].map(g => (
                  <div key={g.name} style={{ flex: 1, minWidth: '110px', background: 'white', borderRadius: '10px', padding: '.8rem', border: '1px solid #E4D3BE' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '.3rem' }}>{g.icon}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#2B2019' }}>{g.name}</div>
                    <div style={{ fontSize: '.7rem', color: '#7C6B60' }}>{g.by}</div>
                    <div style={{ fontSize: '.78rem', color: '#B5533C', fontWeight: 500, marginTop: '.2rem' }}>{g.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '.8rem', textAlign: 'right' }}>
                <Link href="/find-gift" style={{ fontSize: '.78rem', color: '#B5533C', textDecoration: 'none', borderBottom: '1px solid #C99A54' }}>
                  See AI suggestions →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right — animated decorative panel (isolated: mouse tracking lives in its own component so moving the mouse doesn't re-render the whole homepage) */}
        <HeroDecorativePanel />
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────── */}
      <div style={{ background: '#F3E8DC', borderTop: '1px solid #E4D3BE', borderBottom: '1px solid #E4D3BE', padding: '1.25rem 4rem', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap', overflowX: 'auto' }}>
        {[['200+', 'verified creators'], ['AI-powered', 'emotion matching'], ['Ships', 'across India'], ['Every gift', 'made by hand'], ['Custom orders', 'welcome']].map(([strong, text], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', whiteSpace: 'nowrap' }}>
            {i > 0 && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C99A54', flexShrink: 0, marginRight: '-.4rem' }} />}
            <strong style={{ fontSize: '.82rem', color: '#2B2019' }}>{strong}</strong>
            <span style={{ fontSize: '.82rem', color: '#7C6B60' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* ── CHOOSE YOUR GIFTING STYLE ────────────────────── */}
      <section style={{ padding: '6rem 5rem 2rem' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />Shop by style
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019', marginBottom: '3rem' }}>
          Choose your <em style={{ fontStyle: 'italic', color: '#B5533C' }}>gifting style</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.8rem' }}>
          {[
            { icon: '🎁', title: 'Handmade Gifts', desc: 'Single personalised items, made and delivered just for them.', cta: 'Shop handmade →', href: '/marketplace', bg: '#F3E8DC' },
            { icon: '💌', title: 'AI-Matched Gifts', desc: 'Tell us the story, our AI finds the gift that fits the feeling.', cta: 'Try the AI matcher →', href: '/find-gift', bg: '#EAF3E1' },
            { icon: '🧺', title: 'Gift Hampers', desc: 'Curated boxes with multiple items, for bigger moments.', cta: 'Explore hampers →', href: '/marketplace', bg: '#F9EAE6' },
          ].map((c, i) => (
            <Link key={c.title} href={c.href} className="reveal"
              style={{ background: c.bg, border: '1px solid #E4D3BE', borderRadius: '24px', padding: '2rem', textDecoration: 'none', display: 'block', transition: 'all .25s', transitionDelay: `${i * .08}s` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(43,32,25,.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>{c.icon}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', color: '#2B2019', marginBottom: '.5rem' }}>{c.title}</div>
              <p style={{ fontSize: '.85rem', color: '#7C6B60', lineHeight: 1.6, marginBottom: '1.2rem' }}>{c.desc}</p>
              <span style={{ fontSize: '.8rem', color: '#B5533C', fontWeight: 500 }}>{c.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── OCCASION QUICK-FILTERS ───────────────────────── */}
      <section style={{ padding: '3rem 5rem' }}>
        <h3 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 400, color: '#2B2019', marginBottom: '1.2rem' }}>
          For your occasion
        </h3>
        <div className="reveal" style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
          {[['Birthday', 'birthday'], ['Anniversary', 'anniversary'], ['Wedding', 'wedding'], ['Baby Shower', 'babyshower'], ['Housewarming', 'housewarming']].map(([label, val]) => (
            <Link key={val} href={`/marketplace?occasion=${val}`}
              style={{ padding: '.6rem 1.4rem', borderRadius: '2rem', border: '1px solid #E4D3BE', background: 'white', color: '#2B2019', fontSize: '.85rem', textDecoration: 'none', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.color = '#B5533C' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.color = '#2B2019' }}>
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── BUDGET QUICK-FILTERS ─────────────────────────── */}
      <section style={{ padding: '0 5rem 6rem' }}>
        <h3 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 400, color: '#2B2019', marginBottom: '1.2rem' }}>
          Shop under budget
        </h3>
        <div className="reveal" style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
          {[299, 499, 799, 1499].map(v => (
            <Link key={v} href={`/marketplace?maxPrice=${v}`}
              style={{ padding: '.6rem 1.4rem', borderRadius: '2rem', border: '1px solid #E4D3BE', background: '#F3E8DC', color: '#2B2019', fontSize: '.85rem', textDecoration: 'none', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.color = '#B5533C' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.color = '#2B2019' }}>
              Under ₹{v}
            </Link>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────── */}
      <section style={{ padding: '2rem 5rem 6rem' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />Every kind of meaningful
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019', marginBottom: '3rem' }}>
          Shop by <em style={{ fontStyle: 'italic', color: '#B5533C' }}>category</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.2rem' }}>
          {CATEGORIES.filter(c => c.value !== 'general').map((c, i) => (
            <Link key={c.value} href={`/marketplace?category=${c.value}`} className="reveal"
              style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '18px', padding: '1.5rem 1.2rem', textDecoration: 'none', textAlign: 'center', transition: 'all .22s', transitionDelay: `${i * .04}s` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(43,32,25,.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ fontSize: '2rem', marginBottom: '.7rem' }}>{c.icon}</div>
              <div style={{ fontSize: '.82rem', color: '#2B2019', lineHeight: 1.4 }}>{c.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SHOP BY RECIPIENT ─────────────────────────────── */}
      <section style={{ padding: '2rem 5rem 6rem' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />Who is it for?
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019', marginBottom: '3rem' }}>
          Shop by <em style={{ fontStyle: 'italic', color: '#B5533C' }}>who you&apos;re gifting</em>
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {RECIPIENTS.map((r, i) => (
            <Link key={r.value} href={`/marketplace?recipient=${encodeURIComponent(r.value)}`} className="reveal"
              style={{ display: 'flex', alignItems: 'center', gap: '.6rem', background: 'white', border: '1px solid #E4D3BE', borderRadius: '2rem', padding: '.7rem 1.3rem', textDecoration: 'none', transition: 'all .2s', transitionDelay: `${i * .04}s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.background = '#F9EAE6' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.background = 'white' }}>
              <span style={{ fontSize: '1.3rem' }}>{r.icon}</span>
              <span style={{ fontSize: '.85rem', color: '#2B2019' }}>{r.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />
          How it works
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019', marginBottom: '4rem', maxWidth: '520px' }}>
          Gifting that actually <em style={{ fontStyle: 'italic', color: '#B5533C' }}>means something</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem' }}>
          {[
            { n: '01', title: 'Share your story', desc: 'Write a few lines about the person, the moment, or the feeling. The more honest, the better.' },
            { n: '02', title: 'AI reads the emotion', desc: 'Our AI understands context, not just keywords — it detects grief, pride, nostalgia and finds what truly fits.' },
            { n: '03', title: 'Get matched to makers', desc: 'Real artisans matched to your emotion. Every gift comes with their story, their craft, their care.' },
          ].map((s, i) => (
            <div key={s.n} className="reveal" style={{ transitionDelay: `${i * .1}s` }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4.5rem', fontWeight: 300, color: '#E4D3BE', lineHeight: 1, marginBottom: '.8rem' }}>{s.n}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 400, color: '#2B2019', marginBottom: '.7rem' }}>{s.title}</h3>
              <p style={{ fontSize: '.88rem', color: '#7C6B60', lineHeight: 1.75, fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: '3rem' }}>
          <Link href="/find-gift" style={{ padding: '.85rem 2.2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', display: 'inline-block', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7D3526'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#B5533C'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Try the AI matcher →
          </Link>
        </div>
      </section>

      {/* ── FEATURED GIFTS ───────────────────────────────── */}
      <section style={{ padding: '5rem', background: '#FBF7F2' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />Featured gifts
            </p>
            <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019' }}>
              Gifts chosen by <em style={{ fontStyle: 'italic', color: '#B5533C' }}>emotion</em>
            </h2>
          </div>
          <Link href="/marketplace" className="reveal" style={{ padding: '.75rem 1.8rem', border: '1px solid #E4D3BE', borderRadius: '2rem', color: '#2B2019', textDecoration: 'none', fontSize: '.82rem', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.color = '#B5533C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.color = '#2B2019' }}>
            Browse all →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {FEATURED.map((g, i) => (
            <Link key={g.name} href="/product" className="reveal"
              style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all .25s', transitionDelay: `${i * .1}s` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(43,32,25,.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ height: '220px', background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>{g.icon}</div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.5rem' }}>{g.emotion}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2B2019', marginBottom: '.3rem' }}>{g.name}</div>
                <div style={{ fontSize: '.72rem', color: '#7C6B60', marginBottom: '.6rem' }}>by {g.by}</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#2B2019' }}>{g.price} <span style={{ fontSize: '.72rem', color: '#7C6B60', fontWeight: 300 }}>{g.lead}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CREATORS ────────────────────────────────────── */}
      <section style={{ background: '#2B2019', padding: '6rem 5rem' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#C99A54' }} />Meet the makers
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#FBF7F2', margin: '1rem 0 3rem' }}>
          Gifts made by <em style={{ fontStyle: 'italic', color: '#C97B63' }}>real hands</em>,<br />in real homes across India
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {CREATORS.map((c, i) => (
            <Link key={c.name} href="/creator-profile" className="reveal"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '20px', padding: '1.4rem', textDecoration: 'none', display: 'block', transition: 'all .22s', transitionDelay: `${i * .08}s` }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.09)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2B2019', marginBottom: '.9rem' }}>{c.init}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#FBF7F2', marginBottom: '.15rem' }}>{c.name}</div>
              <div style={{ fontSize: '.7rem', color: 'rgba(251,247,242,.38)', marginBottom: '.7rem' }}>{c.city}</div>
              <span style={{ fontSize: '.7rem', padding: '.25rem .7rem', background: 'rgba(201,154,84,.15)', border: '1px solid rgba(201,154,84,.25)', borderRadius: '2rem', color: '#C99A54' }}>{c.craft}</span>
            </Link>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center' }}>
          <Link href="/creators" style={{ display: 'inline-block', padding: '.85rem 2.2rem', border: '1px solid rgba(251,247,242,.3)', borderRadius: '2rem', color: '#FBF7F2', textDecoration: 'none', fontSize: '.82rem', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C99A54'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(251,247,242,.3)'}>
            Browse all 200+ creators →
          </Link>
        </div>
      </section>

      {/* ── EMOTIONS ────────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'center' }}>
        <div>
          <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />Browse by feeling
          </p>
          <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019', margin: '1rem 0 1.2rem' }}>
            Don&apos;t know what to get? Start with <em style={{ fontStyle: 'italic', color: '#B5533C' }}>how you feel</em>
          </h2>
          <p className="reveal" style={{ fontSize: '.9rem', color: '#7C6B60', lineHeight: 1.8, fontWeight: 300, maxWidth: '380px', marginBottom: '2rem' }}>
            Every gift on GiftSoul is tagged by the human emotion it suits best.
          </p>
          <Link href="/marketplace" className="reveal" style={{ padding: '.85rem 2.2rem', background: '#2B2019', color: '#FBF7F2', borderRadius: '2rem', textDecoration: 'none', fontSize: '.82rem', display: 'inline-block', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#B5533C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2B2019'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Explore marketplace →
          </Link>
        </div>
        <div className="reveal" style={{ background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '32px', padding: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '.8rem' }}>
          {EMOTIONS.map((em, i) => (
            <button key={em}
              onClick={() => setActiveEmotion(em)}
              style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                borderRadius: '2rem', border: '1px solid #E4D3BE',
                background: activeEmotion === em ? '#B5533C' : 'white',
                color: activeEmotion === em ? 'white' : '#2B2019',
                cursor: 'pointer', transition: 'all .2s',
                fontSize: em.length > 8 ? '.88rem' : '1.1rem',
                padding: '.45rem 1.2rem',
                transform: activeEmotion === em ? 'scale(1.05)' : 'scale(1)',
                animationDelay: `${i * .05}s`,
              }}>
              {em}
            </button>
          ))}
        </div>
      </section>

      {/* ── TRUST / GUARANTEE ─────────────────────────────── */}
      <section style={{ padding: '7rem 5rem', background: '#2B2019' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <div className="reveal">
            <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <span style={{ display: 'block', width: 24, height: 1, background: '#C99A54' }} />Why trust us
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 300, color: '#FBF7F2', marginBottom: '1.3rem', lineHeight: 1.2 }}>
              Some moments are <em style={{ fontStyle: 'italic', color: '#C97B63' }}>too important</em> to get wrong.
            </h2>
            <p style={{ fontSize: '.92rem', color: 'rgba(251,247,242,.55)', lineHeight: 1.8, maxWidth: '420px' }}>
              You&apos;re not just ordering a gift — you&apos;re trusting us with a memory, a deadline, and someone you care about. We take that seriously.
            </p>
          </div>
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              'Verified creators and skilled artisans',
              'On-time delivery, or a full refund',
              'Clear tracking from order to delivery',
              'Real human support whenever something feels off',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '.9rem' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(201,154,84,.15)', border: '1px solid rgba(201,154,84,.35)', color: '#C99A54', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', flexShrink: 0, marginTop: '.1rem' }}>✓</span>
                <span style={{ fontSize: '.95rem', color: '#FBF7F2' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER SPOTLIGHT ──────────────────────────────── */}
      <section style={{ padding: '6rem 5rem', background: '#FBF7F2' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />Meet our top sellers
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019', marginBottom: '3rem' }}>
          Trusted creators, <em style={{ fontStyle: 'italic', color: '#B5533C' }}>real stories</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {[
            { init: 'S', name: "Sneha's Nook", by: 'Sneha · Jaipur, India', quote: 'GiftSoul makes custom orders so easy to manage. Clear briefs, on-time payouts, and buyers who truly value handmade work.', bg: '#F3E8DC' },
            { init: 'M', name: 'Thread & Knot', by: 'Meera · Kochi, India', quote: 'We love how GiftSoul handles personalised gifting. The brief is clear, support is responsive, and buyers keep coming back.', bg: '#EAF3E1' },
          ].map((s, i) => (
            <div key={s.name} className="reveal" style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '2rem', transitionDelay: `${i * .1}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#2B2019', flexShrink: 0 }}>{s.init}</div>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#2B2019' }}>{s.name}</div>
                  <div style={{ fontSize: '.75rem', color: '#7C6B60' }}>{s.by}</div>
                </div>
              </div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.7, color: '#2B2019' }}>
                &ldquo;{s.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: '2.5rem' }}>
          <Link href="/creator-register" style={{ fontSize: '.85rem', color: '#B5533C', textDecoration: 'none', borderBottom: '1px solid #B5533C' }}>
            Join our seller community →
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem', background: '#F3E8DC' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5533C' }} />What people say
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#2B2019', marginTop: '.8rem', marginBottom: '3rem' }}>
          Stories behind <em style={{ fontStyle: 'italic', color: '#B5533C' }}>the gifts</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="reveal"
              style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '2rem', transitionDelay: `${i * .1}s` }}>
              <div style={{ color: '#B5533C', marginBottom: '1rem', fontSize: '.9rem' }}>{t.stars}</div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', lineHeight: 1.7, color: '#2B2019', marginBottom: '1.2rem', fontStyle: 'italic' }}>{t.text}</p>
              <div style={{ fontSize: '.78rem', color: '#7C6B60' }}>
                <strong style={{ color: '#2B2019', fontWeight: 500 }}>{t.name}</strong> · {t.city}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem', textAlign: 'center', background: '#B5533C', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: 'white', marginBottom: '1rem' }}>
          Start with a story.<br />We&apos;ll find the <em style={{ color: 'rgba(255,255,255,.65)' }}>perfect gift</em>
        </h2>
        <p className="reveal" style={{ fontSize: '1rem', color: 'rgba(255,255,255,.75)', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
          No more guessing. No more gift cards. Just the right thing, made by hand.
        </p>
        <div className="reveal" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/find-gift" style={{ padding: '.85rem 2rem', border: '1px solid rgba(255,255,255,.4)', borderRadius: '2rem', color: 'white', textDecoration: 'none', fontSize: '.82rem', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)'}>
            Tell your story →
          </Link>
          <Link href="/creator-register" style={{ padding: '.85rem 2rem', background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', borderRadius: '2rem', color: 'white', textDecoration: 'none', fontSize: '.82rem', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}>
            Join as a creator
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ background: '#2B2019', padding: '5rem 4rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr 1fr 1.1fr', gap: '2.5rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#FBF7F2' }}>Gift<em style={{ fontStyle: 'italic', color: '#C97B63' }}>Soul</em></div>
            <div style={{ fontSize: '.82rem', color: 'rgba(251,247,242,.38)', marginTop: '.5rem', lineHeight: 1.6 }}>Heartcrafted with love and care.<br />Meaningful gifts for your special moments.</div>
            <div style={{ marginTop: '1rem', fontSize: '.78rem', color: 'rgba(251,247,242,.4)', lineHeight: 1.8 }}>
              hello@giftsoul.in<br />Bengaluru, India
            </div>
          </div>
          {[
            { title: 'Shop', links: [['All gifts', '/marketplace'], ['By emotion', '/marketplace'], ['Creators', '/creators'], ['AI gift finder', '/find-gift'], ['Corporate gifting', '/corporate']] },
            { title: 'Support', links: [['Help center', '/faq'], ['Shipping policy', '/faq'], ['Returns & refunds', '/faq'], ['Order tracking', '/faq']] },
            { title: 'Seller', links: [['Become a creator', '/creator-register'], ['Seller login', '/login'], ['Seller dashboard', '/dashboard'], ['Fees — it\u2019s free', '#']] },
            { title: 'Legal', links: [['Privacy policy', '#'], ['Terms of service', '#'], ['Cookie policy', '#']] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1.1rem' }}>{col.title}</h4>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} style={{ display: 'block', fontSize: '.85rem', color: 'rgba(251,247,242,.45)', textDecoration: 'none', marginBottom: '.55rem', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(251,247,242,.9)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(251,247,242,.45)'}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
          <div>
            <h4 style={{ fontSize: '.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1.1rem' }}>Newsletter</h4>
            <p style={{ fontSize: '.8rem', color: 'rgba(251,247,242,.45)', lineHeight: 1.6, marginBottom: '.9rem' }}>New creators &amp; gift ideas, once in a while.</p>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input
                type="email"
                placeholder="Your email"
                style={{ flex: 1, minWidth: 0, padding: '.55rem .8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.06)', color: '#FBF7F2', fontSize: '.78rem', outline: 'none' }}
              />
              <button style={{ padding: '.55rem 1rem', borderRadius: '10px', border: 'none', background: '#B5533C', color: 'white', fontSize: '.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Subscribe
              </button>
            </div>
            <div style={{ display: 'flex', gap: '.7rem', marginTop: '1.2rem' }}>
              {['Instagram', 'Facebook', 'LinkedIn'].map(s => (
                <span key={s} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.68rem', color: 'rgba(251,247,242,.5)' }} title={s}>
                  {s[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.75rem', color: 'rgba(251,247,242,.28)', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© 2026 GiftSoul. Made with love in India.</span>
          <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {['Verified · SSL Secure', 'UPI', 'Visa', 'Mastercard'].map(b => (
              <span key={b} style={{ padding: '.3rem .7rem', border: '1px solid rgba(255,255,255,.1)', borderRadius: '6px', fontSize: '.68rem', color: 'rgba(251,247,242,.4)' }}>{b}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatWord {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .reveal {
          opacity: 0; transform: translateY(24px);
          transition: opacity .65s cubic-bezier(0.22,1,0.36,1), transform .65s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 55%"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: 1fr 1.2fr"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          nav { padding: 0 1.5rem !important; }
          section { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          footer { padding: 3rem 1.5rem 2rem !important; }
          footer > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}