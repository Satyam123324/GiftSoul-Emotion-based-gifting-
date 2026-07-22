// Occasion reminders: "never forget an important date."
// Stored entirely client-side (localStorage) - no backend needed.
// Each reminder recurs yearly on the same month/day.

const REMINDERS_KEY = 'giftsoul_reminders'

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function getReminders() {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(REMINDERS_KEY), [])
}

export function addReminder(reminder) {
  const current = getReminders()
  const next = [...current, { ...reminder, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }]
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(next))
  return next
}

export function deleteReminder(id) {
  const next = getReminders().filter(r => r.id !== id)
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(next))
  return next
}

// Given "MM-DD", returns the next occurrence (this year if still upcoming, else next year)
// plus how many days away it is.
export function nextOccurrence(monthDay) {
  const [month, day] = monthDay.split('-').map(Number)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let next = new Date(now.getFullYear(), month - 1, day)
  if (next < today) {
    next = new Date(now.getFullYear() + 1, month - 1, day)
  }
  const daysAway = Math.round((next - today) / 86400000)
  return { date: next, daysAway }
}

export function getRemindersSorted() {
  return getReminders()
    .map(r => ({ ...r, ...nextOccurrence(r.monthDay) }))
    .sort((a, b) => a.daysAway - b.daysAway)
}
