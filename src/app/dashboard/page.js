'use client'
import Link from 'next/link'
import { useState } from 'react'
import ImageUpload from '../components/ImageUpload'
import { useRequireAuth } from '../lib/useRequireAuth'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user, loading: authLoading } = useRequireAuth()

  const [activeTab, setActiveTab] = useState('overview')
  const [toggles, setToggles] = useState({ candle: true, rose: true, gift: false })

  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: '', description: '', images: [], product_type: 'handmade'
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
    { icon: '🕯️', bg: '#FFF3E0', name: 'Lavender soy candle', price: '₹480', sales: 22, views: 340, key: 'candle', images: [], product_type: 'handmade' },
    { icon: '🌸', bg: '#E8F5E9', name: 'Rose & chamomile candle', price: '₹520', sales: 18, views: 210, key: 'rose', images: [], product_type: 'handmade' },
    { icon: '🎁', bg: '#FFF9C4', name: 'Candle gift set (3 pack)', price: '₹1,200', sales: 8, views: 180, key: 'gift', images: [], product_type: 'handmade' },
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
            bg: '#F6F1E9',
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
        setNewProduct({ name: '', price: '', category: '', description: '', images: [], product_type: 'handmade' })
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F1E9' }}>
        <p style={{ color: '#5E4E3A', fontFamily: 'DM Sans, sans-serif' }}>Loading...</p>
      </div>
    )
  }
  if (!user) return null
  // ---------------------

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '240px 1fr', background: '#F6F1E9' }}>

      {/* SIDEBAR */}
      <div style={{ background: '#241809', position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,.07)', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', fontWeight: 400, color: '#F6F1E9', textDecoration: 'none', display: 'block', marginBottom: '1.2rem' }}>
            Gift<em style={{ fontStyle: 'italic', color: '#C06B4F' }}>Soul</em>
          </Link>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.2rem', color: '#241809', marginBottom: '.7rem' }}>
            {(user.email || '?')[0].toUpperCase()}
          </div>
          <div style={{ fontSize: '.9rem', color: '#F6F1E9', fontWeight: 500, wordBreak: 'break-all' }}>{user.email}</div>
        </div>
        <div>
          <div style={{ fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(246,241,233,.25)', padding: '.8rem 1.5rem .4rem' }}>Overview</div>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.8rem', width: '100%', padding: '.65rem 1.5rem',
                fontSize: '.82rem', color: activeTab === item.id ? '#F6F1E9' : 'rgba(246,241,233,.45)',
                background: activeTab === item.id ? 'rgba(255,255,255,.07)' : 'transparent', border: 'none',
                borderRight: activeTab === item.id ? '2px solid #A8501F' : '2px solid transparent',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {item.label}
              {item.badge && <span style={{ background: '#A8501F', color: 'white', fontSize: '.62rem', padding: '.15rem .5rem', borderRadius: '10px', marginLeft: 'auto' }}>{item.badge}</span>}
            </button>
          ))}
          <div style={{ padding: '1.5rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <Link href="/creator-profile" style={{ fontSize: '.78rem', color: 'rgba(246,241,233,.45)', textDecoration: 'none', display: 'block', marginBottom: '.5rem' }}>View my shop →</Link>
            <Link href="/" style={{ fontSize: '.78rem', color: 'rgba(246,241,233,.45)', textDecoration: 'none', display: 'block', marginBottom: '.5rem' }}>← Back to GiftSoul</Link>
            <button
              onClick={handleLogout}
              style={{ fontSize: '.78rem', color: 'rgba(246,241,233,.45)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'DM Sans, sans-serif' }}
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
            <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#A8501F', marginBottom: '.5rem' }}>Creator dashboard</p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#241809', marginBottom: '2rem' }}>
              Good morning, <em style={{ fontStyle: 'italic', color: '#A8501F' }}>{user.email.split('@')[0]}</em>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '16px', padding: '1.25rem 1.4rem' }}>
                  <div style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A6A5A', marginBottom: '.5rem' }}>{s.label}</div>
                  <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.2rem', fontWeight: 400, color: '#241809', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '.72rem', marginTop: '.4rem', color: s.up === true ? '#3D6B3A' : s.up === false ? '#A8501F' : '#7A6A5A' }}>{s.change}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#ECE2D0', border: '1px solid #D6C2A0', borderRadius: '16px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'flex-start', gap: '.8rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#A8501F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', color: 'white', flexShrink: 0, fontWeight: 600 }}>AI</div>
              <div style={{ fontSize: '.82rem', color: '#5E4E3A', lineHeight: 1.6 }}>
                <strong style={{ color: '#241809' }}>This week&apos;s insight:</strong> Your candles are being matched to &ldquo;grief &amp; comfort&rdquo; stories 34% more than last month. Add a product description that speaks to difficult moments to increase matches.
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.3rem', color: '#241809' }}>Recent enquiries</div>
                <button onClick={() => setActiveTab('enquiries')} style={{ fontSize: '.78rem', color: '#A8501F', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>View all →</button>
              </div>
              {enquiries.slice(0, 3).map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', padding: '.9rem 0', borderBottom: i < 2 ? '1px solid #ECE2D0' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#241809' }}>{e.name} · {e.city}</div>
                    <div style={{ fontSize: '.78rem', color: '#5E4E3A', fontStyle: 'italic', marginTop: '.1rem' }}>&quot;{e.msg}&quot;</div>
                  </div>
                  <span style={{ fontSize: '.68rem', padding: '.22rem .8rem', borderRadius: '2rem', background: e.status === 'new' ? 'rgba(168,80,31,.1)' : 'rgba(61,107,58,.1)', border: `1px solid ${e.status === 'new' ? 'rgba(168,80,31,.25)' : 'rgba(61,107,58,.25)'}`, color: e.status === 'new' ? '#A8501F' : '#3D6B3A', whiteSpace: 'nowrap' }}>{e.status === 'new' ? 'New' : 'Replied'}</span>
                  <button style={{ padding: '.3rem .8rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #D6C2A0', background: 'transparent', color: '#5E4E3A', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Reply</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div>
            <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#A8501F', marginBottom: '.5rem' }}>Inbox</p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#241809', marginBottom: '2rem' }}>Your <em style={{ color: '#A8501F' }}>enquiries</em></h1>
            <div style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', padding: '1.5rem' }}>
              {enquiries.map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'center', padding: '.9rem 0', borderBottom: i < enquiries.length - 1 ? '1px solid #ECE2D0' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#241809' }}>{e.name} · {e.city}</div>
                    <div style={{ fontSize: '.78rem', color: '#5E4E3A', fontStyle: 'italic', marginTop: '.1rem' }}>&quot;{e.msg}&quot;</div>
                    <div style={{ fontSize: '.72rem', color: '#BE9A66', marginTop: '.2rem' }}>{e.product}</div>
                  </div>
                  <span style={{ fontSize: '.7rem', color: '#5E4E3A', whiteSpace: 'nowrap' }}>{e.date}</span>
                  <span style={{ fontSize: '.68rem', padding: '.22rem .8rem', borderRadius: '2rem', background: e.status === 'new' ? 'rgba(168,80,31,.1)' : 'rgba(61,107,58,.1)', border: `1px solid ${e.status === 'new' ? 'rgba(168,80,31,.25)' : 'rgba(61,107,58,.25)'}`, color: e.status === 'new' ? '#A8501F' : '#3D6B3A', whiteSpace: 'nowrap' }}>{e.status === 'new' ? 'New' : 'Replied'}</span>
                  <button style={{ padding: '.3rem .8rem', borderRadius: '2rem', fontSize: '.72rem', border: '1px solid #D6C2A0', background: 'transparent', color: '#5E4E3A', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
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
                <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#A8501F', marginBottom: '.5rem' }}>Listings</p>
                <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#241809' }}>Your <em style={{ color: '#A8501F' }}>gift listings</em></h1>
              </div>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{ padding: '.75rem 1.6rem', background: '#A8501F', color: 'white', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontSize: '.85rem', fontWeight: 500 }}
                >
                  + Add new product
                </button>
              )}
            </div>

            {showAddForm && (
              <div style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A6A5A', marginBottom: '1.25rem' }}>New product</p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7A6A5A', display: 'block', marginBottom: '.5rem' }}>Product photo</label>
                  <ImageUpload
                    bucket="product-images"
                    folder="general"
                    label="Upload product photo"
                    onUploaded={(url) => setNewProduct(p => ({ ...p, images: [...p.images, url] }))}
                  />
                  {newProduct.images.length > 0 && (
                    <p style={{ fontSize: '.75rem', color: '#3D6B3A', marginTop: '.5rem' }}>✓ {newProduct.images.length} photo{newProduct.images.length > 1 ? 's' : ''} uploaded</p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#7A6A5A', display: 'block', marginBottom: '.4rem' }}>Product name</label>
                    <input
                      value={newProduct.name}
                      onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                      placeholder="Hand-poured lavender candle"
                      style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #D9CDB8', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#7A6A5A', display: 'block', marginBottom: '.4rem' }}>Price (₹)</label>
                    <input
                      value={newProduct.price}
                      onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                      placeholder="480"
                      style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #D9CDB8', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '13px', color: '#7A6A5A', display: 'block', marginBottom: '.4rem' }}>Category</label>
                  <input
                    value={newProduct.category}
                    onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                    placeholder="Candles"
                    style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #D9CDB8', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7A6A5A', display: 'block', marginBottom: '.5rem' }}>Product type</label>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    {['handmade', 'manufactured'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewProduct(p => ({ ...p, product_type: t }))}
                        style={{
                          padding: '.5rem 1.1rem', borderRadius: '2rem', fontSize: '.82rem', cursor: 'pointer',
                          border: newProduct.product_type === t ? '1px solid #A8501F' : '1px solid #D9CDB8',
                          background: newProduct.product_type === t ? 'rgba(168,80,31,.08)' : 'white',
                          color: newProduct.product_type === t ? '#A8501F' : '#5E4E3A',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                      >
                        {t === 'handmade' ? '✋ Handmade' : '📦 Manufactured / Sourced'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '13px', color: '#7A6A5A', display: 'block', marginBottom: '.4rem' }}>Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                    placeholder="Made with 100% natural soy wax, hand-poured in small batches..."
                    style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #D9CDB8', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', resize: 'vertical' }}
                  />
                </div>

                {saveError && (
                  <div style={{ background: '#FEF3EE', border: '1px solid rgba(168,80,31,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontSize: '.82rem', color: '#A8501F' }}>
                    {saveError}
                  </div>
                )}
                {saveSuccess && (
                  <div style={{ background: '#EAF3DE', border: '1px solid rgba(61,107,58,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontSize: '.82rem', color: '#3D6B3A' }}>
                    ✓ Product saved!
                  </div>
                )}

                <div style={{ display: 'flex', gap: '.8rem' }}>
                  <button
                    onClick={() => { setShowAddForm(false); setSaveError('') }}
                    disabled={saving}
                    style={{ padding: '.6rem 1.4rem', border: '1px solid #D9CDB8', borderRadius: '2rem', background: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={saving}
                    style={{ padding: '.6rem 1.4rem', background: saving ? '#C4A882' : '#A8501F', color: 'white', border: 'none', borderRadius: '2rem', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem', fontWeight: 500 }}
                  >
                    {saving ? 'Saving...' : 'Save product'}
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', padding: '1.5rem' }}>
              {products.map((p, i) => (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.9rem 0', borderBottom: i < products.length - 1 ? '1px solid #ECE2D0' : 'none' }}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{p.icon}</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <div style={{ fontSize: '.9rem', fontWeight: 500, color: '#241809' }}>{p.name}</div>
                      {p.product_type === 'manufactured' && (
                        <span style={{ fontSize: '.6rem', letterSpacing: '.06em', textTransform: 'uppercase', padding: '.15rem .55rem', borderRadius: '10px', background: '#E6F1FB', color: '#185FA5' }}>
                          Sourced
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '.75rem', color: '#5E4E3A' }}>{p.price} · Made to order</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '.88rem', fontWeight: 500, color: '#241809' }}>{p.sales} sales</div>
                    <div style={{ fontSize: '.72rem', color: '#5E4E3A' }}>{p.views} views</div>
                  </div>
                  <button style={{ padding: '.4rem 1rem', border: '1px solid #D9CDB8', borderRadius: '2rem', background: 'transparent', color: '#5E4E3A', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Edit</button>
                  <div
                    onClick={() => setToggles(t => ({ ...t, [p.key]: !t[p.key] }))}
                    style={{ width: '36px', height: '20px', background: toggles[p.key] ? '#3D6B3A' : '#D9CDB8', borderRadius: '10px', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
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
            <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#A8501F', marginBottom: '.5rem' }}>Settings</p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, color: '#241809', marginBottom: '2rem' }}>Edit your <em style={{ color: '#A8501F' }}>profile</em></h1>
            <div style={{ background: 'white', border: '1px solid #D6C2A0', borderRadius: '20px', padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {[['First name', ''], ['Last name', ''], ['Shop name', ''], ['City', '']].map(([label, val]) => (
                  <div key={label}>
                    <label style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A6A5A', display: 'block', marginBottom: '.4rem' }}>{label}</label>
                    <input defaultValue={val} style={{ width: '100%', border: '1px solid #D9CDB8', borderRadius: '8px', padding: '.65rem 1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'white', color: '#241809', outline: 'none' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A6A5A', display: 'block', marginBottom: '.4rem' }}>Instagram (optional)</label>
                <input placeholder="https://instagram.com/yourhandle" style={{ width: '100%', border: '1px solid #D9CDB8', borderRadius: '8px', padding: '.65rem 1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', background: 'white', color: '#241809', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A6A5A', display: 'block', marginBottom: '.4rem' }}>Your story (bio)</label>
                <textarea rows={5} placeholder="Tell your story..." style={{ width: '100%', border: '1px solid #D9CDB8', borderRadius: '8px', padding: '.65rem 1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <button onClick={() => alert('Profile saved!')} style={{ padding: '.7rem 2rem', background: '#A8501F', color: 'white', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem', fontWeight: 500 }}>
                Save changes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}