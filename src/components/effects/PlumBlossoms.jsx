import { useMemo } from 'react'

const petalVars = [
  { color: 'var(--petal-1)', glow: 'rgba(194,59,34,0.5)' },
  { color: 'var(--petal-2)', glow: 'rgba(224,102,90,0.5)' },
  { color: 'var(--petal-3)', glow: 'rgba(242,166,160,0.5)' },
]

function PlumPetalSVG({ color, glowColor, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className="overflow-visible dark:drop-shadow-[0_0_6px_var(--glow)]"
      style={{ '--glow': glowColor }}
    >
      {/* 5瓣梅花 — 真实梅花瓣形状：顶部有小凹口，底部圆润，整体扁宽 */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 50 50)`}>
          <path
            d="M50 50C46 44 38 34 42 24Q46 21 50 23Q54 21 58 24C62 34 54 44 50 50Z"
            fill={color}
            opacity="0.9"
          />
        </g>
      ))}
      <circle cx="50" cy="50" r="10" fill={color} opacity="0.7" />
    </svg>
  )
}

export default function PlumBlossoms() {
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const variant = petalVars[Math.floor(Math.random() * petalVars.length)]
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: 14 + Math.random() * 14,
        color: variant.color,
        glowColor: variant.glow,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 15,
        sway: Math.random() * 60 - 30,
        rotateX: Math.random() * 360,
        rotateY: Math.random() * 360,
      }
    })
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-fall-3d"
          style={{
            left: petal.left,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <div
            className="relative"
            style={{
              width: petal.size,
              height: petal.size,
              animation: `sway-3d ${petal.duration * 0.6}s ease-in-out infinite alternate`,
              animationDelay: `${petal.delay}s`,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                animation: `rotate-3d ${8 + Math.random() * 6}s linear infinite`,
                animationDelay: `${petal.delay}s`,
              }}
            >
              <PlumPetalSVG
                color={petal.color}
                glowColor={petal.glowColor}
                size={petal.size}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
