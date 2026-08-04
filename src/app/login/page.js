'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

// Turn raw Supabase auth errors into guidance a person can act on.
function friendlyAuthError(message = '') {
  const m = message.toLowerCase()
  if (m.includes('email not confirmed') || m.includes('not confirmed'))
    return 'Please confirm your email first — check your inbox (and spam) for the confirmation link, then log in.'
  if (m.includes('invalid login credentials'))
    return 'Wrong email or password. If you just signed up, you may still need to confirm your email before logging in.'
  if (m.includes('already registered') || m.includes('already exists') || m.includes('user already'))
    return 'An account with this email already exists. Try logging in instead.'
  if (m.includes('provider is not enabled') || m.includes('unsupported provider'))
    return 'Google sign-in isn’t enabled yet. Turn on the Google provider in Supabase, or use email and password.'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a minute and try again.'
  return message || 'Something went wrong. Please try again.'
}

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

const Spinner = ({ dark }) => (
  <span
    style={{
      display: 'inline-block', width: '15px', height: '15px', verticalAlign: '-2px',
      border: `2px solid ${dark ? 'rgba(43,32,25,.25)' : 'rgba(255,255,255,.45)'}`,
      borderTopColor: dark ? '#2B2019' : '#fff', borderRadius: '50%',
      animation: 'gs-spin .6s linear infinite',
    }}
  />
)

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [accountType, setAccountType] = useState('buyer') // 'buyer' | 'creator'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    let active = true

    // Password-reset links land back here carrying a recovery token. Show the
    // "set a new password" form instead of redirecting the user away.
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const isRecovery = hash.includes('type=recovery') || search.includes('type=recovery')

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true)
    })

    if (isRecovery) {
      setRecoveryMode(true)
    } else {
      // Already signed in? Skip the form and route onward.
      supabase.auth.getSession().then(async ({ data }) => {
        if (!active || !data.session) return
        try {
          const res = await fetch(`/api/creators?user_id=${data.session.user.id}`)
          const cd = await res.json()
          router.replace(cd.creator ? '/dashboard' : '/')
        } catch {
          router.replace('/')
        }
      })
    }

    return () => { active = false; sub.subscription.unsubscribe() }
  }, [router])

  async function handleUpdatePassword(e) {
    e.preventDefault()
    setError(''); setMessage('')
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError
      // Clear the recovery token from the URL, then take them into the app.
      if (typeof window !== 'undefined') window.history.replaceState(null, '', '/login')
      const { data: { user } } = await supabase.auth.getUser()
      try {
        const res = await fetch(`/api/creators?user_id=${user.id}`)
        const cd = await res.json()
        router.replace(cd.creator ? '/dashboard' : '/')
      } catch {
        router.replace('/')
      }
    } catch (err) {
      setError(friendlyAuthError(err.message))
      setLoading(false)
    }
  }

  function switchMode(next) {
    setMode(next); setError(''); setMessage(''); setNeedsConfirm(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setMessage(''); setNeedsConfirm(false)

    const cleanEmail = email.trim()
    if (!cleanEmail || !password) { setError('Please enter your email and password.'); return }
    if (!isValidEmail(cleanEmail)) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: name.trim(), account_type: accountType },
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
          },
        })
        if (signupError) throw signupError

        // Creators get a blank, linked profile row to complete in /creator-register.
        if (data.user && accountType === 'creator') {
          await fetch('/api/creators', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: data.user.id, name: name.trim(), shop_name: '', is_active: false }),
          })
        }

        setMessage('Account created! Check your email to confirm your address, then log in.')
        setMode('login')
        setPassword('')
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        if (loginError) throw loginError
        const res = await fetch(`/api/creators?user_id=${data.user.id}`)
        const creatorData = await res.json()
        router.push(creatorData.creator ? '/dashboard' : '/')
      }
    } catch (err) {
      const raw = err.message || ''
      if (raw.toLowerCase().includes('not confirmed')) setNeedsConfirm(true)
      setError(friendlyAuthError(raw))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(''); setMessage(''); setGoogleLoading(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined },
      })
      if (oauthError) throw oauthError
      // Success redirects the browser to Google; keep the spinner until then.
    } catch (err) {
      setError(friendlyAuthError(err.message))
      setGoogleLoading(false)
    }
  }

  async function handleForgotPassword() {
    setError(''); setMessage('')
    const cleanEmail = email.trim()
    if (!isValidEmail(cleanEmail)) { setError('Enter your email above first, then tap “Forgot password”.'); return }
    setLoading(true)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
      })
      if (resetError) throw resetError
      setMessage('Password reset link sent — check your email.')
    } catch (err) {
      setError(friendlyAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleResendConfirmation() {
    setError(''); setMessage('')
    const cleanEmail = email.trim()
    if (!isValidEmail(cleanEmail)) { setError('Enter your email above first.'); return }
    setLoading(true)
    try {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: cleanEmail })
      if (resendError) throw resendError
      setMessage('Confirmation email sent again — check your inbox and spam.')
      setNeedsConfirm(false)
    } catch (err) {
      setError(friendlyAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  // Password-recovery screen (shown after clicking a reset link).
  if (recoveryMode) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#FBF7F2 0%,#F5ECE1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <style>{`@keyframes gs-spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.1rem', fontWeight: 400, color: '#2B2019' }}>
              Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
            </span>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.88rem', color: '#7C6B60', marginTop: '.5rem' }}>Choose a new password</p>
          </div>
          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px -18px rgba(43,32,25,.35)' }}>
            <form onSubmit={handleUpdatePassword}>
              <label htmlFor="gs-newpass" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>New password</label>
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <input
                  id="gs-newpass"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  style={{ width: '100%', padding: '.7rem 3.5rem .7rem 1rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', color: '#2B2019', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: '.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.75rem', color: '#B5533C', fontWeight: 500 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {error && (
                <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: '#B5533C' }}>{error}</div>
              )}
              {message && (
                <div style={{ background: '#EAF3E1', border: '1px solid rgba(74,107,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: '#4A6B3C' }}>{message}</div>
              )}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '.8rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.92rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.85 : 1 }}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const busy = loading || googleLoading
  const tabStyle = (active) => ({
    flex: 1, padding: '.6rem', borderRadius: '2rem', border: 'none', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem', fontWeight: 500,
    transition: 'background .15s, color .15s',
    background: active ? '#B5533C' : 'transparent', color: active ? 'white' : '#7C6B60',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#FBF7F2 0%,#F5ECE1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <style>{`
        @keyframes gs-spin { to { transform: rotate(360deg); } }
        .gs-input { width:100%; padding:.7rem 1rem; border:1px solid #E4D3BE; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.9rem; color:#2B2019; background:white; outline:none; transition:border-color .15s, box-shadow .15s; }
        .gs-input::placeholder { color:#B9A794; }
        .gs-input:focus { border-color:#B5533C; box-shadow:0 0 0 3px rgba(181,83,60,.12); }
        .gs-primary { transition:background .15s, transform .05s; }
        .gs-primary:hover:not(:disabled) { background:#9C4633; }
        .gs-primary:active:not(:disabled) { transform:translateY(1px); }
        .gs-google:hover:not(:disabled) { background:#FBF7F2; border-color:#D9C4AC; }
        .gs-link { background:none; border:none; padding:0; cursor:pointer; color:#B5533C; font-family:'DM Sans',sans-serif; font-size:.8rem; }
        .gs-link:hover { text-decoration:underline; }
        .gs-link:disabled { opacity:.5; cursor:not-allowed; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.1rem', fontWeight: 400, color: '#2B2019', textDecoration: 'none' }}>
            Gift<em style={{ fontStyle: 'italic', color: '#B5533C' }}>Soul</em>
          </Link>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.88rem', color: '#7C6B60', marginTop: '.5rem' }}>
            {mode === 'login' ? 'Welcome back — log in to your account' : 'Create your GiftSoul account'}
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px -18px rgba(43,32,25,.35)' }}>
          <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.5rem', background: '#FBF7F2', borderRadius: '2rem', padding: '.3rem' }}>
            <button type="button" onClick={() => switchMode('login')} style={tabStyle(mode === 'login')}>Log in</button>
            <button type="button" onClick={() => switchMode('signup')} style={tabStyle(mode === 'signup')}>Sign up</button>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="gs-google"
            style={{
              width: '100%', padding: '.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem',
              background: 'white', border: '1px solid #E4D3BE', borderRadius: '2rem',
              fontFamily: 'DM Sans, sans-serif', fontSize: '.88rem', fontWeight: 500, color: '#2B2019',
              cursor: busy ? 'not-allowed' : 'pointer', opacity: busy && !googleLoading ? 0.6 : 1, transition: 'background .15s, border-color .15s',
            }}
          >
            {googleLoading ? <Spinner dark /> : <GoogleIcon />}
            <span>Continue with Google</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E4D3BE' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '.72rem', color: '#B9A794', letterSpacing: '.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#E4D3BE' }} />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {mode === 'signup' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.5rem' }}>I&apos;m signing up as a…</label>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    {[['buyer', '🎁 Buyer'], ['creator', '🧵 Creator']].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAccountType(val)}
                        style={{
                          flex: 1, padding: '.65rem', borderRadius: '10px', fontSize: '.85rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                          border: accountType === val ? '1.5px solid #B5533C' : '1px solid #E4D3BE',
                          background: accountType === val ? '#F9EAE6' : 'white',
                          color: accountType === val ? '#B5533C' : '#7C6B60',
                          transition: 'all .15s',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="gs-name" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Your name</label>
                  <input id="gs-name" className="gs-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" autoComplete="name" />
                </div>
              </>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="gs-email" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Email</label>
              <input id="gs-email" className="gs-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" inputMode="email" />
            </div>

            <div style={{ marginBottom: mode === 'login' ? '.6rem' : '1.25rem' }}>
              <label htmlFor="gs-password" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#7C6B60', display: 'block', marginBottom: '.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="gs-password"
                  className="gs-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  style={{ paddingRight: '3.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: '.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.75rem', color: '#B5533C', fontWeight: 500 }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
                <button type="button" className="gs-link" onClick={handleForgotPassword} disabled={busy}>Forgot password?</button>
              </div>
            )}

            {error && (
              <div style={{ background: '#F9EAE6', border: '1px solid rgba(181,83,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: '#B5533C', lineHeight: 1.5 }}>
                {error}
                {needsConfirm && (
                  <div style={{ marginTop: '.5rem' }}>
                    <button type="button" className="gs-link" onClick={handleResendConfirmation} disabled={busy}>Resend confirmation email</button>
                  </div>
                )}
              </div>
            )}
            {message && (
              <div style={{ background: '#EAF3E1', border: '1px solid rgba(74,107,60,.3)', borderRadius: '10px', padding: '.8rem 1rem', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif', fontSize: '.82rem', color: '#4A6B3C', lineHeight: 1.5 }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="gs-primary"
              style={{
                width: '100%', padding: '.8rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem',
                fontFamily: 'DM Sans, sans-serif', fontSize: '.92rem', fontWeight: 500,
                cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.85 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.55rem',
              }}
            >
              {loading && <Spinner />}
              {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '.8rem', color: '#7C6B60', marginTop: '1.25rem' }}>
            {mode === 'login' ? (
              <>New to GiftSoul? <button type="button" className="gs-link" onClick={() => switchMode('signup')}>Create an account</button></>
            ) : (
              <>Already have an account? <button type="button" className="gs-link" onClick={() => switchMode('login')}>Log in</button></>
            )}
          </p>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '.8rem', color: '#7C6B60', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#B5533C', textDecoration: 'none' }}>← Back to GiftSoul</Link>
        </p>
      </div>
    </div>
  )
}
