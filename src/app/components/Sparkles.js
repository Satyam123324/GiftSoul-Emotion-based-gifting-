'use client'

export default function Sparkles({ count = 6, color = '#C99A54' }) {
  const sparkles = Array.from({ length: count }, (_, i) => {
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
        className="gs-sparkle-icon"
        style={{
          position: 'absolute',
          top,
          left,
          pointerEvents: 'none',
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
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
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {sparkles}
    </div>
  )
}