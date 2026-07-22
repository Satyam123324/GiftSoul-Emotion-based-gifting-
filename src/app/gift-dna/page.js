'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/useAuth'
import { getWishlist, getWishlistDB } from '../lib/wishlist'
import { getGiftLog } from '../lib/giftLog'

const ARCHETYPES = {
  love: { label: 'The Devoted Heart', emoji: '💛', desc: 'You gift to say what words sometimes can\'t. Love shows up first in everything you pick.' },
  gratitude: { label: 'The Grateful Giver', emoji: '🙏', desc: 'You notice what people do for you, and you make sure they know it landed.' },
  celebration: { label: 'The Celebration Curator', emoji: '🎉', desc: 'Milestones matter to you — you make sure every win gets marked properly.' },
  nostalgia: { label: 'The Memory Keeper', emoji: '🕰️', desc: 'You gift things that hold time inside them. Sentiment over trend, always.' },
  friendship: { label: 'The Ride-or-Die Friend', emoji: '🤝', desc: 'Your gifts say "I see you" — thoughtful, specific, never generic.' },
  apology: { label: 'The Peacemaker', emoji: '🕊️', desc: 'You use gifts to rebuild bridges. Repair matters more to you than pride.' },
  'new beginnings': { label: 'The Fresh-Start Cheerleader', emoji: '🌱', desc: 'You show up at the start of things — new homes, new jobs, new chapters.' },
  'self-care': { label: 'The Self-Care Advocate', emoji: '🌸', desc: 'You believe rest and softness deserve celebrating too — for others and yourself.' },
  pride: { label: 'The Proud Supporter', emoji: '🏆', desc: 'When someone you love achieves something, you\'re the first to make it a moment.' },
  comfort: { label: 'The Comfort Giver', emoji: '🤗', desc: 'You gift warmth for hard days. Presence, wrapped up in something tangible.' },
  achievement: { label: 'The Achievement Champion', emoji: '🎓', desc: 'You mark growth and hard work with something that says "I noticed the effort."' },
  grief: { label: 'The Gentle Companion', emoji: '🕯️', desc: 'You show up quietly in someone\'s hardest moments, without needing to say much.' },
}
const DEFAULT_ARCHETYPE = { label: 'The Emerging Gifter', emoji: '🎁', desc: 'Save a few gifts or log one you\'ve given, and we\'ll start reading your gifting style.' }

export default function GiftDNA() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [emotionCounts, setEmotionCounts] = useState({})
  const [categoryCounts, setCategoryCounts] = useState({})
  const [avgPrice, setAvgPrice] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [giftsGivenCount, setGiftsGivenCount] = useState(0)
  const [topRecipient, setTopRecipient] = useState(null)

  useEffect(() => {
    if (authLoading) return
    compute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  async function compute() {
    setLoading(true)
    try {
      const ids = user ? await getWishlistDB(user.id) : getWishlist()
      let wishlistProducts = []
      if (ids.length > 0) {
        const res = await fetch('/api/products')
        const data = await res.json()
        wishlistProducts = (data.products || []).filter(p => ids.includes(p.id))
      }

      const eCounts = {}
      const cCounts = {}
      let priceSum = 0
      for (const p of wishlistProducts) {
        for (const e of (p.emotion_tags || [])) eCounts[e] = (eCounts[e] || 0) + 1
        if (p.category) cCounts[p.category] = (cCounts[p.category] || 0) + 1
        priceSum += p.base_price || 0
      }
      setEmotionCounts(eCounts)
      setCategoryCounts(cCounts)
      setAvgPrice(wishlistProducts.length > 0 ? Math.round(priceSum / wishlistProducts.length) : 0)
      setWishlistCount(wishlistProducts.length)

      const log = getGiftLog()
      setGiftsGivenCount(log.length)
      const personCounts = {}
      for (const entry of log) personCounts[entry.personName] = (personCounts[entry.personName] || 0) + 1
      const top = Object.entries(personCounts).sort((a, b) => b[1] - a[1])[0]
      setTopRecipient(top ? { name: top[0], count: top[1] } : null)
    } finally {
      setLoading(false)
    }
  }

  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const archetype = ARCHETYPES[topEmotion] || DEFAULT_ARCHETYPE
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const hasData = wishlistCount > 0 || giftsGivenCount > 0

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
        <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
      </nav>

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem' }}>Your gift DNA</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 300, color: '#2B2019', marginBottom: '2.5rem' }}>
          What your gifting says <em style={{ fontStyle: 'italic', color: '#B5533C' }}>about you</em>
        </h1>

        {loading ? (
          <p style={{ fontSize: '.85rem', color: '#7C6B60' }}>Reading your gifting style...</p>
        ) : (
          <>
            <div style={{ background: '#2B2019', borderRadius: '24px', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '.8rem' }}>{archetype.emoji}</div>
              <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#C99A54', marginBottom: '.6rem' }}>You are</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem,3.5vw,2.1rem)', fontWeight: 300, color: '#FBF7F2', marginBottom: '1rem' }}>
                {archetype.label}
              </h2>
              <p style={{ fontSize: '.9rem', color: 'rgba(251,247,242,.6)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
                {archetype.desc}
              </p>
            </div>

            {hasData && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  ['Gifts logged', giftsGivenCount],
                  ['Gifts saved', wishlistCount],
                  ['Avg. saved price', avgPrice ? `₹${avgPrice}` : '—'],
                  ['Favourite category', topCategory || '—'],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '16px', padding: '1.2rem 1rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#2B2019', marginBottom: '.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
                    <div style={{ fontSize: '.7rem', color: '#7C6B60', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
                  </div>
                ))}
              </div>
            )}

            {topRecipient && (
              <p style={{ fontSize: '.88rem', color: '#7C6B60', marginBottom: '2rem' }}>
                You&apos;ve gifted <strong style={{ color: '#2B2019' }}>{topRecipient.name}</strong> the most ({topRecipient.count} time{topRecipient.count !== 1 ? 's' : ''}) — <Link href="/timeline" style={{ color: '#B5533C' }}>see their timeline →</Link>
              </p>
            )}

            {!hasData && (
              <Link href="/marketplace" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
                Start saving gifts →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}
