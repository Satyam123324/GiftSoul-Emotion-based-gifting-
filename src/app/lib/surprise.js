// Stateless "surprise reveal" payload encoding.
// Everything needed to render the surprise link lives in the URL itself
// (base64-encoded JSON) — no database table required.

export function encodeSurprise(payload) {
  const json = JSON.stringify(payload)
  // btoa needs a binary string; escape/encodeURIComponent handles UTF-8 safely.
  const b64 = btoa(unescape(encodeURIComponent(json)))
  // Make it URL-safe
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeSurprise(encoded) {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const json = decodeURIComponent(escape(atob(padded)))
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}
