'use client'
import Link from 'next/link'
import { useState } from 'react'
import ImageUpload from '../components/ImageUpload'
import { useRequireAuth } from '../lib/useRequireAuth'
import { supabase } from '../lib/supabase'
import { CATEGORIES, EMOTIONS, OCCASIONS, RECIPIENTS } from '../lib/constants'

export default function Dashboard() {
  const { user, loading: authLoading } = useRequireAuth()

  const [activeTab, setActiveTab] = useState('overview')
  const [toggles, setToggles] = useState({ candle: true, rose: true, gift: false })

  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: '', description: '', images: [], product_type: 'handmade',
    emotion_tags: [], occasion_tags: [], recipient_tags: [], lead_time_days: '5',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const stats = [
    { label: 'Total earnings', val: '₹23,040', change: '↑ 18% this month', up: true },
    { label: 'Total sales', val: '48', change: '↑ 6 this week', up: true },
    { label: 'Profile views', val: '1,204', change: '↑ 24% this month', up: true },
    { label: 'Avg. rating', val: '4.9 ★', change: '48 reviews', up: null },
  ]

  const enquiries = [
    { name: 'Riya Desai', city: 'Mumbai', msg: "Something warm for my mum's retirement...", product: 'Lavender soy candle', status: 'new', date: 'Today' },
    { name: 'Kabir Mehta', city: 'Delhi', msg: 'Can I get rose & oud in a large size?', product: 'Rose & chamomile', status: 'new', date: 'Yesterday' },
    { name: 'Priya Iyer', city: 'Chennai', msg: "Can you add a custom label with my friend's name?", product: 'Gift set (3 pack)', status: 'new', date: '2 days ago' },
    { name: 'Anika Singh', city: 'Bengaluru', msg: 'Custom order for a baby shower, 10 units', product: 'Gift set (3 pack)', status: 'replied', date: '4 days ago' },
  ]

  const [products, setProducts] = useState([
    { icon: '🕯️', bg: '#F3E8DC', name: 'Lavender soy candle', price: '₹480', sales: 22, views: 340, key: 'candle', images: [], product_type: 'handmade' },
    { icon: '🌸', bg: '#EAF3E1', name: 'Rose & chamomile candle', price: '₹520', sales: 18, views: 210, key: 'rose', images: [], product_type: 'handmade' },
    { icon: '🎁', bg: '#F7EAC8', name: 'Candle gift set (3 pack)', price: '₹1,200', sales: 8, views: 180, key: 'gift', images: [], product_type: 'handmade' },
  ])

  const sidebarItems = [
    { id: 'overview', label: '📊 Dashboard' },
    { id: 'enquiries', label: '✉️ Enquiries', badge: 3 },
    { id: 'products', label: '🎁 My products' },
    { id: 'profile', label: '👤 Edit profile' },
  ]

  async function handleSaveProduct() {
    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      setSaveError('Please add a product name and price.')
      return
    }
    setSaveError('')
    setSaving(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          base_price: parseInt(newProduct.price.replace(/[^\d]/g, ''), 10) || 0,
          category: newProduct.category || 'General',
          images: newProduct.images,
          product_type: newProduct.product_type,
          emotion_tags: newProduct.emotion_tags,
          occasion_tags: newProduct.occasion_tags,
          recipient_tags: newProduct.recipient_tags,
          lead_time_days: parseInt(newProduct.lead_time_days, 10) || 5,
        })
      })
      const data = await res.json()

      if (data.error) {
        setSaveError(data.error)
      } else {
        setProducts(p => [
          {
            icon: newProduct.images[0] ? null : '🎁',
            image: newProduct.images[0] || null,
            bg: '#FBF7F2',
            name: newProduct.name,
            price: `₹${newProduct.price}`,
            sales: 0,
            views: 0,
            key: `new-${Date.now()}`,
            product_type: newProduct.product_type,
          },
          ...p
        ])
        setSaveSuccess(true)
        setNewProduct({ name: '', price: '', category: '', description: '', images: [], product_type: 'handmade', emotion_tags: [], occasion_tags: [], recipient_tags: [], lead_time_days: '5' })
        setTimeout(() => { setShowAddForm(false); setSaveSuccess(false) }, 1200)
      }
    } catch (e) {
      setSaveError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // ---- AUTH GATES ----
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF7F2' }}>
        <p style={{ color: '#7C6B60', fontFamily: 'DM Sans, sans-serif' }}>Loading...</p>
      </div>
    )
  }
  if (!user) return null
  // ---------------------

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '240px 1fr', background: '#FBF7F2' }}>

      {/* SIDEBAR */}
      <div style={{ background: '#2B2019', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,.07)', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#FBF7F2', textDecoration: 'none', display: 'block', marginBottom: '1.2rem' }}>
            Gift<em style={{ fontStyle: 'italic', color: '#C99A54' }}>Soul</em>
          </Link>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F3E8DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.2rem', color: '#2B2019', marginBottom: '.7rem' }}>
            {(user.email || '?')[0].toUpperCase()}
          </div>
          <div style={{ fontSize: '.9rem', color: '#FBF7F2', fontWeight: 500, wordBreak: 'break-all' }}>{user.email}</div>
        </div>
        <div>
          <div style={{ fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(251,247,242,.25)', padding: '.8rem 1.5rem .4rem' }}>Overview</div>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.8rem', width: '100%', padding: '.65rem 1.5rem',
                fontSize: '.82rem', color: activeTab === item.id ? '#FBF7F2' : 'rgba(251,247,242,.45)',
                background: activeTab === item.id ? 'rgba(255,255,255,.07)' : 'transparent', border: 'none',
                borderRight: activeTab === item.id ? '2px solid #B5533C' : '2px solid transparent',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {item.label}
              {item.badge && <span style={{ background: '#B5533C', color: 'white', fontSize: '.62rem', padding: '.15rem .5rem', borderRadius: '10px', marginLeft: 'auto' }}>{item.badge}</span>}
            </button>
          ))}
          <div style={{ padding: '1.5rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <Link href="/creator-profile" style={{ fontSize: '.78rem', color: 'rgba(251,247,242,.45)', textDecoration: 'none', display: 'block', marginBottom: '.5rem' }}>View my shop →</Link>
            <Link href="/" style={{ fontSize: '.78rem', color: 'rgba(251,247,242,.45)', textDecoration: 'none', display: 'block', marginBottom: '.5rem' }}>← Back to GiftSoul</Link>
            <button
              onClick={handleLogout}
              style={{ fontSize: '.78rem', color: 'rgba(251,247,242,.45)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'DM Sans, sans-serif' }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ padding: '2.5rem', overflowY: 'auto' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.5rem' }}>Creator dashboard</p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#2B2019', marginBottom: '2rem' }}>
              Good morning, <em style={{ fontStyle: 'italic', color: '#B5533C' }}>{user.email.split('@')[0]}</em>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '16px', padding: '1.25rem 1.4rem' }}>
                  <div style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', marginBottom: '.5rem' }}>{s.label}</div>
                  <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.2rem', fontWeight: 400, color: '#2B2019', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '.72rem', marginTop: '.4rem', color: s.up === true ? '#4A6B3C' : s.up === false ? '#B5533C' : '#7C6B60' }}>{s.change}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '16px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'flex-start', gap: '.8rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#B5533C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', color: 'white', flexShrink: 0, fontWeight: 600 }}>AI</div>
              <div style={{ fontSize: '.82rem', color: '#7C6B60', lineHeight: 1.6 }}>
                <strong style={{ color: '#2B2019' }}>This week&apos;s insight:</strong> Your candles are being matched to &ldquo;grief &amp; comfort&rdquo; stories 34% more than last month. Add a product description that speaks to difficult moments to increase matches.
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#2B2019' }}>Recent enquiries</div>
                <button onClick={() => setActiveTab('enquiries')} style={{ fontSize: '.78rem', color: '#B5533C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>View all →</button>
              </div>
              {enquiries.slice(0, 3).map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', padding: '.9rem 0', borderBottom: i < 2 ? '1px solid #E4D3BE' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#2B2019' }}>{e.name} · {e.city}</div>
                    <div style={{ fontSize: '.78rem', color: '#7C6B60', fontStyle: 'italic', marginTop: '.1rem' }}>&quot;{e.msg}&quot;</div>
                  </div>
                  <span style={{ fontSize: '.68rem', padding: '.22rem .8rem', borderRadius: '2rem', background: e.status === 'new' ? 'rgba(181,83,60,.1)' : 'rgba(74,107,60,.1)', border: `1px solid ${e.status === 'new' ? 'rgba(181,83,60,.25)' : 'rgba(74,107,60,.25)'}`, color: e.status === 'new' ? '#B5533C' : '#4A6B3C', whiteSpace: 'nowrap' }}>{e.status === 'new' ? 'New' : 'Replied'}</span>
                  <button style={{ padding: '.3rem .8rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #E4D3BE', background: 'transparent', color: '#7C6B60', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Reply</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div>
            <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.5rem' }}>Inbox</p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#2B2019', marginBottom: '2rem' }}>Your <em style={{ color: '#B5533C' }}>enquiries</em></h1>
            <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.5rem' }}>
              {enquiries.map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'center', padding: '.9rem 0', borderBottom: i < enquiries.length - 1 ? '1px solid #E4D3BE' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#2B2019' }}>{e.name} · {e.city}</div>
                    <div style={{ fontSize: '.78rem', color: '#7C6B60', fontStyle: 'italic', marginTop: '.1rem' }}>&quot;{e.msg}&quot;</div>
                    <div style={{ fontSize: '.72rem', color: '#C99A54', marginTop: '.2rem' }}>{e.product}</div>
                  </div>
                  <span style={{ fontSize: '.7rem', color: '#7C6B60', whiteSpace: 'nowrap' }}>{e.date}</span>
                  <span style={{ fontSize: '.68rem', padding: '.22rem .8rem', borderRadius: '2rem', background: e.status === 'new' ? 'rgba(181,83,60,.1)' : 'rgba(74,107,60,.1)', border: `1px solid ${e.status === 'new' ? 'rgba(181,83,60,.25)' : 'rgba(74,107,60,.25)'}`, color: e.status === 'new' ? '#B5533C' : '#4A6B3C', whiteSpace: 'nowrap' }}>{e.status === 'new' ? 'New' : 'Replied'}</span>
                  <button style={{ padding: '.3rem .8rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #E4D3BE', background: 'transparent', color: '#7C6B60', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                    {e.status === 'new' ? 'Reply' : 'View'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.5rem' }}>Listings</p>
                <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#2B2019' }}>Your <em style={{ color: '#B5533C' }}>gift listings</em></h1>
              </div>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{ padding: '.75rem 1.6rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontSize: '.85rem', fontWeight: 500 }}
                >
                  + Add new product
                </button>
              )}
            </div>

            {showAddForm && (
              <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7C6B60', marginBottom: '1.25rem' }}>New product</p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.5rem' }}>Product photo</label>
                  <ImageUpload
                    bucket="product-images"
                    folder="general"
                    label="Upload product photo"
                    onUploaded={(url) => setNewProduct(p => ({ ...p, images: [...p.images, url] }))}
                  />
                  {newProduct.images.length > 0 && (
                    <p style={{ fontSize: '.75rem', color: '#4A6B3C', marginTop: '.5rem' }}>✓ {newProduct.images.length} photo{newProduct.images.length > 1 ? 's' : ''} uploaded</p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Product name</label>
                    <input
                      value={newProduct.name}
                      onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                      placeholder="Hand-poured lavender candle"
                      style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #E4D3BE', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Price (₹)</label>
                    <input
                      value={newProduct.price}
                      onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                      placeholder="480"
                      style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #E4D3BE', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                    style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #E4D3BE', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'white', cursor: 'pointer' }}
                  >
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.label}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.5rem' }}>
                    Which feelings does this gift connect with? <span style={{ color: '#B5533C' }}>(helps buyers find it by emotion)</span>
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                    {EMOTIONS.map(em => {
                      const active = newProduct.emotion_tags.includes(em)
                      return (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNewProduct(p => ({
                            ...p,
                            emotion_tags: active ? p.emotion_tags.filter(x => x !== em) : [...p.emotion_tags, em]
                          }))}
                          style={{
                            padding: '.35rem .9rem', borderRadius: '2rem', fontSize: '.78rem', textTransform: 'capitalize', cursor: 'pointer',
                            border: active ? '1px solid #B5533C' : '1px solid #E4D3BE',
                            background: active ? '#B5533C' : 'white',
                            color: active ? 'white' : '#7C6B60',
                            fontFamily: 'DM Sans, sans-serif'
                          }}
                        >
                          {em}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.5rem' }}>
                    Good for which occasions? <span style={{ color: '#B5533C' }}>(optional)</span>
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                    {OCCASIONS.map(o => {
                      const active = newProduct.occasion_tags.includes(o.value)
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setNewProduct(p => ({
                            ...p,
                            occasion_tags: active ? p.occasion_tags.filter(x => x !== o.value) : [...p.occasion_tags, o.value]
                          }))}
                          style={{
                            padding: '.35rem .9rem', borderRadius: '2rem', fontSize: '.78rem', cursor: 'pointer',
                            border: active ? '1px solid #B5533C' : '1px solid #E4D3BE',
                            background: active ? '#B5533C' : 'white',
                            color: active ? 'white' : '#7C6B60',
                            fontFamily: 'DM Sans, sans-serif'
                          }}
                        >
                          {o.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.5rem' }}>
                    Who is this gift usually for? <span style={{ color: '#B5533C' }}>(optional)</span>
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                    {RECIPIENTS.map(r => {
                      const active = newProduct.recipient_tags.includes(r.value)
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setNewProduct(p => ({
                            ...p,
                            recipient_tags: active ? p.recipient_tags.filter(x => x !== r.value) : [...p.recipient_tags, r.value]
                          }))}
                          style={{
                            padding: '.35rem .9rem', borderRadius: '2rem', fontSize: '.78rem', cursor: 'pointer',
                            border: active ? '1px solid #B5533C' : '1px solid #E4D3BE',
                            background: active ? '#B5533C' : 'white',
                            color: active ? 'white' : '#7C6B60',
                            fontFamily: 'DM Sans, sans-serif'
                          }}
                        >
                          {r.icon} {r.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Lead time (days to make & ship)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.lead_time_days}
                    onChange={e => setNewProduct(p => ({ ...p, lead_time_days: e.target.value }))}
                    placeholder="5"
                    style={{ width: '140px', padding: '.65rem 1rem', border: '1px solid #E4D3BE', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.5rem' }}>Product type</label>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    {['handmade', 'manufactured'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewProduct(p => ({ ...p, product_type: t }))}
                        style={{
                          padding: '.5rem 1.1rem', borderRadius: '2rem', fontSize: '.82rem', cursor: 'pointer',
                          border: newProduct.product_type === t ? '1px solid #B5533C' : '1px solid #E4D3BE',
                          background: newProduct.product_type === t ? 'rgba(181,83,60,.08)' : 'white',
                          color: newProduct.product_type === t ? '#B5533C' : '#7C6B60',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                      >
                        {t === 'handmade' ? '✋ Handmade' : '📦 Manufactured / Sourced'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                    placeholder="Made with 100% natural soy wax, hand-poured in small batches..."
                    style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #E4D3BE', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', resize: 'vertical' }}
                  />
                </div>

                {saveError && (
                  <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontSize: '.82rem', color: '#B5533C' }}>
                    {saveError}
                  </div>
                )}
                {saveSuccess && (
                  <div style={{ background: '#EAF3E1', border: '1px solid rgba(74,107,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontSize: '.82rem', color: '#4A6B3C' }}>
                    ✓ Product saved!
                  </div>
                )}

                <div style={{ display: 'flex', gap: '.8rem' }}>
                  <button
                    onClick={() => { setShowAddForm(false); setSaveError('') }}
                    disabled={saving}
                    style={{ padding: '.6rem 1.4rem', border: '1px solid #E4D3BE', borderRadius: '2rem', background: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={saving}
                    style={{ padding: '.6rem 1.4rem', background: saving ? '#C99A54' : '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem', fontWeight: 500 }}
                  >
                    {saving ? 'Saving...' : 'Save product'}
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.5rem' }}>
              {products.map((p, i) => (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.9rem 0', borderBottom: i < products.length - 1 ? '1px solid #E4D3BE' : 'none' }}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{p.icon}</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <div style={{ fontSize: '.9rem', fontWeight: 500, color: '#2B2019' }}>{p.name}</div>
                      {p.product_type === 'manufactured' && (
                        <span style={{ fontSize: '.6rem', letterSpacing: '.06em', textTransform: 'uppercase', padding: '.15rem .55rem', borderRadius: '10px', background: '#EAF1F7', color: '#3E6E8E' }}>
                          Sourced
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#7C6B60' }}>{p.price} · Made to order</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#2B2019' }}>{p.sales} sales</div>
                    <div style={{ fontSize: '.72rem', color: '#7C6B60' }}>{p.views} views</div>
                  </div>
                  <button style={{ padding: '.4rem 1rem', border: '1px solid #E4D3BE', borderRadius: '2rem', background: 'transparent', color: '#7C6B60', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Edit</button>
                  <div
                    onClick={() => setToggles(t => ({ ...t, [p.key]: !t[p.key] }))}
                    style={{ width: '36px', height: '20px', background: toggles[p.key] ? '#4A6B3C' : '#E4D3BE', borderRadius: '10px', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: toggles[p.key] ? '19px' : '3px', transition: 'left .2s' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.5rem' }}>Settings</p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#2B2019', marginBottom: '2rem' }}>Edit your <em style={{ color: '#B5533C' }}>profile</em></h1>
            <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {[['First name', ''], ['Last name', ''], ['Shop name', ''], ['City', '']].map(([label, val]) => (
                  <div key={label}>
                    <label style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>{label}</label>
                    <input defaultValue={val} style={{ width: '100%', border: '1px solid #E4D3BE', borderRadius: '8px', padding: '.65rem 1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'white', color: '#2B2019', outline: 'none' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Instagram (optional)</label>
                <input placeholder="https://instagram.com/yourhandle" style={{ width: '100%', border: '1px solid #E4D3BE', borderRadius: '8px', padding: '.65rem 1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'white', color: '#2B2019', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Your story (bio)</label>
                <textarea rows={5} placeholder="Tell your story..." style={{ width: '100%', border: '1px solid #E4D3BE', borderRadius: '8px', padding: '.65rem 1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <button onClick={() => alert('Profile saved!')} style={{ padding: '.7rem 2rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem', fontWeight: 500 }}>
                Save changes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}