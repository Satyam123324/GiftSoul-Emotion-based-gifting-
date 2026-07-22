'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getRemindersSorted, addReminder, deleteReminder } from '../lib/reminders'
import { OCCASIONS, RECIPIENTS } from '../lib/constants'

function urgencyColor(daysAway) {
  if (daysAway <= 3) return { bg: '#F9EAE6', text: '#B5533C', border: 'rgba(181,83,60,.3)' }
  if (daysAway <= 14) return { bg: '#F7EAC8', text: '#8A6A1F', border: 'rgba(201,154,84,.4)' }
  return { bg: '#F3E8DC', text: '#7C6B60', border: '#E4D3BE' }
}

export default function Reminders() {
  const [reminders, setReminders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [personName, setPersonName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [occasion, setOccasion] = useState('birthday')
  const [monthDay, setMonthDay] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setReminders(getRemindersSorted())
  }, [])

  function handleAdd() {
    if (!personName || !monthDay) return
    // monthDay comes from <input type="date">, e.g. "2026-03-14" -> we only keep MM-DD
    const [, month, day] = monthDay.split('-')
    addReminder({ personName, relationship, occasion, monthDay: `${month}-${day}`, notes })
    setReminders(getRemindersSorted())
    setPersonName(''); setRelationship(''); setMonthDay(''); setNotes(''); setOccasion('birthday')
    setShowForm(false)
  }

  function handleDelete(id) {
    deleteReminder(id)
    setReminders(getRemindersSorted())
  }

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
          <Link href="/wishlist" style={{ fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#7C6B60', textDecoration: 'none' }}>♡ Saved</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'calc(70px + 3rem) 2rem 5rem' }}>
        <p style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#B5533C', marginBottom: '.8rem' }}>Never forget a moment</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 300, color: '#2B2019' }}>
            Your <em style={{ fontStyle: 'italic', color: '#B5533C' }}>reminders</em>
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '.7rem 1.6rem', background: '#B5533C', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.85rem', cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : '+ Add a reminder'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', border: '1px solid #E4D3BE', borderRadius: '20px', padding: '1.6rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
              <input
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                placeholder="Who's this for? (e.g. Mom)"
                style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }}
              />
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', background: 'white' }}
              >
                <option value="">Relationship (optional)</option>
                {RECIPIENTS.map(r => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginBottom: '.8rem' }}>
              <select
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', background: 'white' }}
              >
                {OCCASIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input
                type="date"
                value={monthDay}
                onChange={e => setMonthDay(e.target.value)}
                style={{ padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none' }}
              />
            </div>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes (optional) — their favourite things, sizes, etc."
              style={{ width: '100%', padding: '.65rem .9rem', border: '1px solid #E4D3BE', borderRadius: '10px', fontSize: '.85rem', outline: 'none', marginBottom: '1rem' }}
            />
            <p style={{ fontSize: '.72rem', color: '#7C6B60', marginBottom: '1rem' }}>This repeats every year on the same date — only the month and day are saved.</p>
            <button
              onClick={handleAdd}
              disabled={!personName || !monthDay}
              style={{ padding: '.7rem 1.8rem', background: (!personName || !monthDay) ? '#D9C6B8' : '#2B2019', color: 'white', border: 'none', borderRadius: '2rem', fontSize: '.85rem', cursor: (!personName || !monthDay) ? 'not-allowed' : 'pointer' }}
            >
              Save reminder
            </button>
          </div>
        )}

        {reminders.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#7C6B60' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>📅</div>
            <p style={{ fontSize: '1rem', marginBottom: '.5rem', color: '#2B2019' }}>No reminders yet.</p>
            <p style={{ fontSize: '.85rem' }}>Add birthdays and anniversaries so you never miss a moment.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reminders.map(r => {
            const colors = urgencyColor(r.daysAway)
            const recipient = RECIPIENTS.find(x => x.value === r.relationship)
            const occ = OCCASIONS.find(x => x.value === r.occasion)
            return (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '1.2rem 1.4rem' }}>
                <div style={{ textAlign: 'center', minWidth: '64px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.text }}>{r.daysAway}</div>
                  <div style={{ fontSize: '.65rem', textTransform: 'uppercase', color: colors.text }}>{r.daysAway === 1 ? 'day' : 'days'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.95rem', color: '#2B2019', fontWeight: 500 }}>
                    {recipient?.icon} {r.personName}{recipient ? ` (${recipient.label})` : ''}
                  </div>
                  <div style={{ fontSize: '.78rem', color: '#7C6B60' }}>
                    {occ?.label || r.occasion} · {r.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                    {r.notes ? ` · ${r.notes}` : ''}
                  </div>
                </div>
                <Link
                  href={`/marketplace?occasion=${r.occasion}${r.relationship ? `&recipient=${r.relationship}` : ''}`}
                  style={{ padding: '.5rem 1.1rem', background: 'white', border: '1px solid #E4D3BE', borderRadius: '2rem', fontSize: '.78rem', color: '#2B2019', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  Find a gift
                </Link>
                <button
                  onClick={() => handleDelete(r.id)}
                  aria-label="Delete reminder"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.6)', color: '#7C6B60', cursor: 'pointer', fontSize: '.85rem', flexShrink: 0 }}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
