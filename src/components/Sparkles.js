'use client'

/*
  Usage:
  <div style={{position:'relative'}}>
    <Sparkles count={8} />
    ...your content...
  </div>

  Wrap any container in position:relative and drop <Sparkles /> inside it —
  the sparkles position absolutely and won't affect layout.
*/
export default function Sparkles({ count = 6, color = '#C49A2A' }) {
  const sparkles = Array.from({ length: count }, (_, i) => {
    // Deterministic pseudo-random positions so they don't shift on re-render
    const seed = i * 137.5
    const top = (seed % 90) + '%'
    const left = ((seed * 1.7) % 92) + '%'
    const size = 6 + (i % 3) * 4
    const delay = (i * 0.35) % 2.2
    const duration = 1.8 + (i % 4) * 0.4

    return (
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          top,
          left,
          pointerEvents: 'none',
          animation: `gsSparkleTwinkle ${duration}s ease-in-out ${delay}s infinite`,
        }}
      >
        <path
          d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
          fill={color}
        />
      </svg>
    )
  })

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {sparkles}
      </div>
      <style>{`
        @keyframes gsSparkleTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(20deg); }
        }
      `}</style>
    </>
  )
}s