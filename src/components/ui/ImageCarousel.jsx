import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function ImageCarousel({
  images,
  interval = 5000,
  className,
}) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1 || isPaused) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [images.length, interval, isPaused, next])

  if (!images.length) return null

  return (
    <div
      className={cn(
        'relative w-full max-w-md mx-auto md:mx-0 aspect-square',
        'rounded-2xl overflow-hidden',
        'border border-card-border shadow-xl',
        'bg-card',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`作品展示 ${index + 1}`}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out',
            index === current ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}

      {/* 渐变遮罩，让图片与卡片边框融合 */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-2xl" />

      {/* 左右切换按钮 */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="上一张"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="下一张"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  )
}
