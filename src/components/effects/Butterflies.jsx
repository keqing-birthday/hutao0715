export default function Butterflies({ count = 5, className = '' }) {
  const butterflies = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${10 + Math.random() * 70}%`,
    left: `${5 + Math.random() * 85}%`,
    size: 16 + Math.random() * 12,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 8,
  }))

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {butterflies.map((b) => (
        <div
          key={b.id}
          className="absolute animate-butterfly"
          style={{
            top: b.top,
            left: b.left,
            fontSize: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            opacity: 0.35,
            filter: 'drop-shadow(0 0 4px rgba(181,58,42,0.25))',
          }}
        >
          🦋
        </div>
      ))}
    </div>
  )
}
