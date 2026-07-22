'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getWishlist, toggleWishlist, getWishlistDB, toggleWishlistDB } from '../lib/wishlist'
import { useAuth } from '../lib/useAuth'

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    loadWishlistedProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  async function loadWishlistedProducts() {
    setLoading(true)
    setError('')
    try {
      const ids = user ? await getWishlistDB(user.id) : getWishlist()
      if (ids.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setProducts((data.products || []).filter(p => ids.includes(p.id)))
      }
    } catch (e) {
      setError('Could not load your saved gifts right now.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(id) {
    if (user) {
      await toggleWishlistDB(user.id, id)
    } else {
      toggleWishlist(id)
    }
    setProducts(prev => prev.filter(p => p.id !== id))
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
          <Link href="/wishlist" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#B5533C', textDecoration: 'none' }}>♡ Saved</Link>
        </div>
      </nav>

      <div style={{ padding: 'calc(70px + 3rem) 5rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem' }}>Your list</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#2B2019', marginBottom: '2.5rem' }}>
          Saved <em style={{ fontStyle: 'italic', color: '#B5533C' }}>gifts</em>
        </h1>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.8rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', height: '320px', opacity: .5 }} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '12px', padding: '1rem 1.2rem', fontSize: '.88rem', color: '#B5533C' }}>{error}</div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#7C6B60' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>♡</div>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem', color: '#2B2019' }}>Nothing saved yet.</p>
            <p style={{ fontSize: '.85rem', marginBottom: '1.5rem' }}>Tap the ♡ on any gift to keep it here for later.</p>
            <Link href="/marketplace" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              Browse gifts →
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.8rem' }}>
            {products.map(p => (
              <div key={p.id} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                <button
                  onClick={() => handleRemove(p.id)}
                  aria-label="Remove from saved"
                  style={{ position: 'absolute', top: '.7rem', right: '.7rem', zIndex: 2, width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.9)', color: '#B5533C', cursor: 'pointer', fontSize: '.9rem' }}
                >
                  ✕
                </button>
                <Link href={`/product/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ width: '100%', aspectRatio: '1', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '🎁'}
                  </div>
                  <div style={{ padding: '1.1rem 1.2rem' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', color: '#2B2019', marginBottom: '.3rem' }}>{p.name}</div>
                    <div style={{ fontSize: '.72rem', color: '#7C6B60', marginBottom: '.7rem' }}>by {p.creators?.name || p.creators?.shop_name || 'GiftSoul creator'}</div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#2B2019' }}>₹{p.base_price}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
