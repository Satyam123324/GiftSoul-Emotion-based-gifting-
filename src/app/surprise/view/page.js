'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { decodeSurprise } from '../../lib/surprise'
import Sparkles from '../../components/Sparkles'

function timeLeft(target) {
  const diff = target - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function SurpriseInner() {
  const searchParams = useSearchParams()
  const [surprise, setSurprise] = useState(null)
  const [invalid, setInvalid] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const encoded = searchParams.get('d')
    if (!encoded) { setInvalid(true); return }
    const data = decodeSurprise(encoded)
    if (!data || !data.revealAt) { setInvalid(true); return }
    setSurprise(data)
  }, [searchParams])

  useEffect(() => {
    if (!surprise) return
    const target = new Date(surprise.revealAt).getTime()

    function tick() {
      const remaining = timeLeft(target)
      if (!remaining) {
        setRevealed(true)
        setCountdown(null)
      } else {
        setCountdown(remaining)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [surprise])

  if (invalid) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#2B2019', marginBottom: '.8rem' }}>This link isn&apos;t valid.</p>
          <p style={{ fontSize: '.85rem', color: '#7C6B60', marginBottom: '1.5rem' }}>The surprise link may have been copied incorrectly.</p>
          <Link href="/" style={{ color: '#B5533C', fontSize: '.85rem' }}>Go to GiftSoul →</Link>
        </div>
      </div>
    )
  }

  if (!surprise) return <div style={{ minHeight: '100vh', background: '#FBF7F2' }} />

  return (
    <div style={{ minHeight: '100vh', background: revealed ? '#FBF7F2' : '#2B2019', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>

      {!revealed && (
        <div style={{ textAlign: 'center', maxWidth: '480px', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔒</div>
          <p style={{ fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '1rem' }}>
            {surprise.senderName} has a surprise for you
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 300, color: '#FBF7F2', marginBottom: '2rem', lineHeight: 1.3 }}>
            Something&apos;s waiting for you...
          </h1>

          {countdown && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {[['days', countdown.days], ['hrs', countdown.hours], ['min', countdown.minutes], ['sec', countdown.seconds]].map(([label, val]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '14px', padding: '.9rem 1rem', minWidth: '68px' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 500, color: '#FBF7F2', fontVariantNumeric: 'tabular-nums' }}>{String(val).padStart(2, '0')}</div>
                  <div style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(251,247,242,.5)' }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          <p style={{ fontSize: '.85rem', color: 'rgba(251,247,242,.5)' }}>
            It unlocks on {new Date(surprise.revealAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
      )}

      {revealed && (
        <div style={{ textAlign: 'center', maxWidth: '480px', position: 'relative', zIndex: 2 }}>
          <Sparkles count={8} color="#C99A54" />
          <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '1rem' }}>It&apos;s time</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.7rem,4vw,2.5rem)', fontWeight: 300, color: '#2B2019', marginBottom: '1.5rem' }}>
            A gift from <em style={{ fontStyle: 'italic', color: '#B5533C' }}>{surprise.senderName}</em>
          </h1>

          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.6rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '100%', maxWidth: '220px', aspectRatio: '1', margin: '0 auto 1rem', background: '#F3E8DC', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', overflow: 'hidden' }}>
              {surprise.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={surprise.image} alt={surprise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : '🎁'}
            </div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: '#2B2019', marginBottom: '.3rem' }}>{surprise.name}</p>
            <p style={{ fontSize: '1rem', color: '#B5533C', marginBottom: '1.2rem' }}>₹{surprise.price}</p>

            {surprise.message && (
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.05rem', color: '#2B2019', lineHeight: 1.7, borderTop: '1px solid #F3E8DC', paddingTop: '1.2rem' }}>
                &ldquo;{surprise.message}&rdquo;
              </p>
            )}
          </div>

          {surprise.productId && (
            <Link href={`/product/${surprise.productId}`} style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              View this gift →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function SurpriseView() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#2B2019' }} />}>
      <SurpriseInner />
    </Suspense>
  )
}
