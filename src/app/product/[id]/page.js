'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { isWishlisted, toggleWishlist, isWishlistedDB, toggleWishlistDB, addRecentlyViewed } from '../../lib/wishlist'
import { addGiftLogEntry } from '../../lib/giftLog'
import { useAuth } from '../../lib/useAuth'

export default function ProductDetail({ params }) {
  const { id } = use(params)
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('about')
  const [saved, setSaved] = useState(false)
  const [note, setNote] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  const [logPersonName, setLogPersonName] = useState('')
  const [loggedToTimeline, setLoggedToTimeline] = useState(false)

  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHoverRating, setReviewHoverRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    fetchProduct()
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (user) {
      isWishlistedDB(user.id, id).then(setSaved)
    } else {
      setSaved(isWishlisted(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  useEffect(() => {
    if (user) {
      setBuyerName(prev => prev || user.user_metadata?.full_name || '')
      setBuyerEmail(prev => prev || user.email || '')
      setReviewerName(prev => prev || user.user_metadata?.full_name || '')
    }
  }, [user])

  async function fetchReviews() {
    setReviewsLoading(true)
    try {
      const res = await fetch(`/api/reviews?product_id=${id}`)
      const data = await res.json()
      if (!data.error) {
        setReviews(data.reviews || [])
        setAvgRating(data.average || 0)
        setReviewCount(data.count || 0)
      }
    } catch (e) {
      // fail quietly - reviews are supplementary, not critical path
    } finally {
      setReviewsLoading(false)
    }
  }

  async function submitReview() {
    if (!reviewerName || !reviewRating) {
      setReviewError('Please add your name and pick a star rating.')
      return
    }
    setReviewSubmitting(true)
    setReviewError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: id,
          creator_id: product?.creator_id,
          buyer_name: reviewerName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setReviewError(data.error)
      } else {
        setReviewSubmitted(true)
        setReviewerName('')
        setReviewRating(0)
        setReviewComment('')
        fetchReviews()
      }
    } catch (e) {
      setReviewError('Could not submit your review right now, please try again.')
    } finally {
      setReviewSubmitting(false)
    }
  }


  async function fetchProduct() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setProduct(data.product || null)
        if (data.product) addRecentlyViewed(data.product)
      }
    } catch (e) {
      setError('Could not load this gift right now.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleSave() {
    if (user) {
      const nowSaved = await toggleWishlistDB(user.id, id)
      setSaved(nowSaved)
    } else {
      const next = toggleWishlist(id)
      setSaved(next.includes(id))
    }
  }

  function handleLogGift() {
    if (!logPersonName || !product) return
    addGiftLogEntry({
      personName: logPersonName,
      productId: product.id,
      productName: product.name,
      productImage: product.images?.[0] || null,
      price: product.base_price,
    })
    setLoggedToTimeline(true)
  }

  async function sendEnquiry() {
    if (!buyerName || !buyerEmail) {
      setSendError('Please add your name and email so the creator can reach you.')
      return
    }
    setSending(true)
    setSendError('')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          creator_id: product.creator_id,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone,
          message: `Enquiry about ${product.name}`,
          personalisation_note: note,
          quantity: qty,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setSendError(data.error)
      } else {
        setSent(true)
      }
    } catch (e) {
      setSendError('Could not send your enquiry right now, please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2' }}>

      {/* NAV */}
      <nav className="gs-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', zIndex: 600,
        background: 'rgba(251,247,242,.95)', backdropFilter: 'blur(16px)', boxShadow: '0 1px 0 #F3E8DC'
      }}>
        <Link href="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.65rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
          Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
        </Link>
        <div className="gs-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/creators" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Creators</Link>
          <Link href="/creator-register" style={{ padding: '.5rem 1.4rem', background: '#2B2019', color: '#FBF7F2', borderRadius: '2rem', fontSize: '.78rem', textDecoration: 'none' }}>Join as creator</Link>
        </div>
        <button className="gs-nav-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ display: 'none', width: '40px', height: '40px', flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span style={{ width: '22px', height: '2px', background: '#2B2019' }} />
          <span style={{ width: '22px', height: '2px', background: '#2B2019' }} />
          <span style={{ width: '16px', height: '2px', background: '#2B2019', alignSelf: 'flex-end' }} />
        </button>
      </nav>

      <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(43,32,25,.45)', zIndex: 700, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity .3s ease' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: '340px', background: '#FBF7F2', zIndex: 800, padding: '1.5rem', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .35s cubic-bezier(.32,.72,0,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', color: '#2B2019' }}>Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em></span>
          <button onClick={() => setMenuOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E4D3BE', background: 'white', cursor: 'pointer' }}>✕</button>
        </div>
        {[['Browse gifts', '/marketplace'], ['Creators', '/creators']].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: '1rem .25rem', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#2B2019', textDecoration: 'none', borderBottom: '1px solid #E4D3BE' }}>{label}</Link>
        ))}
        <Link href="/creator-register" onClick={() => setMenuOpen(false)} style={{ marginTop: 'auto', padding: '.9rem 1.4rem', background: '#B5533C', color: 'white', borderRadius: '2rem', fontSize: '.85rem', textAlign: 'center', textDecoration: 'none' }}>Join as creator</Link>
      </div>

      {loading && (
        <div style={{ padding: '150px 5rem 5rem', color: '#7C6B60', fontSize: '.9rem' }}>Loading gift...</div>
      )}

      {!loading && error && (
        <div style={{ padding: '150px 5rem 5rem' }}>
          <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '12px', padding: '1.2rem', fontSize: '.9rem', color: '#B5533C' }}>
            {error}
          </div>
        </div>
      )}

      {!loading && !error && product && (
        <>
          {/* BREADCRUMB */}
          <div className="gs-breadcrumb" style={{ padding: '90px 5rem 0', fontSize: '.72rem', color: '#7C6B60' }}>
            <Link href="/" style={{ color: '#B5533C', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <Link href="/marketplace" style={{ color: '#B5533C', textDecoration: 'none' }}>Marketplace</Link>
            {' / '}
            {product.name}
          </div>

          {/* MAIN LAYOUT */}
          <div className="gs-product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', padding: '2rem 5rem 5rem', maxWidth: '1300px', margin: '0 auto' }}>

            {/* GALLERY */}
            <div className="gs-gallery" style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
              <div style={{ width: '100%', aspectRatio: '1', background: '#F3E8DC', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px', border: '1px solid #E4D3BE', overflow: 'hidden' }}>
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🎁'}
              </div>
            </div>

            {/* INFO */}
            <div>
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {(product.emotion_tags || []).map(b => (
                  <span key={b} style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '.28rem .8rem', borderRadius: '2rem', background: 'rgba(181,83,60,.08)', border: '1px solid rgba(181,83,60,.3)', color: '#B5533C' }}>{b}</span>
                ))}
              </div>

              <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.7rem,3vw,2.6rem)', fontWeight: 400, lineHeight: 1.15, color: '#2B2019', marginBottom: '.6rem' }}>
                {product.name}
              </h1>

              {!reviewsLoading && reviewCount > 0 && (
                <button
                  onClick={() => setActiveTab('reviews')}
                  style={{ display: 'flex', alignItems: 'center', gap: '.4rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '.8rem' }}
                >
                  <span style={{ color: '#C99A54', fontSize: '.95rem', letterSpacing: '.05em' }}>
                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                  </span>
                  <span style={{ fontSize: '.85rem', color: '#2B2019', fontWeight: 500 }}>{avgRating}</span>
                  <span style={{ fontSize: '.8rem', color: '#7C6B60', textDecoration: 'underline' }}>({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '.8rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 500, color: '#2B2019' }}>₹{product.base_price}</span>
              </div>

              <div style={{ height: '1px', background: '#F3E8DC', margin: '1.5rem 0' }} />

              <div style={{ background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.4rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E4D3BE', borderRadius: '2rem', overflow: 'hidden', background: 'white' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: '#2B2019' }}>−</button>
                    <span style={{ width: '36px', textAlign: 'center', fontSize: '.9rem', color: '#2B2019' }}>{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} style={{ width: '34px', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: '#2B2019' }}>+</button>
                  </div>
                  <div style={{ fontSize: '.78rem', color: '#7C6B60' }}>Ready in <strong style={{ color: '#2B2019' }}>{product.lead_time_days || 5} working days</strong></div>
                </div>

                {!sent && (
                  <>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Add a personalisation note..."
                      rows={3}
                      style={{ width: '100%', border: '1px solid #E4D3BE', borderRadius: '12px', padding: '.7rem 1rem', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', color: '#2B2019', background: 'white', resize: 'none', outline: 'none', marginBottom: '.8rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginBottom: '.8rem' }}>
                      <input
                        value={buyerName}
                        onChange={e => setBuyerName(e.target.value)}
                        placeholder="Your name"
                        style={{ border: '1px solid #E4D3BE', borderRadius: '12px', padding: '.6rem .9rem', fontSize: '.85rem', outline: 'none' }}
                      />
                      <input
                        value={buyerEmail}
                        onChange={e => setBuyerEmail(e.target.value)}
                        placeholder="Your email"
                        type="email"
                        style={{ border: '1px solid #E4D3BE', borderRadius: '12px', padding: '.6rem .9rem', fontSize: '.85rem', outline: 'none' }}
                      />
                    </div>
                    <input
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      placeholder="Your phone (optional)"
                      style={{ width: '100%', border: '1px solid #E4D3BE', borderRadius: '12px', padding: '.6rem .9rem', fontSize: '.85rem', outline: 'none', marginBottom: '1rem' }}
                    />
                    {sendError && (
                      <div style={{ fontSize: '.8rem', color: '#B5533C', marginBottom: '.8rem' }}>{sendError}</div>
                    )}
                  </>
                )}

                <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={sendEnquiry}
                    disabled={sending || sent}
                    style={{ flex: 1, minWidth: '160px', padding: '.75rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.85rem', cursor: sent ? 'default' : 'pointer', fontWeight: 500, opacity: sending ? .7 : 1, transition: 'background .2s ease, transform .15s ease' }}
                    onMouseEnter={e => { if (!sending && !sent) e.currentTarget.style.background = '#9A4230' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#B5533C' }}
                    onMouseDown={e => { if (!sending && !sent) e.currentTarget.style.transform = 'scale(.97)' }}
                    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    {sent ? '✓ Enquiry sent!' : sending ? 'Sending...' : 'Send enquiry to creator'}
                  </button>
                  <button
                    onClick={handleToggleSave}
                    style={{ padding: '.75rem 1.2rem', border: saved ? '1px solid #B5533C' : '1px solid #E4D3BE', borderRadius: '2rem', background: 'white', cursor: 'pointer', fontSize: '.85rem', color: saved ? '#B5533C' : '#7C6B60', transition: 'all .2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#B5533C'; e.currentTarget.style.color = '#B5533C' }}
                    onMouseLeave={e => { if (!saved) { e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.color = '#7C6B60' } }}
                  >
                    {saved ? '♥ Saved' : '♡ Save'}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out this gift on GiftSoul — ${product.name} (₹${product.base_price}): ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on WhatsApp"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', border: '1px solid #E4D3BE', borderRadius: '50%', background: 'white', color: '#4A6B3C', textDecoration: 'none', fontSize: '1.2rem', transition: 'all .2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4A6B3C'; e.currentTarget.style.background = '#EAF3E1' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4D3BE'; e.currentTarget.style.background = 'white' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.81 14.03c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.13.09-1.83-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z"/></svg>
                  </a>
                </div>
                <Link
                  href={`/surprise?productId=${product.id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', marginTop: '.8rem', padding: '.65rem', border: '1px dashed #C99A54', borderRadius: '2rem', background: '#F7EAC8', color: '#2B2019', textDecoration: 'none', fontSize: '.8rem', transition: 'all .2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F3E0A8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F7EAC8'}
                >
                  🔒 Send this as a scheduled surprise reveal
                </Link>

                {sent && !loggedToTimeline && (
                  <div style={{ marginTop: '.8rem', padding: '.9rem 1rem', background: 'white', border: '1px dashed #E4D3BE', borderRadius: '14px' }}>
                    <p style={{ fontSize: '.8rem', color: '#2B2019', marginBottom: '.6rem' }}>📖 Who was this gift for? (adds it to your Gift Timeline)</p>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <input
                        value={logPersonName}
                        onChange={e => setLogPersonName(e.target.value)}
                        placeholder="e.g. Mom, Priya, Rohan..."
                        style={{ flex: 1, padding: '.5rem .8rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.82rem', outline: 'none' }}
                      />
                      <button
                        onClick={handleLogGift}
                        disabled={!logPersonName}
                        style={{ padding: '.5rem 1.1rem', background: logPersonName ? '#2B2019' : '#D9C6B8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '.8rem', cursor: logPersonName ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
                {loggedToTimeline && (
                  <p style={{ marginTop: '.8rem', fontSize: '.8rem', color: '#4A6B3C' }}>
                    ✓ Added to <Link href="/timeline" style={{ color: '#4A6B3C', textDecoration: 'underline' }}>{logPersonName}&apos;s timeline</Link>
                  </p>
                )}
              </div>

              {product.creators && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', border: '1px solid #E4D3BE', borderRadius: '20px', background: 'white', marginBottom: '1.5rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#2B2019', flexShrink: 0 }}>
                    {(product.creators.name || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.1rem', color: '#2B2019' }}>{product.creators.name || product.creators.shop_name}</div>
                    <div style={{ fontSize: '.72rem', color: '#7C6B60' }}>{product.creators.city}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', borderBottom: '1px solid #E4D3BE', marginBottom: '1.5rem', overflowX: 'auto' }}>
                {[['about', 'About'], ['specs', 'Details'], ['reviews', reviewCount > 0 ? `Reviews (${reviewCount})` : 'Reviews']].map(([tid, label]) => (
                  <button key={tid} onClick={() => setActiveTab(tid)} style={{ padding: '.7rem 1.4rem', fontSize: '.82rem', color: activeTab === tid ? '#B5533C' : '#7C6B60', border: 'none', borderBottom: activeTab === tid ? '2px solid #B5533C' : '2px solid transparent', background: 'transparent', cursor: 'pointer', marginBottom: '-1px', whiteSpace: 'nowrap' }}>
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'about' && (
                <p style={{ fontSize: '.9rem', color: '#7C6B60', lineHeight: 1.8 }}>
                  {product.description || 'This creator hasn\u2019t added a description yet.'}
                </p>
              )}
              {activeTab === 'specs' && (
                <table style={{ width: '100%', fontSize: '.85rem' }}>
                  <tbody>
                    {[
                      ['Category', product.category || '—'],
                      ['Lead time', `${product.lead_time_days || 5} days`],
                      ['Type', product.product_type || 'handmade'],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ padding: '.55rem 0', borderBottom: '1px solid #E4D3BE', color: '#2B2019', fontWeight: 500, width: '40%' }}>{k}</td>
                        <td style={{ padding: '.55rem 0', borderBottom: '1px solid #E4D3BE', color: '#7C6B60' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'reviews' && (
                <div>
                  {reviewsLoading && (
                    <p style={{ fontSize: '.85rem', color: '#7C6B60' }}>Loading reviews...</p>
                  )}

                  {!reviewsLoading && reviews.length === 0 && (
                    <p style={{ fontSize: '.9rem', color: '#7C6B60', marginBottom: '1.5rem' }}>No reviews yet — be the first to buy this gift!</p>
                  )}

                  {!reviewsLoading && reviews.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      {reviews.map(r => (
                        <div key={r.id} style={{ borderBottom: '1px solid #F3E8DC', padding: '1rem 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.3rem' }}>
                            <span style={{ fontSize: '.9rem', fontWeight: 500, color: '#2B2019' }}>{r.buyer_name}</span>
                            <span style={{ fontSize: '.75rem', color: '#7C6B60' }}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div style={{ color: '#C99A54', fontSize: '.85rem', marginBottom: '.4rem' }}>
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </div>
                          {r.comment && (
                            <p style={{ fontSize: '.87rem', color: '#7C6B60', lineHeight: 1.6 }}>{r.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '16px', padding: '1.3rem' }}>
                    <p style={{ fontSize: '.9rem', fontWeight: 500, color: '#2B2019', marginBottom: '.9rem' }}>Write a review</p>

                    {reviewSubmitted ? (
                      <p style={{ fontSize: '.87rem', color: '#4A6B3C' }}>✓ Thanks for your review!</p>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '.3rem', marginBottom: '.9rem' }}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setReviewRating(n)}
                              onMouseEnter={() => setReviewHoverRating(n)}
                              onMouseLeave={() => setReviewHoverRating(0)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#C99A54', padding: 0, lineHeight: 1 }}
                            >
                              {(reviewHoverRating || reviewRating) >= n ? '★' : '☆'}
                            </button>
                          ))}
                        </div>
                        <input
                          value={reviewerName}
                          onChange={e => setReviewerName(e.target.value)}
                          placeholder="Your name"
                          style={{ width: '100%', padding: '.6rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', marginBottom: '.7rem', fontFamily: 'inherit' }}
                        />
                        <textarea
                          value={reviewComment}
                          onChange={e => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this gift (optional)"
                          rows={3}
                          style={{ width: '100%', padding: '.6rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', resize: 'none', marginBottom: '.8rem', fontFamily: 'inherit' }}
                        />
                        {reviewError && (
                          <p style={{ fontSize: '.8rem', color: '#B5533C', marginBottom: '.8rem' }}>{reviewError}</p>
                        )}
                        <button
                          onClick={submitReview}
                          disabled={reviewSubmitting}
                          style={{ padding: '.6rem 1.6rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.83rem', cursor: 'pointer', opacity: reviewSubmitting ? .7 : 1 }}
                        >
                          {reviewSubmitting ? 'Submitting...' : 'Submit review'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <footer style={{ background: '#2B2019', padding: '4rem 4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#FBF7F2' }}>Gift<em style={{ fontStyle: 'italic', color: '#C99A54' }}>Soul</em></div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Marketplace', '/marketplace'], ['Creators', '/creators']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: '.85rem', color: 'rgba(251,247,242,.45)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: '.75rem', color: 'rgba(251,247,242,.28)' }}>© 2026 GiftSoul.</div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .gs-nav { padding: 0 1.25rem !important; }
          .gs-nav-links { display: none !important; }
          .gs-nav-burger { display: flex !important; }
          .gs-breadcrumb { padding: 90px 1.5rem 0 !important; }
          .gs-product-layout { grid-template-columns: 1fr !important; padding: 1.5rem !important; gap: 1.5rem !important; }
          .gs-gallery { position: static !important; }
          footer { padding: 3rem 1.5rem 2rem !important; }
        }
      `}</style>
    </div>
  )
}
