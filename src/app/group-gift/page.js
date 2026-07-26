'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '../lib/useAuth'

function GroupGiftInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const [organiserName, setOrganiserName] = useState('')
  const [organiserEmail, setOrganiserEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [occasion, setOccasion] = useState('')
  const [message, setMessage] = useState('')

  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list = data.products || []
        setProducts(list)
        const pre = searchParams.get('productId')
        if (pre) {
          const match = list.find(p => p.id === pre)
          if (match) setSelected(match)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user) {
      setOrganiserName(prev => prev || user.user_metadata?.full_name || '')
      setOrganiserEmail(prev => prev || user.email || '')
    }
  }, [user])

  const filtered = products.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()))

  async function handleCreate() {
    if (!selected || !organiserName || !organiserEmail) return
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/pools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selected.id,
          organiserName,
          organiserEmail,
          recipientName,
          occasion,
          message,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setCreating(false)
      } else {
        router.push(`/pool/${data.pool.id}`)
      }
    } catch (e) {
      setError('Could not start the group gift right now, please try again.')
      setCreating(false)
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
        <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
      </nav>

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem', textAlign: 'center' }}>Better together</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 300, color: '#2B2019', marginBottom: '.8rem', textAlign: 'center' }}>
          Split a <em style={{ fontStyle: 'italic', color: '#B5533C' }}>gift</em>
        </h1>
        <p style={{ fontSize: '.9rem', color: '#7C6B60', textAlign: 'center', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Pick something worth giving properly, then share a link so everyone can chip in. Perfect for farewells, big birthdays, and office gifting.
        </p>

        <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.8rem' }}>

          <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', marginBottom: '.6rem' }}>1. Pick the gift</label>
          {!selected ? (
            <>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gifts..."
                style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', marginBottom: '.8rem' }} />
              <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #F3E8DC', borderRadius: '12px' }}>
                {loadingProducts && <p style={{ padding: '1rem', fontSize: '.85rem', color: '#7C6B60' }}>Loading gifts...</p>}
                {!loadingProducts && filtered.slice(0, 20).map(p => (
                  <button key={p.id} onClick={() => setSelected(p)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid #F3E8DC', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, overflow: 'hidden' }}>
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '🎁'}
                    </div>
                    <div>
                      <div style={{ fontSize: '.85rem', color: '#2B2019' }}>{p.name}</div>
                      <div style={{ fontSize: '.75rem', color: '#B5533C' }}>₹{p.base_price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.8rem', background: '#F3E8DC', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, overflow: 'hidden' }}>
                {selected.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🎁'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.9rem', color: '#2B2019' }}>{selected.name}</div>
                <div style={{ fontSize: '.8rem', color: '#B5533C' }}>Goal: ₹{selected.base_price}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ fontSize: '.78rem', color: '#7C6B60', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Change</button>
            </div>
          )}

          <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', margin: '1.5rem 0 .6rem' }}>2. Who&apos;s organising?</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem' }}>
            <input value={organiserName} onChange={e => setOrganiserName(e.target.value)} placeholder="Your name"
              style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
            <input value={organiserEmail} onChange={e => setOrganiserEmail(e.target.value)} type="email" placeholder="Your email"
              style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
          </div>

          <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', margin: '1.5rem 0 .6rem' }}>3. Who&apos;s it for? <span style={{ fontWeight: 400, color: '#7C6B60' }}>(optional)</span></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem' }}>
            <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Their name"
              style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
            <input value={occasion} onChange={e => setOccasion(e.target.value)} placeholder="Occasion (e.g. farewell)"
              style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
          </div>

          <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', margin: '1.5rem 0 .6rem' }}>4. A note for the group</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
            placeholder="Tell everyone why this gift, and why now..."
            style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', resize: 'none', fontFamily: 'inherit' }} />

          {error && <p style={{ fontSize: '.8rem', color: '#B5533C', marginTop: '.8rem' }}>{error}</p>}

          <button
            onClick={handleCreate}
            disabled={!selected || !organiserName || !organiserEmail || creating}
            style={{
              width: '100%', marginTop: '1.8rem', padding: '.85rem', border: 'none', borderRadius: '2rem',
              fontSize: '.9rem', fontWeight: 500, color: 'white',
              background: (!selected || !organiserName || !organiserEmail) ? '#D9C6B8' : '#B5533C',
              cursor: (!selected || !organiserName || !organiserEmail) ? 'not-allowed' : 'pointer',
              opacity: creating ? .7 : 1,
            }}
          >
            {creating ? 'Creating...' : 'Create group gift & get link'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GroupGift() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FBF7F2' }} />}>
      <GroupGiftInner />
    </Suspense>
  )
}
