'use client'
import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    category: 'Ordering & Delivery',
    items: [
      { q: 'How long does it take to receive my gift?', a: 'Each product page shows its own lead time, usually 2–10 days, since every gift is made to order by an independent creator rather than picked from a warehouse shelf. Once your enquiry is confirmed, the creator will share an exact delivery date.' },
      { q: 'Do you ship across all of India?', a: 'Yes, our creators ship pan-India through trusted courier partners. Some remote pin codes may need an extra day or two — the creator will confirm this when you send an enquiry.' },
      { q: 'Can I track my order?', a: 'Once a creator confirms your order, you\u2019ll receive tracking details by email/WhatsApp as soon as it\u2019s dispatched.' },
      { q: 'Can I request a specific delivery date, like a birthday?', a: 'Yes — mention your event date in the personalisation note when you send an enquiry, and the creator will let you know if it\u2019s achievable given their lead time.' },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'Can I return a personalised gift?', a: 'Because most gifts are custom-made for you, personalised items generally can\u2019t be returned once production has started — but if something arrives damaged or incorrect, reach out and we\u2019ll make it right with the creator.' },
      { q: 'What if my gift arrives damaged?', a: 'Contact us within 48 hours of delivery with a photo of the damage, and we\u2019ll arrange a replacement or refund with the creator on your behalf.' },
      { q: 'What is your on-time delivery guarantee?', a: 'If a creator misses the delivery window they confirmed with you, you\u2019re entitled to a full refund — reach out to our support team and we\u2019ll handle it.' },
    ],
  },
  {
    category: 'Customisation',
    items: [
      { q: 'Can I personalise any gift?', a: 'Most listings support personalisation — names, initials, colours, or a short message. Add your request in the note field when you send an enquiry, and the creator will confirm feasibility and any extra cost.' },
      { q: 'Can I send my own photo for a custom item?', a: 'Yes, for items like portraits or photo keepsakes, mention this in your enquiry and the creator will share how to send your photo securely.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'How do I pay for a gift?', a: 'After you send an enquiry, the creator confirms final pricing (including any personalisation) and shares a secure payment link — UPI, cards, and net banking are all supported.' },
      { q: 'Are there any hidden platform fees?', a: 'No. GiftSoul doesn\u2019t charge buyers any platform fee — you pay the creator\u2019s listed price plus shipping, nothing else.' },
    ],
  },
  {
    category: 'For Creators',
    items: [
      { q: 'How do I start selling on GiftSoul?', a: 'Tap "Join as creator" in the navigation, create your profile, and start listing — it\u2019s free to join and there are no platform fees.' },
      { q: 'How do I get paid?', a: 'You\u2019ll manage payment collection directly with buyers once an enquiry is confirmed. We\u2019re working on integrated payouts — for now, most creators use UPI or payment links.' },
    ],
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState('0-0')

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="/marketplace" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Browse gifts</Link>
          <Link href="/corporate" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>Corporate gifting</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: 'calc(70px + 4rem) 2rem 6rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem', textAlign: 'center' }}>Help center</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#2B2019', marginBottom: '.8rem', textAlign: 'center' }}>
          Frequently asked <em style={{ fontStyle: 'italic', color: '#B5533C' }}>questions</em>
        </h1>
        <p style={{ fontSize: '.95rem', color: '#7C6B60', textAlign: 'center', marginBottom: '3.5rem' }}>
          Everything about ordering, delivery, returns, and personalisation. Can&apos;t find your answer? <Link href="/marketplace" style={{ color: '#B5533C' }}>Message a creator directly</Link>.
        </p>

        {FAQS.map((section, si) => (
          <div key={section.category} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 400, color: '#2B2019', marginBottom: '1rem' }}>
              {section.category}
            </h2>
            <div style={{ border: '1px solid #E4D3BE', borderRadius: '16px', overflow: 'hidden', background: 'white' }}>
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`
                const isOpen = openIndex === key
                return (
                  <div key={key} style={{ borderBottom: ii < section.items.length - 1 ? '1px solid #E4D3BE' : 'none' }}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : key)}
                      style={{ width: '100%', textAlign: 'left', padding: '1.1rem 1.4rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
                    >
                      <span style={{ fontSize: '.95rem', color: '#2B2019', fontWeight: isOpen ? 500 : 400 }}>{item.q}</span>
                      <span style={{ fontSize: '1.1rem', color: '#B5533C', flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
                    </button>
                    {isOpen && (
                      <p style={{ padding: '0 1.4rem 1.2rem', fontSize: '.88rem', color: '#7C6B60', lineHeight: 1.7 }}>
                        {item.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#F3E8DC', border: '1px solid #E4D3BE', borderRadius: '20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#2B2019', marginBottom: '.5rem' }}>Still need help?</p>
          <p style={{ fontSize: '.88rem', color: '#7C6B60', marginBottom: '1.2rem' }}>Reach us at hello@giftsoul.in and we&apos;ll get back within a day.</p>
          <Link href="/marketplace" style={{ display: 'inline-block', padding: '.75rem 2rem', background: '#B5533C', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '.85rem' }}>
            Browse gifts →
          </Link>
        </div>
      </div>
    </div>
  )
}
