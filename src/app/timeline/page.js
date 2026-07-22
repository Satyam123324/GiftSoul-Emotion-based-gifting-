'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getGiftLogByPerson, deleteGiftLogEntry } from '../lib/giftLog'

export default function Timeline() {
  const [people, setPeople] = useState([])
  const [activePerson, setActivePerson] = useState(null)

  useEffect(() => {
    const grouped = getGiftLogByPerson()
    setPeople(grouped)
    if (grouped.length > 0) setActivePerson(grouped[0].name)
  }, [])

  function handleDelete(id) {
    deleteGiftLogEntry(id)
    const grouped = getGiftLogByPerson()
    setPeople(grouped)
    if (!grouped.find(p => p.name === activePerson)) {
      setActivePerson(grouped[0]?.name || null)
    }
  }

  const current = people.find(p => p.name === activePerson)

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
          <Link href="/reminders" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Reminders</Link>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem' }}>Your gifting history</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 300, color: '#2B2019', marginBottom: '2.5rem' }}>
          Gift <em style={{ fontStyle: 'italic', color: '#B5533C' }}>timeline</em>
        </h1>

        {people.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>📖</div>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem', color: '#2B2019' }}>No gifts logged yet.</p>
            <p style={{ fontSize: '.85rem', marginBottom: '1.5rem' }}>After sending an enquiry for a gift, you can tag who it was for — it'll show up here as a running history.</p>
            <Link href="/marketplace" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              Browse gifts →
            </Link>
          </div>
        )}

        {people.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2.5rem' }}>

            {/* People list */}
            <div>
              {people.map(p => (
                <button
                  key={p.name}
                  onClick={() => setActivePerson(p.name)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '.9rem 1rem', marginBottom: '.6rem',
                    borderRadius: '14px', border: p.name === activePerson ? '1px solid #B5533C' : '1px solid #E4D3BE',
                    background: p.name === activePerson ? '#F9EAE6' : 'white', cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '.9rem', color: '#2B2019', fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: '.72rem', color: '#7C6B60' }}>{p.entries.length} gift{p.entries.length !== 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>

            {/* Timeline for selected person */}
            {current && (
              <div style={{ position: 'relative', paddingLeft: '1.8rem' }}>
                <div style={{ position: 'absolute', left: '5px', top: '6px', bottom: '6px', width: '2px', background: '#E4D3BE' }} />
                {current.entries.map(entry => (
                  <div key={entry.id} style={{ position: 'relative', marginBottom: '2rem' }}>
                    <div style={{ position: 'absolute', left: '-1.8rem', top: '.3rem', width: '12px', height: '12px', borderRadius: '50%', background: '#B5533C', border: '2px solid #FBF7F2' }} />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'white', border: '1px solid #E4D3BE', borderRadius: '16px', padding: '1rem' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#F3E8DC', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', overflow: 'hidden' }}>
                        {entry.productImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={entry.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : '🎁'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '.75rem', color: '#7C6B60', marginBottom: '.2rem' }}>
                          {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        {entry.productId ? (
                          <Link href={`/product/${entry.productId}`} style={{ fontSize: '.92rem', color: '#2B2019', textDecoration: 'none', fontWeight: 500 }}>
                            {entry.productName}
                          </Link>
                        ) : (
                          <span style={{ fontSize: '.92rem', color: '#2B2019', fontWeight: 500 }}>{entry.productName}</span>
                        )}
                        <div style={{ fontSize: '.82rem', color: '#B5533C', marginTop: '.15rem' }}>₹{entry.price}</div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        aria-label="Remove entry"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#F3E8DC', color: '#7C6B60', cursor: 'pointer', fontSize: '.75rem', flexShrink: 0 }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
