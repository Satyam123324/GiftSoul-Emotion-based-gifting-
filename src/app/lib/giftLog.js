// Gift Timeline: a running log of "what I gave whom, and when" —
// turns one-off purchases into an ongoing relationship history.
// Stored client-side (localStorage), same pattern as wishlist/reminders.

const GIFT_LOG_KEY = 'giftsoul_gift_log'

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function getGiftLog() {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(GIFT_LOG_KEY), [])
}

export function addGiftLogEntry(entry) {
  const current = getGiftLog()
  const next = [
    { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, date: entry.date || new Date().toISOString() },
    ...current,
  ]
  localStorage.setItem(GIFT_LOG_KEY, JSON.stringify(next))
  return next
}

export function deleteGiftLogEntry(id) {
  const next = getGiftLog().filter(e => e.id !== id)
  localStorage.setItem(GIFT_LOG_KEY, JSON.stringify(next))
  return next
}

// Groups entries by person, sorted with most-recently-gifted person first,
// and each person's own gifts sorted newest-first.
export function getGiftLogByPerson() {
  const log = getGiftLog()
  const byPerson = {}
  for (const entry of log) {
    const key = entry.personName.trim()
    if (!byPerson[key]) byPerson[key] = []
    byPerson[key].push(entry)
  }
  const people = Object.keys(byPerson).map(name => ({
    name,
    entries: byPerson[name].sort((a, b) => new Date(b.date) - new Date(a.date)),
  }))
  people.sort((a, b) => new Date(b.entries[0].date) - new Date(a.entries[0].date))
  return people
}
