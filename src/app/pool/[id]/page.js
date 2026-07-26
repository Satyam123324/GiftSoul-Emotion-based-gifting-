'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'

const rupees = paise => (paise / 100).toLocaleString('en-IN')

export default function PoolPage({ params }) {
  const { id } = use(params)

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [justPaid, setJustPaid] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pools/${id}`)
      const json = await res.json()
      if (json.error) setError(json.error)
      else setData(json)
    } catch (e) {
      setError('Could not load this group gift right now.')
    } finally {
      setLoading(false)
    }
  }

  function loadRazorpayScript() {
    return new Promise(resolve => {
      if (window.Razorpay) return resolve(true)
      const s = document.createElement('script')
      s.src = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload = () => resolve(true)
      s.onerror = () => resolve(false)
      document.body.appendChild(s)
    })
  }

  async function handleContribute() {
    if (!name || !amount) {
      setPayError('Please add your name and how much you want to chip in.')
      return
    }
    setPayError('')
    setPaying(true)

    try {
      const ok = await loadRazorpayScript()
      if (!ok) {
        setPayError('Could not load the payment window. Check your connection and try again.')
        setPaying(false)
        return
      }

      const res = await fetch('/api/pools/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poolId: id, contributorName: name, contributorEmail: email, amount, note }),
      })
      const order = await res.json()
      if (order.error) {
        setPayError(order.error)
        setPaying(false)
        return
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'GiftSoul — group gift',
        description: order.productName,
        order_id: order.razorpayOrderId,
        prefill: { name, email: email || '' },
        theme: { color: '#B5533C' },
        handler: async function (response) {
          try {
            const vRes = await fetch('/api/pools/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                contributionId: order.contributionId,
                poolId: id,
              }),
            })
            const vData = await vRes.json()
            if (vData.success) {
              setJustPaid(true)
              setName(''); setAmount(''); setNote(''); setEmail('')
              load()
            } else {
              setPayError('Payment could not be verified. If money was deducted, contact support.')
            }
          } catch (e) {
            setPayError('Payment succeeded but verification failed. If money was deducted, contact support.')
          } finally {
            setPaying(false)
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      })

      rzp.on('payment.failed', () => {
        setPayError('Payment failed or was cancelled. No amount was charged.')
        setPaying(false)
      })
      rzp.open()
    } catch (e) {
      setPayError('Could not start checkout right now, please try again.')
      setPaying(false)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nav = (
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
  )

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>{nav}<p style={{ padding: '150px 2rem', textAlign: 'center', color: '#7C6B60', fontSize: '.9rem' }}>Loading group gift...</p></div>
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>
        {nav}
        <div style={{ padding: '150px 2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#2B2019', marginBottom: '.8rem' }}>{error || 'Not found'}</p>
          <Link href="/marketplace" style={{ color: '#B5533C', fontSize: '.85rem' }}>Browse gifts →</Link>
        </div>
      </div>
    )
  }

  const { pool, contributions, raised, remaining, percent } = data
  const isFunded = percent >= 100 || pool.status === 'funded'

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>
      {nav}

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem', textAlign: 'center' }}>
          Group gift · organised by {pool.organiser_name}
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.7rem,4vw,2.5rem)', fontWeight: 300, color: '#2B2019', marginBottom: '1.8rem', textAlign: 'center', lineHeight: 1.25 }}>
          {pool.recipient_name
            ? <>Let&apos;s get <em style={{ fontStyle: 'italic', color: '#B5533C' }}>{pool.recipient_name}</em> something special</>
            : <>Chip in for <em style={{ fontStyle: 'italic', color: '#B5533C' }}>something special</em></>}
        </h1>

        {/* Gift card + progress */}
        <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '22px', padding: '1.8rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '16px', background: '#F3E8DC', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', overflow: 'hidden' }}>
              {pool.products?.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pool.products.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : '🎁'}
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#2B2019' }}>{pool.products?.name || 'A handmade gift'}</div>
              <div style={{ fontSize: '.8rem', color: '#7C6B60', marginTop: '.2rem' }}>
                by {pool.creators?.shop_name || pool.creators?.name || 'a GiftSoul creator'}
                {pool.occasion ? ` · for ${pool.occasion}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.6rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 500, color: '#2B2019' }}>₹{rupees(raised)}</span>
            <span style={{ fontSize: '.85rem', color: '#7C6B60' }}>of ₹{rupees(pool.target_amount)}</span>
          </div>
          <div style={{ height: '10px', background: '#F3E8DC', borderRadius: '999px', overflow: 'hidden', marginBottom: '.6rem' }}>
            <div style={{ width: `${percent}%`, height: '100%', background: isFunded ? '#4A6B3C' : '#B5533C', borderRadius: '999px', transition: 'width .5s ease' }} />
          </div>
          <div style={{ fontSize: '.8rem', color: isFunded ? '#4A6B3C' : '#7C6B60' }}>
            {isFunded
              ? '🎉 Fully funded! The organiser can place the order now.'
              : `₹${rupees(remaining)} still needed · ${contributions.length} ${contributions.length === 1 ? 'person has' : 'people have'} chipped in`}
          </div>

          {pool.message && (
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: '#2B2019', lineHeight: 1.7, borderTop: '1px solid #F3E8DC', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
              &ldquo;{pool.message}&rdquo;
            </p>
          )}
        </div>

        {/* Contribute */}
        {justPaid && (
          <div style={{ background: '#EAF3E1', border: '1px solid rgba(74,107,60,.3)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '.92rem', color: '#2B2019', fontWeight: 500 }}>✓ Thank you for chipping in!</p>
            <p style={{ fontSize: '.8rem', color: '#4A6B3C', marginTop: '.2rem' }}>Your contribution has been added.</p>
          </div>
        )}

        {!isFunded && (
          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '.95rem', color: '#2B2019', fontWeight: 500, marginBottom: '1rem' }}>Chip in</p>

            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.9rem' }}>
              {[100, 250, 500, 1000].filter(v => v * 100 <= remaining).map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(String(v))}
                  style={{
                    padding: '.45rem 1.1rem', borderRadius: '2rem', fontSize: '.8rem', cursor: 'pointer',
                    border: amount === String(v) ? '1px solid #B5533C' : '1px solid #E4D3BE',
                    background: amount === String(v) ? '#F9EAE6' : '#FBF7F2',
                    color: amount === String(v) ? '#B5533C' : '#7C6B60',
                  }}
                >
                  ₹{v}
                </button>
              ))}
              <button
                onClick={() => setAmount(String(Math.ceil(remaining / 100)))}
                style={{ padding: '.45rem 1.1rem', borderRadius: '2rem', fontSize: '.8rem', cursor: 'pointer', border: '1px dashed #C99A54', background: '#F7EAC8', color: '#2B2019' }}
              >
                Cover the rest (₹{rupees(remaining)})
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem', marginBottom: '.7rem' }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min="1" placeholder="Amount (₹)"
                style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }} />
            </div>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Your email (optional)"
              style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', marginBottom: '.7rem' }} />
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a short message (optional)"
              style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', marginBottom: '1rem' }} />

            {payError && <p style={{ fontSize: '.8rem', color: '#B5533C', marginBottom: '.8rem' }}>{payError}</p>}

            <button
              onClick={handleContribute}
              disabled={paying}
              style={{ width: '100%', padding: '.8rem', background: '#2B2019', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.88rem', fontWeight: 500, cursor: 'pointer', opacity: paying ? .7 : 1 }}
            >
              {paying ? 'Opening payment...' : amount ? `Chip in ₹${Number(amount).toLocaleString('en-IN')}` : 'Chip in'}
            </button>
          </div>
        )}

        {/* Share */}
        <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <button onClick={copyLink} style={{ padding: '.7rem 1.6rem', border: '1px solid #E4D3BE', borderRadius: '2rem', background: 'white', fontSize: '.83rem', color: '#2B2019', cursor: 'pointer' }}>
            {copied ? '✓ Link copied!' : 'Copy link'}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`We're pooling in for a gift${pool.recipient_name ? ` for ${pool.recipient_name}` : ''} 🎁 Join in: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ padding: '.7rem 1.6rem', border: '1px solid #E4D3BE', borderRadius: '2rem', background: 'white', fontSize: '.83rem', color: '#2B2019', textDecoration: 'none' }}
          >
            Share on WhatsApp
          </a>
        </div>

        {/* Contributors */}
        {contributions.length > 0 && (
          <>
            <h2 style={{ fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#7C6B60', marginBottom: '1rem' }}>
              Who&apos;s chipped in
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {contributions.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '.9rem', background: 'white', border: '1px solid #E4D3BE', borderRadius: '14px', padding: '.9rem 1.1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#2B2019', flexShrink: 0 }}>
                    {c.contributor_name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.87rem', color: '#2B2019' }}>{c.contributor_name}</div>
                    {c.note && <div style={{ fontSize: '.78rem', color: '#7C6B60', fontStyle: 'italic' }}>&ldquo;{c.note}&rdquo;</div>}
                  </div>
                  <div style={{ fontSize: '.9rem', fontWeight: 500, color: '#B5533C' }}>₹{rupees(c.amount)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
