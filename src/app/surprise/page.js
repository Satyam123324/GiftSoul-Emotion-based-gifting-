'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { encodeSurprise } from '../lib/surprise'

function CreateSurpriseInner() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [revealDate, setRevealDate] = useState('')
  const [revealTime, setRevealTime] = useState('09:00')

  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list = data.products || []
        setProducts(list)
        const preselectId = searchParams.get('productId')
        if (preselectId) {
          const match = list.find(p => p.id === preselectId)
          if (match) setSelected(match)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = products.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()))

  function buildLink() {
    if (!selected || !senderName || !revealDate) return
    const revealAt = new Date(`${revealDate}T${revealTime}:00`).toISOString()
    const payload = {
      productId: selected.id,
      name: selected.name,
      price: selected.base_price,
      image: selected.images?.[0] || null,
      senderName,
      message,
      revealAt,
    }
    const encoded = encodeSurprise(payload)
    const url = `${window.location.origin}/surprise/view?d=${encoded}`
    setLink(url)
    setCopied(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const today = new Date().toISOString().split('T')[0]

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

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem', textAlign: 'center' }}>Make it a surprise</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 300, color: '#2B2019', marginBottom: '.8rem', textAlign: 'center' }}>
          Schedule a <em style={{ fontStyle: 'italic', color: '#B5533C' }}>surprise reveal</em>
        </h1>
        <p style={{ fontSize: '.9rem', color: '#7C6B60', textAlign: 'center', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Pick a gift, write a message, and set the moment it unlocks. Share the link — it stays a locked countdown until then.
        </p>

        {!link ? (
          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.8rem' }}>

            <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', marginBottom: '.6rem' }}>1. Pick a gift</label>
            {!selected ? (
              <>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search gifts..."
                  style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', marginBottom: '.8rem' }}
                />
                <div style={{ maxHeight: '260px', overflowY: 'auto', border: '1px solid #F3E8DC', borderRadius: '12px' }}>
                  {loading && <p style={{ padding: '1rem', fontSize: '.85rem', color: '#7C6B60' }}>Loading gifts...</p>}
                  {!loading && filtered.slice(0, 20).map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid #F3E8DC', cursor: 'pointer', textAlign: 'left' }}
                    >
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.8rem', background: '#F3E8DC', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, overflow: 'hidden' }}>
                  {selected.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selected.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🎁'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.9rem', color: '#2B2019' }}>{selected.name}</div>
                  <div style={{ fontSize: '.8rem', color: '#B5533C' }}>₹{selected.base_price}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ fontSize: '.78rem', color: '#7C6B60', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Change</button>
              </div>
            )}

            <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', margin: '1.5rem 0 .6rem' }}>2. Your name</label>
            <input
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              placeholder="Who's this from?"
              style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }}
            />

            <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', margin: '1.5rem 0 .6rem' }}>3. A message for them</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Say what you'd want them to read the moment it unlocks..."
              rows={4}
              style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
            />

            <label style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500, display: 'block', margin: '1.5rem 0 .6rem' }}>4. When should it unlock?</label>
            <div style={{ display: 'flex', gap: '.8rem' }}>
              <input
                type="date"
                value={revealDate}
                min={today}
                onChange={e => setRevealDate(e.target.value)}
                style={{ flex: 1, padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }}
              />
              <input
                type="time"
                value={revealTime}
                onChange={e => setRevealTime(e.target.value)}
                style={{ width: '130px', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }}
              />
            </div>

            <button
              onClick={buildLink}
              disabled={!selected || !senderName || !revealDate}
              style={{ width: '100%', marginTop: '2rem', padding: '.85rem', background: (!selected || !senderName || !revealDate) ? '#D9C6B8' : '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.9rem', fontWeight: 500, cursor: (!selected || !senderName || !revealDate) ? 'not-allowed' : 'pointer' }}
            >
              Create surprise link
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🎁</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2B2019', marginBottom: '.6rem' }}>Your surprise is ready!</p>
            <p style={{ fontSize: '.85rem', color: '#7C6B60', marginBottom: '1.5rem' }}>Share this link — it'll stay locked until your chosen moment.</p>
            <div style={{ display: 'flex', gap: '.6rem', background: '#F3E8DC', borderRadius: '12px', padding: '.7rem 1rem', marginBottom: '1.2rem', wordBreak: 'break-all' }}>
              <span style={{ fontSize: '.78rem', color: '#2B2019', textAlign: 'left', flex: 1 }}>{link}</span>
            </div>
            <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={copyLink} style={{ padding: '.7rem 1.6rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.85rem', cursor: 'pointer' }}>
                {copied ? '✓ Copied!' : 'Copy link'}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I have a surprise for you 🎁 — but you'll have to wait: ${link}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ padding: '.7rem 1.6rem', border: '1px solid #E4D3BE', borderRadius: '2rem', fontSize: '.85rem', color: '#2B2019', textDecoration: 'none' }}
              >
                Share on WhatsApp
              </a>
            </div>
            <button onClick={() => { setLink(''); setSelected(null); setSenderName(''); setMessage(''); setRevealDate('') }} style={{ marginTop: '1.5rem', background: 'transparent', border: 'none', color: '#7C6B60', fontSize: '.8rem', textDecoration: 'underline', cursor: 'pointer' }}>
              Create another
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CreateSurprise() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FBF7F2' }} />}>
      <CreateSurpriseInner />
    </Suspense>
  )
}

