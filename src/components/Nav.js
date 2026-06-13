'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link href="/" className="nav-logo">Gift<em>Soul</em></Link>
      <div className="nav-links">
        <Link href="/marketplace">Browse gifts</Link>
        <Link href="/marketplace">By emotion</Link>
        <Link href="/creators">Creators</Link>
        <Link href="/creator-register" className="nav-btn">Join as creator</Link>
      </div>
    </nav>
  )
}