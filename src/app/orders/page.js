'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/useAuth'

const STATUS_LABEL = { paid: 'Paid', created: 'Pending', failed: 'Failed' }

export default function Orders() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    fetch(`/api/orders?buyer_user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setOrders(data.orders || [])
      })
      .catch(() => setError('Could not load your orders right now.'))
      .finally(() => setLoading(false))
  }, [authLoading, user])

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

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem' }}>Your purchases</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 300, color: '#2B2019', marginBottom: '2.5rem' }}>
          My <em style={{ fontStyle: 'italic', color: '#B5533C' }}>orders</em>
        </h1>

        {!authLoading && !user && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <p style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#2B2019' }}>Log in to see your order history.</p>
            <Link href="/login" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              Log in →
            </Link>
          </div>
        )}

        {loading && user && <p style={{ fontSize: '.85rem', color: '#7C6B60' }}>Loading your orders...</p>}

        {!loading && error && (
          <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '12px', padding: '1rem 1.2rem', fontSize: '.88rem', color: '#B5533C' }}>{error}</div>
        )}

        {!loading && user && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🧾</div>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem', color: '#2B2019' }}>No orders yet.</p>
            <p style={{ fontSize: '.85rem', marginBottom: '1.5rem' }}>Once you pay for a gift, it'll show up here with its receipt.</p>
            <Link href="/marketplace" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
              Browse gifts →
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(o => (
            <div key={o.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', border: '1px solid #E4D3BE', borderRadius: '16px', padding: '1.2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#F3E8DC', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', overflow: 'hidden' }}>
                {o.products?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.products.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🎁'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.92rem', color: '#2B2019', fontWeight: 500 }}>{o.products?.name || 'Gift'}</div>
                <div style={{ fontSize: '.75rem', color: '#7C6B60' }}>
                  {new Date(o.paid_at || o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' · '}Qty {o.quantity}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#2B2019' }}>₹{(o.amount / 100).toLocaleString('en-IN')}</div>
                <span style={{ fontSize: '.68rem', padding: '.15rem .6rem', borderRadius: '2rem', background: o.status === 'paid' ? '#EAF3E1' : '#F9EAE6', color: o.status === 'paid' ? '#4A6B3C' : '#B5533C' }}>
                  {STATUS_LABEL[o.status] || o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
