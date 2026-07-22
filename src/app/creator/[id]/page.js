'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { useAuth } from '../../lib/useAuth'
import { isFollowing, toggleFollow, getFollowerCount } from '../../lib/follows'

export default function CreatorProfile({ params }) {
  const { id } = use(params)
  const { user } = useAuth()

  const [creator, setCreator] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [following, setFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followBusy, setFollowBusy] = useState(false)

  useEffect(() => {
    loadCreator()
    loadFollowerCount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (user) isFollowing(user.id, id).then(setFollowing)
  }, [user, id])

  async function loadCreator() {
    setLoading(true)
    setError('')
    try {
      const [creatorsRes, productsRes] = await Promise.all([
        fetch('/api/creators'),
        fetch(`/api/products?creator_id=${id}`),
      ])
      const creatorsData = await creatorsRes.json()
      const productsData = await productsRes.json()

      const match = (creatorsData.creators || []).find(c => c.id === id)
      if (!match) {
        setError('This creator could not be found.')
      } else {
        setCreator(match)
        setProducts(productsData.products || [])
      }
    } catch (e) {
      setError('Could not load this creator right now.')
    } finally {
      setLoading(false)
    }
  }

  async function loadFollowerCount() {
    const count = await getFollowerCount(id)
    setFollowerCount(count)
  }

  async function handleFollow() {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setFollowBusy(true)
    const nowFollowing = await toggleFollow(user.id, id)
    setFollowing(nowFollowing)
    setFollowerCount(c => c + (nowFollowing ? 1 : -1))
    setFollowBusy(false)
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

      {loading && <div style={{ padding: '150px 5rem', color: '#7C6B60', fontSize: '.9rem' }}>Loading creator...</div>}

      {!loading && error && (
        <div style={{ padding: '150px 5rem' }}>
          <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '12px', padding: '1.2rem', fontSize: '.9rem', color: '#B5533C' }}>{error}</div>
        </div>
      )}

      {!loading && !error && creator && (
        <>
          <div style={{ background: '#2B2019', padding: 'calc(70px + 3rem) 5rem 3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {creator.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={creator.photo_url} alt={creator.name} style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2B2019', flexShrink: 0 }}>
                  {(creator.name || '?')[0].toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, color: '#FBF7F2' }}>
                  {creator.shop_name || creator.name}
                </h1>
                <p style={{ fontSize: '.85rem', color: 'rgba(251,247,242,.55)' }}>
                  {creator.name}{creator.city ? ` · ${creator.city}` : ''} · {followerCount} follower{followerCount !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={handleFollow}
                disabled={followBusy}
                style={{
                  padding: '.7rem 1.8rem', borderRadius: '2rem', fontSize: '.85rem', cursor: 'pointer',
                  border: following ? '1px solid rgba(255,255,255,.3)' : 'none',
                  background: following ? 'transparent' : '#B5533C',
                  color: following ? '#FBF7F2' : 'white',
                }}
              >
                {following ? '✓ Following' : '+ Follow'}
              </button>
            </div>
            {creator.bio && (
              <p style={{ fontSize: '.92rem', color: 'rgba(251,247,242,.6)', maxWidth: '600px', marginTop: '1.5rem', lineHeight: 1.8 }}>{creator.bio}</p>
            )}
            {(creator.craft_tags || []).length > 0 && (
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {creator.craft_tags.map(t => (
                  <span key={t} style={{ fontSize: '.68rem', textTransform: 'capitalize', padding: '.25rem .7rem', borderRadius: '2rem', background: 'rgba(201,154,84,.15)', border: '1px solid rgba(201,154,84,.35)', color: '#C99A54' }}>{t}</span>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '3rem 5rem 5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 400, color: '#2B2019', marginBottom: '1.5rem' }}>
              {products.length > 0 ? `${products.length} gift${products.length !== 1 ? 's' : ''} from ${creator.name}` : 'No gifts listed yet'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1.5rem' }}>
              {products.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '18px', overflow: 'hidden', textDecoration: 'none' }}>
                  <div style={{ width: '100%', aspectRatio: '1', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem' }}>
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : '🎁'}
                  </div>
                  <div style={{ padding: '.9rem 1rem' }}>
                    <div style={{ fontSize: '.88rem', color: '#2B2019' }}>{p.name}</div>
                    <div style={{ fontSize: '.9rem', color: '#B5533C', marginTop: '.2rem' }}>₹{p.base_price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
