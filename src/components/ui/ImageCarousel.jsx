import { useState, useEffect, useCallback } from 'react'
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

      {/* 指示点 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index === current
                ? 'bg-plum w-5'
                : 'bg-paper/50 hover:bg-paper/80'
            )}
            aria-label={`切换到第 ${index + 1} 张`}
          />
        ))}
      </div>
    </div>
  )
}
