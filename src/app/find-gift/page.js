'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const EXAMPLES = [
  "My best friend just got her dream job after years of trying. She loves plants and always lights a candle while she works. I want something that feels like a warm hug.",
  "My grandmother passed away last month and my mother is devastated. She used to cook with her every Sunday. I want to give her something that honours that memory.",
  "My little brother is graduating from college and moving to a new city alone. I want something that reminds him home is always with him.",
  "I said something hurtful to my best friend and want to apologise properly. She loves handmade things and meaningful gestures over grand ones.",
]

const LOADING_MSGS = [
  'Reading your story…',
  'Detecting the emotion…',
  'Searching 200+ handmade gifts…',
  'Matching to the perfect makers…',
  'Almost there…',
]

const CATEGORY_ICON = {
  'Candles': '🕯️', 'Macramé': '🌿', 'Resin art': '💌',
  'Pottery': '🏺', 'Jewellery': '💍', 'Skincare': '🧴',
  'Cards': '✉️', 'Crochet': '🧶', 'Gift hampers': '🎁',
  'Plants': '🪴', 'Paintings': '🎨', 'Embroidery': '🌸',
}
const CARD_BG = ['#FFF3E0', '#E8F5E9', '#FCE4EC', '#E3F2FD']

export default function FindGift() {
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadMsg, setLoadMsg] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Gift box state
  const [boxPhase, setBoxPhase] = useState('idle') // idle | shaking | open | done
  const [sparkles, setSparkles] = useState([])
  const intervalRef = useRef(null)

  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }), { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal, .reveal-scale').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [result])

  async function findGifts() {
    if (story.trim().length < 20) {
      setError('Please share a bit more — the more honest, the better the match.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)

    // Start gift box animation
    setBoxPhase('shaking')
    let msgIdx = 0
    setLoadMsg(LOADING_MSGS[0])
    intervalRef.current = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length
      setLoadMsg(LOADING_MSGS[msgIdx])
    }, 1400)

    try {
      const res = await fetch('/api/suggest-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setBoxPhase('idle')
      } else {
        // Open the box with sparkles
        setBoxPhase('open')
        const sp = Array.from({ length: 8 }, (_, i) => ({
          id: i,
          top: `${20 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 80}%`,
          delay: `${i * 0.12}s`,
          size: `${6 + Math.random() * 10}px`,
          color: ['#B5622A', '#D4856A', '#C4A882', '#EDE6DA'][i % 4],
        }))
        setSparkles(sp)

        setTimeout(() => {
          setBoxPhase('done')
          setResult(data)
          setLoading(false)
        }, 900)
      }
    } catch (e) {
      setError('Network error — please try again.')
      setBoxPhase('idle')
    } finally {
      clearInterval(intervalRef.current)
      if (!result) setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setStory('')
    setError('')
    setBoxPhase('idle')
    setSparkles([])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="scrolled" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', zIndex: 500, background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(16px)', boxShadow: '0 1px 0 #D9CDB8' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.65rem', fontWeight: 400, color: '#3D2B1F', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#B5622A' }}>Soul</em>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A6A5A', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A6A5A', textDecoration: 'none' }}>Creators</Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#3D2B1F', color: '#F7F3EE', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none' }}>Join as creator</Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <div style={{ background: '#3D2B1F', padding: 'calc(70px + 3rem) 5rem 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 75% 40%, rgba(181,98,42,.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1rem', position: 'relative' }}>AI-powered gift matching</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 300, color: '#F7F3EE', lineHeight: 1.1, marginBottom: '1rem', position: 'relative' }}>
          Tell us the story.<br />
          <em style={{ fontStyle: 'italic', color: '#D4856A' }}>We&apos;ll find the gift.</em>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(247,243,238,.5)', maxWidth: '520px', lineHeight: 1.8, position: 'relative' }}>
          Our AI reads emotion, not just keywords. Describe the person, the moment, the feeling — and we match handcrafted gifts from real Indian makers that truly fit.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* ── STORY INPUT ──────────────────────────────── */}
        {!result && (
          <>
            <div style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 24px rgba(61,43,31,.07)', marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1.2rem', left: '1.5rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '5rem', color: '#EDE6DA', lineHeight: 1, pointerEvents: 'none' }}>&ldquo;</div>
              <div style={{ fontSize: '.7rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '.8rem' }}>Share your story</div>
              <textarea
                value={story}
                onChange={e => { setStory(e.target.value); setError('') }}
                placeholder="Write freely — the more honest, the better. Tell us about the person you're gifting, what they're going through, what they love, and what you want them to feel…"
                rows={6}
                style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', lineHeight: 1.75, color: '#3D2B1F', background: 'transparent', resize: 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #EDE6DA', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '.78rem', color: '#C4A882' }}>
                  {story.length} characters {story.length < 50 ? '— keep going…' : story.length < 100 ? '— almost there…' : '— perfect!'}
                </div>
                <button
                  onClick={findGifts}
                  disabled={loading}
                  style={{ padding: '.8rem 2.2rem', background: loading ? '#C4A882' : '#B5622A', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all .2s', display: 'flex', alignItems: 'center', gap: '.6rem', minWidth: '200px', justifyContent: 'center' }}>
                  {loading
                    ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .8s linear infinite' }} /> Finding gifts…</>
                    : 'Find the perfect gift →'
                  }
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF3EE', border: '1px solid rgba(181,98,42,.3)', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1.5rem', fontSize: '.88rem', color: '#B5622A' }}>
                {error}
              </div>
            )}
          </>
        )}

        {/* ── GIFT BOX LOADING ──────────────────────────── */}
        {loading && (
          <div style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>

            {/* Sparkles */}
            {sparkles.map(s => (
              <div key={s.id} style={{
                position: 'absolute',
                top: s.top, left: s.left,
                width: s.size, height: s.size,
                background: s.color,
                borderRadius: '50%',
                animationDelay: s.delay,
                animation: 'sparkle 1s ease-in-out infinite',
              }} />
            ))}

            {/* Gift Box SVG */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <svg
                width="120" height="130"
                viewBox="0 0 120 130"
                style={{
                  animation: boxPhase === 'shaking'
                    ? 'giftShake .6s ease-in-out infinite'
                    : 'none',
                  filter: 'drop-shadow(0 8px 24px rgba(181,98,42,.25))',
                }}
              >
                {/* Lid */}
                <g style={{
                  animation: boxPhase === 'open' ? 'lidFly .6s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
                  transformOrigin: '60px 15px',
                }}>
                  <rect x="5" y="10" width="110" height="32" rx="6" fill="#B5622A" />
                  <rect x="52" y="10" width="16" height="32" fill="rgba(255,255,255,.25)" />
                  {/* Bow */}
                  <ellipse cx="60" cy="10" rx="20" ry="8" fill="#D4856A" />
                  <ellipse cx="60" cy="10" rx="20" ry="8" fill="#D4856A" transform="rotate(90 60 10)" />
                  <circle cx="60" cy="10" r="6" fill="#C4A882" />
                </g>

                {/* Body */}
                <rect x="10" y="42" width="100" height="76" rx="4" fill="#8C4519" />
                <rect x="52" y="42" width="16" height="76" fill="rgba(255,255,255,.15)" />

                {/* Shine */}
                <rect x="18" y="50" width="8" height="40" rx="4" fill="rgba(255,255,255,.1)" />
              </svg>
            </div>

            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#3D2B1F', marginBottom: '.4rem', transition: 'all .3s' }}>{loadMsg}</p>
            <p style={{ fontSize: '.82rem', color: '#7A6A5A' }}>Our AI is reading the emotion in your story</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.5rem' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: '#B5622A',
                  animation: `float 1.2s ease-in-out ${i * .2}s infinite`,
                  opacity: .5,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────── */}
        {result && !loading && (
          <div>
            {/* Emotion analysis */}
            <div className="ai-result-panel" style={{ background: '#3D2B1F', borderRadius: '24px', padding: '2rem', marginBottom: '1.8rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(181,98,42,.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '.68rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#C4A882' }}>Emotion detected</div>
                  {Array.isArray(result.emotions) && result.emotions.map((em, i) => (
                    <span key={em} className="ai-emotion-badge" style={{ animationDelay: `${i * .1}s` }}>{em}</span>
                  ))}
                  {result.tone && (
                    <span style={{ padding: '.3rem 1rem', borderRadius: '2rem', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(247,243,238,.6)', fontSize: '.75rem' }}>tone: {result.tone}</span>
                  )}
                </div>

                {result.message && (
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.18rem', lineHeight: 1.8, color: '#F7F3EE', marginBottom: '1.2rem', fontStyle: 'italic' }}>
                    &ldquo;{result.message}&rdquo;
                  </p>
                )}

                {result.gift_note && (
                  <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: '12px', padding: '.9rem 1.1rem', fontSize: '.82rem', color: 'rgba(247,243,238,.65)', borderLeft: '2px solid #B5622A' }}>
                    💌 <strong style={{ color: 'rgba(247,243,238,.85)' }}>Card tip:</strong> {result.gift_note}
                  </div>
                )}
              </div>
            </div>

            {/* Gift cards */}
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 300, color: '#3D2B1F', marginBottom: '.3rem' }}>
                Handpicked for <em style={{ fontStyle: 'italic', color: '#B5622A' }}>{result.recipient || 'this moment'}</em>
              </h2>
              <p style={{ fontSize: '.85rem', color: '#7A6A5A', marginBottom: '1.5rem' }}>Matched by emotion · Made by hand in India</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {Array.isArray(result.suggestions) && result.suggestions.map((g, i) => (
                <div
                  key={i}
                  className="gift-card-reveal"
                  style={{
                    animationDelay: `${i * .12}s`,
                    background: 'white',
                    border: '1px solid #D9CDB8',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform .25s, box-shadow .25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(61,43,31,.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {i === 0 && (
                    <div style={{ position: 'absolute', top: '.75rem', left: '.75rem', zIndex: 2, fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '.25rem .75rem', borderRadius: '2rem', background: '#B5622A', color: 'white' }}>
                      ✦ Best match
                    </div>
                  )}
                  <div style={{ height: '190px', background: CARD_BG[i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '68px', transition: 'transform .25s' }}>
                    {g.icon || CATEGORY_ICON[g.category] || '🎁'}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    {Array.isArray(g.emotion_tags) && g.emotion_tags.length > 0 && (
                      <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#B5622A', marginBottom: '.45rem' }}>
                        {g.emotion_tags.slice(0, 2).join(' · ')}
                      </div>
                    )}
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#3D2B1F', marginBottom: '.3rem', lineHeight: 1.3 }}>
                      {g.name || 'Handmade gift'}
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#7A6A5A', marginBottom: '1rem' }}>
                      by {g.by || (g.creators && g.creators.shop_name) || 'Artisan'} · {g.city || (g.creators && g.creators.city) || 'India'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#3D2B1F' }}>
                        {g.price || (g.base_price ? `₹${g.base_price}` : '₹500')}
                      </span>
                      <Link href="/product" style={{ padding: '.45rem 1.1rem', background: '#B5622A', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.75rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                        View gift →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', padding: '1.2rem 0', borderTop: '1px solid #D9CDB8' }}>
              <button onClick={reset} style={{ padding: '.7rem 1.8rem', border: '1px solid #D9CDB8', borderRadius: '2rem', background: 'white', color: '#3D2B1F', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#B5622A'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#D9CDB8'}>
                ← Try a different story
              </button>
              <Link href="/marketplace" style={{ padding: '.7rem 1.8rem', background: '#3D2B1F', color: '#F7F3EE', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem', fontFamily: 'DM Sans, sans-serif' }}>
                Browse all gifts →
              </Link>
            </div>
          </div>
        )}

        {/* ── EXAMPLES ─────────────────────────────────── */}
        {!result && !loading && (
          <div style={{ marginTop: '2.5rem' }}>
            <p style={{ fontSize: '.72rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C4A882', marginBottom: '1rem' }}>Need inspiration? Try one of these</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
              {EXAMPLES.map((s, i) => (
                <button key={i} onClick={() => setStory(s)}
                  style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '16px', padding: '1.2rem 1.4rem', textAlign: 'left', cursor: 'pointer', transition: 'all .2s', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#7A6A5A', lineHeight: 1.6 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5622A'; e.currentTarget.style.color = '#3D2B1F'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#D9CDB8'; e.currentTarget.style.color = '#7A6A5A'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <span style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#C4A882', display: 'block', marginBottom: '.5rem' }}>Example {i + 1}</span>
                  &ldquo;{s.slice(0, 120)}…&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <div style={{ background: '#EDE6DA', borderTop: '1px solid #D9CDB8', padding: '5rem' }}>
        <p className="reveal eyebrow" style={{ marginBottom: '1rem' }}>How the AI works</p>
        <h2 className="reveal section-title" style={{ marginBottom: '3rem' }}>
          More than keywords —<br />it reads <em>meaning</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: '900px' }}>
          {[
            { n: '01', title: 'You share a story', desc: 'Write naturally — describe the person, the moment, the relationship. No need to mention gift ideas.' },
            { n: '02', title: 'AI reads emotion', desc: 'Our AI detects the underlying emotion — grief, pride, nostalgia, joy — not just surface-level words.' },
            { n: '03', title: 'Gifts are matched', desc: 'Products are tagged by emotion. The best emotional matches surface instantly for you.' },
            { n: '04', title: 'Makers are real', desc: 'Every suggestion comes from a verified Indian artisan who made it by hand. Message them directly.' },
          ].map((s, i) => (
            <div key={s.n} className="reveal" style={{ background: 'white', border: '1px solid #D9CDB8', borderRadius: '16px', padding: '1.5rem', transitionDelay: `${i * .1}s` }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, color: '#D9CDB8', lineHeight: 1, marginBottom: '.8rem' }}>{s.n}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#3D2B1F', marginBottom: '.6rem' }}>{s.title}</h3>
              <p style={{ fontSize: '.85rem', color: '#7A6A5A', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ background: '#3D2B1F', padding: '3rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: '#F7F3EE' }}>
            Gift<em style={{ fontStyle: 'italic', color: '#D4856A' }}>Soul</em>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Find a gift', '/find-gift'], ['Marketplace', '/marketplace'], ['Creators', '/creators']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: '.82rem', color: 'rgba(247,243,238,.45)', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(247,243,238,.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(247,243,238,.45)'}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '.75rem', color: 'rgba(247,243,238,.28)' }}>
          © 2026 GiftSoul · Powered by AI · Made with love in India.
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes giftShake {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-4deg); }
          30% { transform: rotate(4deg); }
          45% { transform: rotate(-3deg); }
          60% { transform: rotate(3deg); }
          75% { transform: rotate(-1deg); }
        }
        @keyframes lidFly {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          60%  { transform: translateY(-80px) rotate(-20deg); opacity: 1; }
          100% { transform: translateY(-120px) rotate(-30deg); opacity: 0; }
        }
        @keyframes giftFloat {
          0%   { transform: translateY(20px) scale(.88); opacity: 0; }
          60%  { transform: translateY(-6px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes fadeSlideUp {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ai-result-panel { animation: fadeSlideUp .5s cubic-bezier(0.22,1,0.36,1) both; }
        .ai-emotion-badge { animation: fadeSlideUp .4s cubic-bezier(0.22,1,0.36,1) both; }
        .gift-card-reveal { animation: giftFloat .55s cubic-bezier(0.34,1.56,0.64,1) both; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s cubic-bezier(0.22,1,0.36,1), transform .65s cubic-bezier(0.22,1,0.36,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </div>
  )
}