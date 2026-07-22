// Lightweight client-side persistence for "saved gifts" and "recently viewed".
// Uses localStorage directly (this is a real Next.js app running in the
// browser, not a sandboxed artifact, so localStorage works normally here).
//
// When a real user is logged in, getWishlistDB/toggleWishlistDB below talk
// directly to Supabase (via the shared authenticated client) instead, so the
// wishlist syncs across devices rather than being stuck to one browser.

import { supabase } from './supabase'

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

// ---- DB-backed wishlist (used when a real user is logged in) ----

export async function getWishlistDB(userId) {
  if (!userId) return []
  const { data, error } = await supabase.from('wishlists').select('product_id').eq('user_id', userId)
  if (error) return []
  return data.map(r => r.product_id)
}

export async function isWishlistedDB(userId, productId) {
  if (!userId) return false
  const { data } = await supabase.from('wishlists').select('id').eq('user_id', userId).eq('product_id', productId).maybeSingle()
  return !!data
}

// Returns the new saved-state (true if now wishlisted, false if removed)
export async function toggleWishlistDB(userId, productId) {
  const { data: existing } = await supabase.from('wishlists').select('id').eq('user_id', userId).eq('product_id', productId).maybeSingle()
  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id)
    return false
  }
  await supabase.from('wishlists').insert([{ user_id: userId, product_id: productId }])
  return true
}

// One-time merge: if a guest had localStorage saves and then logs in,
// copy those over to their real account (skips ones already saved there).
export async function mergeLocalWishlistIntoDB(userId) {
  const localIds = getWishlist()
  if (!userId || localIds.length === 0) return
  const existing = await getWishlistDB(userId)
  const toAdd = localIds.filter(id => !existing.includes(id))
  if (toAdd.length > 0) {
    await supabase.from('wishlists').insert(toAdd.map(product_id => ({ user_id: userId, product_id })))
  }
  localStorage.removeItem(WISHLIST_KEY)
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
