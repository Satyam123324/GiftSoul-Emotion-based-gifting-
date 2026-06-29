'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

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
  { icon: '🕯️', bg: '#FFF3E0', emotion: 'Celebration · Self-care', name: 'Hand-poured lavender soy candle', by: "Sneha's Nook · Jaipur", price: '₹480', lead: '5 days' },
  { icon: '🌿', bg: '#E8F5E9', emotion: 'Gratitude · New beginnings', name: 'Handwoven macramé wall hanging', by: 'Thread & Knot · Kochi', price: '₹1,200', lead: '3 days' },
  { icon: '💌', bg: '#FCE4EC', emotion: 'Love · Nostalgia', name: 'Resin keepsake memory box', by: 'Crystal Craft · Pune', price: '₹890', lead: '7 days' },
]

const CREATORS = [
  { init: 'S', name: 'Sneha Patel', city: 'Jaipur', craft: 'Soy candles', bg: '#FFF3E0' },
  { init: 'M', name: 'Meera Krishnan', city: 'Kochi', craft: 'Macramé', bg: '#E8F5E9' },
  { init: 'P', name: 'Priya Sharma', city: 'Pune', craft: 'Resin art', bg: '#FCE4EC' },
  { init: 'A', name: 'Arjun Nair', city: 'Bengaluru', craft: 'Pottery', bg: '#E3F2FD' },
]

const TESTIMONIALS = [
  { stars: '★★★★★', text: 'I typed three sentences about my mother\'s retirement and GiftSoul found her the most perfect pottery bowl. She cried when she opened it.', name: 'Riya Desai', city: 'Mumbai' },
  { stars: '★★★★★', text: 'Every gift I\'ve given from here has made someone cry — in the best possible way. The emotion matching is scary accurate.', name: 'Kabir Mehta', city: 'Delhi' },
  { stars: '★★★★★', text: 'As a creator, GiftSoul brings me buyers who actually understand what I make. Every sale feels meaningful.', name: 'Sneha Patel', city: 'Jaipur (creator)' },
]

