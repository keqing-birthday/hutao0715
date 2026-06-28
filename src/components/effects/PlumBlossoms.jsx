import { useMemo } from 'react'

const colors = ['#e0665a', '#f2a6a0', '#e8c4c0']

export default function PlumBlossoms() {
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 8 + Math.random() * 5,
      delay: Math.random() * 10,
      sway: Math.random() * 40 - 20,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute rounded-full animate-fall"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            background: `radial-gradient(circle at 30% 30%, ${petal.color}, transparent 70%)`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            opacity: 0,
            boxShadow: `0 0 6px ${petal.color}40`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  )
}
