'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Sparkles from '../components/Sparkles'

const EXAMPLE_STORIES = [
  "My best friend just got her dream job after years of trying. She loves plants and always lights a candle while she works. I want something warm and meaningful.",
  "My grandmother passed away last month and my mother is devastated. She used to cook with her every Sunday. I want to give her something that honours that memory.",
  "My little brother is graduating from college and moving to a new city alone. I want something that reminds him home is always with him.",
  "I said something hurtful to my best friend and want to apologise properly. She loves handmade things and meaningful gestures over grand ones."
]

export default function FindGift() {
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [boxOpen, setBoxOpen] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      }), { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  async function findGifts() {
    if (story.trim().length < 20) {
      setError('Please share a bit more about the person or situation.')
      return
    }
    setError('')
    setResult(null)
    setBoxOpen(false)
    setLoading(true)

    try {
      const res = await fetch('/api/suggest-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story })
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      setTimeout(() => {
        setLoading(false)
        setResult(data)
        setTimeout(() => setBoxOpen(true), 100)
      }, 600)

    } catch (e) {
      setError('Network error: ' + e.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', zIndex: 500, background: 'rgba(251,247,242,.95)', backdropFilter: 'blur(16px)', boxShadow: '0 1px 0 #F3E8DC' }}>
        <Link href="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.65rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Creators</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#2B2019', padding: 'calc(70px + 3rem) 5rem 3rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem' }}>AI-powered gift matching</p>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, color: '#FBF7F2', lineHeight: 1.1, marginBottom: '1rem' }}>
          Tell us the story.<br />
          <em style={{ fontStyle: 'italic', color: '#C99A54' }}>We&apos;ll find the gift.</em>
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(251,247,242,.5)', maxWidth: '520px', lineHeight: 1.8 }}>
          Our AI reads emotion, not just keywords. Describe the person, the moment, the feeling.
        </p>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* STORY INPUT BOX */}
        <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 24px rgba(43,32,25,.07)', marginBottom: '1.5rem', position: 'relative' }}>
          <div style={{ fontSize: '.7rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '.8rem' }}>Share your story</div>
          <textarea
            value={story}
            onChange={e => { setStory(e.target.value); setError('') }}
            placeholder="Write freely — describe the person, what they mean to you, what you want them to feel..."
            rows={6}
            style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.15rem', lineHeight: 1.75, color: '#2B2019', background: 'transparent', resize: 'none' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E4D3BE', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '.78rem', color: '#C99A54' }}>
              {story.length} characters {story.length < 50 ? '— keep going...' : story.length < 100 ? '— a bit more...' : '— great!'}
            </div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Sparkles count={4} color="#C99A54" />
              <button
                onClick={findGifts}
                disabled={loading}
                style={{ padding: '.75rem 2rem', background: loading ? '#C99A54' : '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.9rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, minWidth: '180px', position: 'relative', zIndex: 2, transition: 'transform .15s ease, box-shadow .25s ease' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(181,83,60,.35)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {loading ? 'Finding gifts...' : 'Find the perfect gift →'}
              </button>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1.5rem', fontSize: '.88rem', color: '#B5533C' }}>
            {error}
          </div>
        )}

        {/* LOADING — GIFT BOX SHAKING */}
        {loading && (
          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '3rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '64px', animation: 'wobbleBox 0.7s ease-in-out infinite' }}>
                🎁
              </div>
            </div>
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#2B2019', marginBottom: '.4rem' }}>Reading your story...</p>
            <p style={{ fontSize: '.82rem', color: '#7C6B60' }}>Our AI is detecting the emotion</p>
          </div>
        )}

        {/* RESULTS — GIFT BOX OPENED */}
        {result && !loading && (
          <div>
            {/* Opening gift box visual — sparkles appear once box opens */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', height: '90px', position: 'relative' }}>
              {boxOpen && <Sparkles count={10} color="#C99A54" />}

              <div style={{
                fontSize: '56px',
                position: 'absolute',
                opacity: boxOpen ? 0 : 1,
                transform: boxOpen ? 'scale(0.6) translateY(10px)' : 'scale(1)',
                transition: 'opacity .4s ease, transform .4s ease',
                zIndex: 2
              }}>
                📦
              </div>
              <div style={{
                fontSize: '56px',
                position: 'absolute',
                opacity: boxOpen ? 1 : 0,
                transform: boxOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.6)',
                transition: 'opacity .5s ease .15s, transform .5s cubic-bezier(.34,1.56,.64,1) .15s',
                zIndex: 2
              }}>
                🎉
              </div>
            </div>

            {/* Emotion analysis card */}
            <div
              style={{
                background: '#2B2019', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem',
                position: 'relative', overflow: 'hidden',
                opacity: boxOpen ? 1 : 0,
                transform: boxOpen ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity .5s ease .2s, transform .5s ease .2s'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(181,83,60,.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '.68rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#C99A54' }}>Emotion detected</div>
                  {Array.isArray(result.emotions) && result.emotions.map((em, i) => (
                    <span
                      key={em}
                      style={{
                        padding: '.3rem 1rem', borderRadius: '2rem', background: 'rgba(181,83,60,.2)',
                        border: '1px solid rgba(181,83,60,.4)', color: '#C99A54', fontSize: '.8rem',
                        fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic',
                        opacity: boxOpen ? 1 : 0,
                        transform: boxOpen ? 'scale(1) translateY(0)' : 'scale(.6) translateY(8px)',
                        transition: `opacity .45s ease ${0.3 + i * 0.1}s, transform .45s cubic-bezier(.34,1.56,.64,1) ${0.3 + i * 0.1}s`
                      }}
                    >
                      {em}
                    </span>
                  ))}
                </div>
                {result.message && (
                  <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.15rem', lineHeight: 1.75, color: '#FBF7F2', marginBottom: '1rem', fontStyle: 'italic' }}>
                    &ldquo;{result.message}&rdquo;
                  </p>
                )}
                {result.gift_note && (
                  <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: '12px', padding: '.8rem 1rem', fontSize: '.82rem', color: 'rgba(251,247,242,.6)', borderLeft: '2px solid #B5533C' }}>
                    💌 <strong style={{ color: 'rgba(251,247,242,.8)' }}>Card tip:</strong> {result.gift_note}
                  </div>
                )}
              </div>
            </div>

            {/* Gift suggestions heading */}
            <div
              style={{
                marginBottom: '1rem',
                opacity: boxOpen ? 1 : 0,
                transform: boxOpen ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity .5s ease .4s, transform .5s ease .4s'
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#2B2019', marginBottom: '.4rem' }}>
                Handpicked gifts for <em style={{ fontStyle: 'italic', color: '#B5533C' }}>{result.recipient || 'this moment'}</em>
              </h2>
              <p style={{ fontSize: '.85rem', color: '#7C6B60' }}>Matched by emotion · Made by hand in India</p>
            </div>

            {/* Gift cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {Array.isArray(result.suggestions) && result.suggestions.map((g, i) => (
                <div
                  key={i}
                  style={{
                    background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', overflow: 'hidden',
                    position: 'relative',
                    opacity: boxOpen ? 1 : 0,
                    transform: boxOpen ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity .55s ease ${0.5 + i * 0.12}s, transform .55s ease ${0.5 + i * 0.12}s, box-shadow .25s ease`
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(43,32,25,.14)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = boxOpen ? 'translateY(0)' : 'translateY(24px)' }}
                >
                  {i === 0 && <Sparkles count={5} color="#C99A54" />}

                  {i === 0 && (
                    <div style={{ position: 'absolute', top: '.75rem', left: '.75rem', zIndex: 3, fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '.25rem .7rem', borderRadius: '2rem', background: '#B5533C', color: 'white' }}>
                      Best match
                    </div>
                  )}
                  <div style={{ height: '180px', background: i === 0 ? '#F3E8DC' : i === 1 ? '#EAF3E1' : i === 2 ? '#F9EAE6' : '#EAF1F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', position: 'relative', zIndex: 2 }}>
                    {g.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={g.image} alt={g.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      g.icon || '🎁'
                    )}
                  </div>
                  <div style={{ padding: '1.25rem', position: 'relative', zIndex: 2, background: 'white' }}>
                    <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.15rem', color: '#2B2019', marginBottom: '.3rem', lineHeight: 1.3 }}>
                      {g.name || 'Handmade gift'}
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#7C6B60', marginBottom: '.7rem' }}>
                      by {g.by || (g.creators && g.creators.shop_name) || 'Artisan'} · {g.city || (g.creators && g.creators.city) || 'India'}
                    </div>
                    {g.why && (
                      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '10px', padding: '.6rem .8rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '.85rem', flexShrink: 0 }}>✨</span>
                        <span style={{ fontSize: '.76rem', color: '#2B2019', lineHeight: 1.5 }}>{g.why}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#2B2019' }}>
                        {g.price || (g.base_price ? `₹${g.base_price}` : '₹500')}
                      </span>
                      <Link href="/product" style={{ padding: '.45rem 1.1rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.75rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                        View gift →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Try again */}
            <div
              style={{
                display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', padding: '1rem 0', borderTop: '1px solid #E4D3BE',
                opacity: boxOpen ? 1 : 0,
                transition: 'opacity .5s ease .9s'
              }}
            >
              <button
                onClick={() => { setResult(null); setStory(''); setBoxOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{ padding: '.7rem 1.6rem', border: '1px solid #E4D3BE', borderRadius: '2rem', background: 'white', color: '#2B2019', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem' }}
              >
                Try a different story
              </button>
              <Link href="/marketplace" style={{ padding: '.7rem 1.6rem', background: '#2B2019', color: '#FBF7F2', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
                Browse all gifts →
              </Link>
            </div>
          </div>
        )}

        {/* EXAMPLE STORIES */}
        {!result && !loading && (
          <div style={{ marginTop: '2rem' }} className="reveal">
            <p style={{ fontSize: '.72rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem' }}>Need inspiration? Try one of these</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1rem' }}>
              {EXAMPLE_STORIES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStory(s)}
                  style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '16px', padding: '1.2rem 1.4rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', color: '#7C6B60', lineHeight: 1.6, transition: 'border-color .2s ease, color .2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.color = '#2B2019' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3E8DC'; e.currentTarget.style.color = '#7C6B60' }}
                >
                  <span style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#C99A54', display: 'block', marginBottom: '.5rem' }}>Example {i + 1}</span>
                  &ldquo;{s.slice(0, 120)}...&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#2B2019', padding: '3rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.8rem', fontWeight: 400, color: '#FBF7F2' }}>Gift<em style={{ fontStyle: 'italic', color: '#C99A54' }}>Soul</em></div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Find a gift', '/find-gift'], ['Marketplace', '/marketplace'], ['Creators', '/creators']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: '.82rem', color: 'rgba(251,247,242,.45)', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '.75rem', color: 'rgba(251,247,242,.28)' }}>© 2026 GiftSoul · Powered by AI · Made with love in India.</div>
      </footer>

    </div>
  )
}