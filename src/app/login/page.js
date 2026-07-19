'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signupError) throw signupError

        // Create a blank creator row linked to this new user
        if (data.user) {
          await fetch('/api/creators', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: data.user.id,
              name: '',
              shop_name: '',
              is_active: false,
            })
          })
        }

        setMessage('Account created! Check your email to confirm, then log in.')
        setMode('login')
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (loginError) throw loginError

        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
            Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
          </Link>
          <p style={{ fontSize: '.85rem', color: '#7C6B60', marginTop: '.5rem' }}>
            {mode === 'login' ? 'Log in to your creator dashboard' : 'Create your creator account'}
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', background: '#FBF7F2', borderRadius: '2rem', padding: '.3rem' }}>
            <button
              onClick={() => { setMode('login'); setError(''); setMessage('') }}
              style={{
                flex: 1, padding: '.55rem', borderRadius: '2rem', border: 'none', cursor: 'pointer',
                fontSize: '.82rem', fontWeight: 500,
                background: mode === 'login' ? '#B5533C' : 'transparent',
                color: mode === 'login' ? 'white' : '#7C6B60'
              }}
            >
              Log in
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setMessage('') }}
              style={{
                flex: 1, padding: '.55rem', borderRadius: '2rem', border: 'none', cursor: 'pointer',
                fontSize: '.82rem', fontWeight: 500,
                background: mode === 'signup' ? '#B5533C' : 'transparent',
                color: mode === 'signup' ? 'white' : '#7C6B60'
              }}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #E4D3BE', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '.65rem 1rem', border: '1px solid #E4D3BE', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem' }}
              />
            </div>

            {error && (
              <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontSize: '.82rem', color: '#B5533C' }}>
                {error}
              </div>
            )}
            {message && (
              <div style={{ background: '#EAF3E1', border: '1px solid rgba(74,107,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontSize: '.82rem', color: '#4A6B3C' }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '.75rem', background: loading ? '#C99A54' : '#B5533C', color: 'white',
                border: 'none', borderRadius: '2rem', fontSize: '.9rem', fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '.8rem', color: '#7C6B60', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#B5533C', textDecoration: 'none' }}>← Back to GiftSoul</Link>
        </p>
      </div>
    </div>
  )
}