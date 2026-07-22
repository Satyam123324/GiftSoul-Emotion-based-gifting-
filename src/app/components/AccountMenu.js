'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuth, signOut } from '../lib/useAuth'
import { mergeLocalWishlistIntoDB } from '../lib/wishlist'

export default function AccountMenu() {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const merged = useRef(false)

  useEffect(() => {
    if (!user) { setIsCreator(false); merged.current = false; return }

    fetch(`/api/creators?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => setIsCreator(!!data.creator))
      .catch(() => {})

    // Fold any guest-mode wishlist saves into the real account, once per login.
    if (!merged.current) {
      merged.current = true
      mergeLocalWishlistIntoDB(user.id).catch(() => {})
    }
  }, [user])

  if (loading) return <div style={{ width: '60px' }} />

  if (!user) {
    return (
      <Link href="/login" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>
        Log in
      </Link>
    )
  }

  const initial = (user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#B5533C', color: 'white', border: 'none', cursor: 'pointer', fontSize: '.85rem', fontFamily: 'Cormorant Garamond, serif' }}
      >
        {initial}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 900 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + .8rem)', right: 0, background: 'white', border: '1px solid #E4D3BE', borderRadius: '14px', boxShadow: '0 12px 32px rgba(43,32,25,.12)', minWidth: '220px', padding: '.5rem', zIndex: 901 }}>
            <div style={{ padding: '.6rem .8rem', borderBottom: '1px solid #F3E8DC', marginBottom: '.4rem' }}>
              <div style={{ fontSize: '.82rem', color: '#2B2019', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.user_metadata?.full_name || 'Your account'}
              </div>
              <div style={{ fontSize: '.72rem', color: '#7C6B60', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
            {[
              ['♡ Saved gifts', '/wishlist'],
              ['🧵 Following', '/following'],
              ['📖 Gift timeline', '/timeline'],
              ['🧬 Gift DNA', '/gift-dna'],
              ['📅 Reminders', '/reminders'],
              ...(isCreator ? [['🧵 Creator dashboard', '/dashboard']] : []),
            ].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                style={{ display: 'block', padding: '.6rem .8rem', borderRadius: '8px', fontSize: '.83rem', color: '#2B2019', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F3E8DC'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {label}
              </Link>
            ))}
            <button
              onClick={async () => { await signOut(); setOpen(false); window.location.href = '/' }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '.6rem .8rem', borderRadius: '8px', fontSize: '.83rem', color: '#B5533C', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F9EAE6'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
