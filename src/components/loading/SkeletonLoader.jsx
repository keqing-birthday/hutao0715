import { useState, useEffect } from 'react'

function PlumSpinner() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    let frame = 0
    const animate = () => {
      frame += 1
      setRotation(frame * 2)
      requestAnimationFrame(animate)
    }
    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <svg
      className="text-plum/80"
      width="64"
      height="64"
      viewBox="0 0 40 40"
      fill="none"
      style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.1s linear' }}
    >
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 20 20)`}>
          <path
            d="M20 4C20 4 17 12 17 16C17 19 18 20 20 20C22 20 23 19 23 16C23 12 20 4 20 4Z"
            fill="currentColor"
            opacity="0.85"
          />
        </g>
      ))}
      <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

export default function SkeletonLoader() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6 py-16">
      <PlumSpinner />
      <div className="text-center">
        <p className="text-display text-lg text-paper/80 animate-pulse">加载中...</p>
        <p className="text-decorative text-sm text-paper-dim/60 mt-1">梅花落尽，好戏将开</p>
      </div>
      {/* 骨架卡片占位 */}
      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-card/30 border border-card-border/20 p-6 h-48 animate-pulse"
          >
            <div className="w-12 h-12 rounded-full bg-plum/10 mb-4" />
            <div className="w-3/4 h-5 bg-paper/5 rounded mb-3" />
            <div className="w-full h-3 bg-paper/5 rounded mb-2" />
            <div className="w-2/3 h-3 bg-paper/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