export default function Home() {
  const [story, setStory] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [activeEmotion, setActiveEmotion] = useState('love')
  const [scrolled, setScrolled] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  // Nav scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Parallax mouse tracking
  useEffect(() => {
    const onMove = e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

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
    <div style={{ minHeight: '100vh', background: '#F7F3EE', overflowX: 'hidden' }}>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {[['Browse gifts', '/marketplace'], ['By emotion', '/marketplace'], ['Creators', '/creators']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A6A5A', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#B5622A'}
              onMouseLeave={e => e.currentTarget.style.color = '#7A6A5A'}>
              {label}
            </Link>
          ))}
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#3D2B1F', color: '#F7F3EE', borderRadius: '2rem', fontSize: '.78rem', letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#B5622A'}
            onMouseLeave={e => e.currentTarget.style.background = '#3D2B1F'}>
            Join as creator
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '55% 45%', overflow: 'hidden' }}>

        {/* Left — story input */}
        <div style={{ padding: 'calc(70px + 5rem) 4rem 5rem 5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '1.6rem', animation: 'fadeUp .6s .1s both' }}>
            Emotion-based gifting · Made in India
          </p>

          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 5vw, 5.5rem)', fontWeight: 300, lineHeight: 1.06, color: '#3D2B1F', marginBottom: '1.6rem', animation: 'fadeUp .6s .2s both' }}>
            Every gift tells<br />
            <em style={{ fontStyle: 'italic', color: '#B5622A' }}>someone&apos;s story</em>
          </h1>

          <p style={{ fontSize: '1rem', color: '#7A6A5A', lineHeight: 1.8, maxWidth: '440px', fontWeight: 300, marginBottom: '2.8rem', animation: 'fadeUp .6s .3s both' }}>
            Share a moment, a memory, a feeling. Our AI finds handcrafted gifts made by real artisans — chosen for the emotion, not the occasion.
          </p>

          {/* Story box */}
          <div style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '20px', padding: '1.5rem', maxWidth: '520px', boxShadow: '0 4px 24px rgba(61,43,31,.09)', position: 'relative', animation: 'fadeUp .6s .4s both', transition: 'box-shadow .25s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 36px rgba(61,43,31,.13)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(61,43,31,.09)'}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '.5rem' }}>Tell us your story</div>
            <textarea
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="My best friend just got her dream job after years of trying. She loves plants and always lights a candle while she works. I want something that feels like a warm hug…"
              rows={4}
              style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', lineHeight: 1.65, color: '#3D2B1F', background: 'transparent', resize: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #EDE6DA', flexWrap: 'wrap', gap: '.8rem' }}>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {['celebration', 'gratitude', 'love', 'comfort'].map(tag => (
                  <span key={tag}
                    onClick={e => { const el = e.target; el.dataset.active = el.dataset.active === '1' ? '' : '1'; el.style.background = el.dataset.active === '1' ? '#B5622A' : 'transparent'; el.style.color = el.dataset.active === '1' ? 'white' : '#7A6A5A'; el.style.borderColor = el.dataset.active === '1' ? '#B5622A' : '#D9CDB8' }}
                    style={{ padding: '.3rem .9rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #D9CDB8', color: '#7A6A5A', cursor: 'pointer', transition: 'all .18s', userSelect: 'none' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => { if (story.length > 8) setShowResult(true) }}
                style={{ padding: '.65rem 1.5rem', background: '#B5622A', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.82rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#8C4519'; e.currentTarget.style.transform = 'scale(1.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#B5622A'; e.currentTarget.style.transform = 'scale(1)' }}>
                Find gifts →
              </button>
            </div>
          </div>

          {/* Quick result preview */}
          {showResult && (
            <div style={{ marginTop: '1rem', background: '#EDE6DA', border: '1px solid #D9CDB8', borderRadius: '12px', padding: '1.2rem', maxWidth: '520px', animation: 'fadeUp .4s both' }}>
              <div style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '.8rem' }}>Suggested — celebration + warmth</div>
              <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                {[{ icon: '🕯️', name: 'Soy candle', by: "Sneha's Nook", price: '₹480' },
                  { icon: '🌿', name: 'Terrarium kit', by: 'Green Things', price: '₹750' },
                  { icon: '✉️', name: 'Card set', by: 'Paper & Pen', price: '₹320' }
                ].map(g => (
                  <div key={g.name} style={{ flex: 1, minWidth: '110px', background: 'white', borderRadius: '10px', padding: '.8rem', border: '1px solid #D9CDB8' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '.3rem' }}>{g.icon}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#3D2B1F' }}>{g.name}</div>
                    <div style={{ fontSize: '.7rem', color: '#7A6A5A' }}>{g.by}</div>
                    <div style={{ fontSize: '.78rem', color: '#B5622A', fontWeight: 500, marginTop: '.2rem' }}>{g.price}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '.8rem', textAlign: 'right' }}>
                <Link href="/find-gift" style={{ fontSize: '.78rem', color: '#B5622A', textDecoration: 'none', borderBottom: '1px solid #C4A882' }}>
                  See AI suggestions →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right — animated decorative panel */}
        <div style={{ background: '#EDE6DA', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(196,168,130,.4) 0%, transparent 60%)' }} />

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
              color: '#C4A882',
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
              border: '1px solid #D9CDB8',
              borderRadius: '14px',
              padding: '1rem 1.2rem',
              boxShadow: '0 8px 32px rgba(61,43,31,.1)',
              width: '165px',
              top: c.top, left: c.left, right: c.right, bottom: c.bottom,
              transform: `rotate(${c.rot}) translate(${mousePos.x * (i % 2 === 0 ? 0.3 : -0.3)}px, ${mousePos.y * 0.3}px)`,
              transition: 'transform .1s linear',
              animation: `cardFloat ${3 + i * 0.8}s ${c.delay} ease-in-out infinite`,
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '.5rem' }}>{c.icon}</div>
              <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '.3rem' }}>{c.label}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#3D2B1F' }}>{c.name}</div>
              <div style={{ fontSize: '.8rem', color: '#B5622A', marginTop: '.2rem' }}>{c.price}</div>
              <div style={{ fontSize: '.68rem', color: '#7A6A5A' }}>by {c.by}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────── */}
      <div style={{ background: '#EDE6DA', borderTop: '1px solid #D9CDB8', borderBottom: '1px solid #D9CDB8', padding: '1.25rem 4rem', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap', overflowX: 'auto' }}>
        {[['200+', 'verified creators'], ['AI-powered', 'emotion matching'], ['Ships', 'across India'], ['Every gift', 'made by hand'], ['Custom orders', 'welcome']].map(([strong, text], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', whiteSpace: 'nowrap' }}>
            {i > 0 && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C4A882', flexShrink: 0, marginRight: '-.4rem' }} />}
            <strong style={{ fontSize: '.82rem', color: '#3D2B1F' }}>{strong}</strong>
            <span style={{ fontSize: '.82rem', color: '#7A6A5A' }}>{text}</span>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5622A' }} />
          How it works
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#3D2B1F', marginBottom: '4rem', maxWidth: '520px' }}>
          Gifting that actually <em style={{ fontStyle: 'italic', color: '#B5622A' }}>means something</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem' }}>
          {[
            { n: '01', title: 'Share your story', desc: 'Write a few lines about the person, the moment, or the feeling. The more honest, the better.' },
            { n: '02', title: 'AI reads the emotion', desc: 'Our AI understands context, not just keywords — it detects grief, pride, nostalgia and finds what truly fits.' },
            { n: '03', title: 'Get matched to makers', desc: 'Real artisans matched to your emotion. Every gift comes with their story, their craft, their care.' },
          ].map((s, i) => (
            <div key={s.n} className="reveal" style={{ transitionDelay: `${i * .1}s` }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4.5rem', fontWeight: 300, color: '#D9CDB8', lineHeight: 1, marginBottom: '.8rem' }}>{s.n}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 400, color: '#3D2B1F', marginBottom: '.7rem' }}>{s.title}</h3>
              <p style={{ fontSize: '.88rem', color: '#7A6A5A', lineHeight: 1.75, fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: '3rem' }}>
          <Link href="/find-gift" style={{ padding: '.85rem 2.2rem', background: '#B5622A', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.82rem', letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', display: 'inline-block', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#8C4519'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#B5622A'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Try the AI matcher →
          </Link>
        </div>
      </section>

      {/* ── FEATURED GIFTS ───────────────────────────────── */}
      <section style={{ padding: '5rem', background: '#F7F3EE' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <span style={{ display: 'block', width: 24, height: 1, background: '#B5622A' }} />Featured gifts
            </p>
            <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#3D2B1F' }}>
              Gifts chosen by <em style={{ fontStyle: 'italic', color: '#B5622A' }}>emotion</em>
            </h2>
          </div>
          <Link href="/marketplace" className="reveal" style={{ padding: '.75rem 1.8rem', border: '1px solid #D9CDB8', borderRadius: '2rem', color: '#3D2B1F', textDecoration: 'none', fontSize: '.82rem', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5622A'; e.currentTarget.style.color = '#B5622A' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#D9CDB8'; e.currentTarget.style.color = '#3D2B1F' }}>
            Browse all →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {FEATURED.map((g, i) => (
            <Link key={g.name} href="/product" className="reveal"
              style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'all .25s', transitionDelay: `${i * .1}s` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(61,43,31,.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ height: '220px', background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>{g.icon}</div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '.5rem' }}>{g.emotion}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#3D2B1F', marginBottom: '.3rem' }}>{g.name}</div>
                <div style={{ fontSize: '.72rem', color: '#7A6A5A', marginBottom: '.6rem' }}>by {g.by}</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#3D2B1F' }}>{g.price} <span style={{ fontSize: '.72rem', color: '#7A6A5A', fontWeight: 300 }}>{g.lead}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CREATORS ────────────────────────────────────── */}
      <section style={{ background: '#3D2B1F', padding: '6rem 5rem' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#C4A882' }} />Meet the makers
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#F7F3EE', margin: '1rem 0 3rem' }}>
          Gifts made by <em style={{ fontStyle: 'italic', color: '#D4856A' }}>real hands</em>,<br />in real homes across India
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {CREATORS.map((c, i) => (
            <Link key={c.name} href="/creator-profile" className="reveal"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '20px', padding: '1.4rem', textDecoration: 'none', display: 'block', transition: 'all .22s', transitionDelay: `${i * .08}s` }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.09)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#3D2B1F', marginBottom: '.9rem' }}>{c.init}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#F7F3EE', marginBottom: '.15rem' }}>{c.name}</div>
              <div style={{ fontSize: '.7rem', color: 'rgba(247,243,238,.38)', marginBottom: '.7rem' }}>{c.city}</div>
              <span style={{ fontSize: '.7rem', padding: '.25rem .7rem', background: 'rgba(196,168,130,.15)', border: '1px solid rgba(196,168,130,.25)', borderRadius: '2rem', color: '#C4A882' }}>{c.craft}</span>
            </Link>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center' }}>
          <Link href="/creators" style={{ display: 'inline-block', padding: '.85rem 2.2rem', border: '1px solid rgba(247,243,238,.3)', borderRadius: '2rem', color: '#F7F3EE', textDecoration: 'none', fontSize: '.82rem', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C4A882'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(247,243,238,.3)'}>
            Browse all 200+ creators →
          </Link>
        </div>
      </section>

      {/* ── EMOTIONS ────────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'center' }}>
        <div>
          <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span style={{ display: 'block', width: 24, height: 1, background: '#B5622A' }} />Browse by feeling
          </p>
          <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#3D2B1F', margin: '1rem 0 1.2rem' }}>
            Don&apos;t know what to get? Start with <em style={{ fontStyle: 'italic', color: '#B5622A' }}>how you feel</em>
          </h2>
          <p className="reveal" style={{ fontSize: '.9rem', color: '#7A6A5A', lineHeight: 1.8, fontWeight: 300, maxWidth: '380px', marginBottom: '2rem' }}>
            Every gift on GiftSoul is tagged by the human emotion it suits best.
          </p>
          <Link href="/marketplace" className="reveal" style={{ padding: '.85rem 2.2rem', background: '#3D2B1F', color: '#F7F3EE', borderRadius: '2rem', textDecoration: 'none', fontSize: '.82rem', display: 'inline-block', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#B5622A'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#3D2B1F'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Explore marketplace →
          </Link>
        </div>
        <div className="reveal" style={{ background: '#EDE6DA', border: '1px solid #D9CDB8', borderRadius: '32px', padding: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '.8rem' }}>
          {EMOTIONS.map((em, i) => (
            <button key={em}
              onClick={() => setActiveEmotion(em)}
              style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                borderRadius: '2rem', border: '1px solid #D9CDB8',
                background: activeEmotion === em ? '#B5622A' : 'white',
                color: activeEmotion === em ? 'white' : '#3D2B1F',
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

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem', background: '#EDE6DA' }}>
        <p className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#B5622A' }} />What people say
        </p>
        <h2 className="reveal" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300, color: '#3D2B1F', marginTop: '.8rem', marginBottom: '3rem' }}>
          Stories behind <em style={{ fontStyle: 'italic', color: '#B5622A' }}>the gifts</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="reveal"
              style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '20px', padding: '2rem', transitionDelay: `${i * .1}s` }}>
              <div style={{ color: '#B5622A', marginBottom: '1rem', fontSize: '.9rem' }}>{t.stars}</div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', lineHeight: 1.7, color: '#3D2B1F', marginBottom: '1.2rem', fontStyle: 'italic' }}>{t.text}</p>
              <div style={{ fontSize: '.78rem', color: '#7A6A5A' }}>
                <strong style={{ color: '#3D2B1F', fontWeight: 500 }}>{t.name}</strong> · {t.city}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '7rem 5rem', textAlign: 'center', background: '#B5622A', position: 'relative', overflow: 'hidden' }}>
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
      <footer style={{ background: '#3D2B1F', padding: '5rem 4rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#F7F3EE' }}>Gift<em style={{ fontStyle: 'italic', color: '#D4856A' }}>Soul</em></div>
            <div style={{ fontSize: '.82rem', color: 'rgba(247,243,238,.38)', marginTop: '.5rem', lineHeight: 1.6 }}>Gifts that carry emotion,<br />made by hand across India.</div>
          </div>
          {[
            { title: 'Platform', links: [['Browse gifts', '/marketplace'], ['By emotion', '/marketplace'], ['Creators', '/creators']] },
            { title: 'Creators', links: [['Join as creator', '/creator-register'], ['Dashboard', '/dashboard']] },
            { title: 'Company', links: [['About GiftSoul', '#'], ['Instagram', '#'], ['Contact', '#']] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1.1rem' }}>{col.title}</h4>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} style={{ display: 'block', fontSize: '.85rem', color: 'rgba(247,243,238,.45)', textDecoration: 'none', marginBottom: '.55rem', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(247,243,238,.9)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(247,243,238,.45)'}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'rgba(247,243,238,.28)', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© 2026 GiftSoul. Made with love in India.</span>
          <span>Powered by AI · Groq + LLaMA 3</span>
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
          nav { padding: 0 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}