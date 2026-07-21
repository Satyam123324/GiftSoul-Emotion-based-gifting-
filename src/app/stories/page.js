'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const EMOTIONS = ['all', 'love', 'grief', 'celebration', 'gratitude', 'nostalgia', 'friendship', 'apology', 'new beginnings', 'self-care', 'achievement', 'comfort']

const EMOTION_COLORS = {
  love: '#F9EAE6', grief: '#EAF1F7', celebration: '#F3E8DC', gratitude: '#EAF3E1',
  nostalgia: '#F7EAC8', friendship: '#EAF3E1', apology: '#F9EAE6', 'new beginnings': '#EAF1F7',
  'self-care': '#F3E8DC', achievement: '#F7EAC8', comfort: '#EAF1F7',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

export default function Stories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [emotion, setEmotion] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchStories()
  }, [emotion])

  async function fetchStories() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/stories?emotion=${emotion}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setStories(data.stories || [])
      }
    } catch (e) {
      setError('Could not load the wall right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px', zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem',
        background: '#FBF7F2', boxShadow: '0 1px 0 #E4D3BE',
      }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.65rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/find-gift" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Find a gift (AI)</Link>
          <Link href="/stories" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#B5533C', textDecoration: 'none' }}>Wall of moments</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#2B2019', padding: 'calc(70px + 3.5rem) 5rem 3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem' }}>Real stories, real gifts</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 300, color: '#FBF7F2', lineHeight: 1.15, marginBottom: '1rem' }}>
          The <em style={{ fontStyle: 'italic', color: '#C97B63' }}>Wall of Moments</em>
        </h1>
        <p style={{ fontSize: '.95rem', color: 'rgba(251,247,242,.55)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
          Every story here was shared by someone using our AI gift finder — anonymized, unedited, and kept exactly as they told it. No names, just the moments that led to a gift.
        </p>
      </div>

      {/* EMOTION FILTER */}
      <div style={{ background: '#F3E8DC', borderBottom: '1px solid #E4D3BE', padding: '1rem 5rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
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
          >
            {em}
          </button>
        ))}
      </div>

      {/* WALL */}
      <div style={{ padding: '3rem 5rem 5rem', columns: '3 320px', columnGap: '1.5rem' }}>
        {loading && (
          <p style={{ fontSize: '.85rem', color: '#7C6B60' }}>Loading stories...</p>
        )}

        {!loading && error && (
          <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '12px', padding: '1rem 1.2rem', fontSize: '.88rem', color: '#B5533C' }}>{error}</div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem', color: '#2B2019' }}>No stories here yet.</p>
            <p style={{ fontSize: '.85rem', marginBottom: '1.5rem' }}>Be the first — share a moment with our AI gift finder.</p>
            <Link href="/find-gift" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              Try the AI gift finder →
            </Link>
          </div>
        )}

        {!loading && !error && stories.map(s => (
          <div key={s.id} style={{
            breakInside: 'avoid', marginBottom: '1.5rem', background: EMOTION_COLORS[(s.emotions_detected || [])[0]] || '#F3E8DC',
            border: '1px solid #E4D3BE', borderRadius: '18px', padding: '1.4rem',
          }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.7, color: '#2B2019', marginBottom: '1rem' }}>
              &ldquo;{s.story_text}&rdquo;
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '.8rem' }}>
              {(s.emotions_detected || []).slice(0, 3).map(e => (
                <span key={e} style={{ fontSize: '.65rem', textTransform: 'capitalize', padding: '.2rem .6rem', borderRadius: '2rem', background: 'rgba(181,83,60,.1)', border: '1px solid rgba(181,83,60,.25)', color: '#B5533C' }}>
                  {e}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', color: '#7C6B60' }}>
              <span>{s.occasion || 'a meaningful moment'}</span>
              <span>{timeAgo(s.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: '#B5533C', padding: '4rem 5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, color: 'white', marginBottom: '1rem' }}>
          Have a moment of your own?
        </h2>
        <Link href="/find-gift" style={{ display: 'inline-block', padding: '.85rem 2.2rem', background: 'white', color: '#B5533C', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem', fontWeight: 500 }}>
          Share your story →
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          nav { padding: 0 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}
