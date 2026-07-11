import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-brand">Gift<em>Soul</em></div>
          <div className="footer-tagline">Gifts that carry emotion,<br/>made by hand across India.</div>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <Link href="/marketplace">Browse gifts</Link>
          <Link href="/marketplace">By emotion</Link>
          <Link href="/creators">Creators</Link>
        </div>
        <div className="footer-col">
          <h4>Creators</h4>
          <Link href="/creator-register">Join as creator</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link href="#">About GiftSoul</Link>
          <Link href="#">Instagram</Link>
          <Link href="#">Contact</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 GiftSoul. Made with love in India.</span>
        <span>Gurugram, Haryana</span>
      </div>
    </footer>
  )
}