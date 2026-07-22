'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/useAuth'
import { getFollowedCreatorIds } from '../lib/follows'

export default function Following() {
  const { user, loading: authLoading } = useAuth()
  const [creators, setCreators] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  async function load() {
    setLoading(true)
    try {
      const followedIds = await getFollowedCreatorIds(user.id)
      if (followedIds.length === 0) { setLoading(false); return }

      const [creatorsRes, productsRes] = await Promise.all([
        fetch('/api/creators'),
        fetch('/api/products'),
      ])
      const creatorsData = await creatorsRes.json()
      const productsData = await productsRes.json()

      setCreators((creatorsData.creators || []).filter(c => followedIds.includes(c.id)))
      setProducts((productsData.products || []).filter(p => followedIds.includes(p.creator_id)))
    } catch (e) {
      // fail quietly
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
        <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>All creators</Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem' }}>Your feed</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 300, color: '#2B2019', marginBottom: '2.5rem' }}>
          Creators you <em style={{ fontStyle: 'italic', color: '#B5533C' }}>follow</em>
        </h1>

        {!authLoading && !user && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <p style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#2B2019' }}>Log in to follow your favourite creators.</p>
            <Link href="/login" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              Log in →
            </Link>
          </div>
        )}

        {loading && user && <p style={{ fontSize: '.85rem', color: '#7C6B60' }}>Loading your feed...</p>}

        {!loading && user && creators.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🧵</div>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem', color: '#2B2019' }}>Not following anyone yet.</p>
            <p style={{ fontSize: '.85rem', marginBottom: '1.5rem' }}>Visit a creator's profile and tap Follow to see their new gifts here.</p>
            <Link href="/creators" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              Browse creators →
            </Link>
          </div>
        )}

        {!loading && creators.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
              {creators.map(c => (
                <Link key={c.id} href={`/creator/${c.id}`} style={{ flex: '0 0 auto', textAlign: 'center', textDecoration: 'none' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#2B2019', margin: '0 auto .5rem', overflow: 'hidden' }}>
                    {c.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (c.name || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ fontSize: '.75rem', color: '#2B2019', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                </Link>
              ))}
            </div>

            <h2 style={{ fontSize: '.85rem', letterSpacing: '.06em', textTransform: 'uppercase', color: '#7C6B60', marginBottom: '1rem' }}>Their gifts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem' }}>
              {products.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '18px', overflow: 'hidden', textDecoration: 'none' }}>
                  <div style={{ width: '100%', aspectRatio: '1', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem' }}>
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '🎁'}
                  </div>
                  <div style={{ padding: '.9rem 1rem' }}>
                    <div style={{ fontSize: '.85rem', color: '#2B2019' }}>{p.name}</div>
                    <div style={{ fontSize: '.88rem', color: '#B5533C', marginTop: '.2rem' }}>₹{p.base_price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
