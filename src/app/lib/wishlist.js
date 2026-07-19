// Lightweight client-side persistence for "saved gifts" and "recently viewed".
// Uses localStorage directly (this is a real Next.js app running in the
// browser, not a sandboxed artifact, so localStorage works normally here).

const WISHLIST_KEY = 'giftsoul_wishlist'
const RECENT_KEY = 'giftsoul_recently_viewed'
const MAX_RECENT = 8

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

// ---- Wishlist (stores an array of product ids) ----

export function getWishlist() {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(WISHLIST_KEY), [])
}

export function isWishlisted(id) {
  return getWishlist().includes(id)
}

export function toggleWishlist(id) {
  const current = getWishlist()
  const next = current.includes(id)
    ? current.filter(x => x !== id)
    : [...current, id]
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('giftsoul-wishlist-updated'))
  return next
}

// ---- Recently viewed (stores lightweight product snapshots, newest first) ----

export function addRecentlyViewed(product) {
  if (typeof window === 'undefined' || !product?.id) return
  const current = safeParse(localStorage.getItem(RECENT_KEY), [])
  const snapshot = {
    id: product.id,
    name: product.name,
    base_price: product.base_price,
    images: product.images || [],
    category: product.category,
  }
  const deduped = current.filter(p => p.id !== product.id)
  const next = [snapshot, ...deduped].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

export function getRecentlyViewed() {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem(RECENT_KEY), [])
}
