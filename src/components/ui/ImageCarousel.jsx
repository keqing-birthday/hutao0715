import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function ImageCarousel({
  images,
  interval = 5000,
  className,
}) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const startXRef = useRef(0)
  const currentOffsetRef = useRef(0)
  const dragStartTimeRef = useRef(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
    setDragOffset(0)
    currentOffsetRef.current = 0
  }, [images.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
    setDragOffset(0)
    currentOffsetRef.current = 0
  }, [images.length])

  const goTo = useCallback((index) => {
    setCurrent(index)
    setDragOffset(0)
    currentOffsetRef.current = 0
  }, [])

  // 自动轮播
  useEffect(() => {
    if (images.length <= 1 || isPaused || isDragging) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [images.length, interval, isPaused, isDragging, next])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev])

  // 触摸事件
  const handleTouchStart = useCallback((e) => {
    startXRef.current = e.touches[0].clientX
    dragStartTimeRef.current = Date.now()
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - startXRef.current
    // 边界阻力
    const isBoundary = (current === 0 && deltaX > 0) || (current === images.length - 1 && deltaX < 0)
    const resistance = isBoundary ? 0.4 : 1
    const offset = deltaX * resistance
    setDragOffset(offset)
    currentOffsetRef.current = offset
  }, [isDragging, current, images.length])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    const deltaX = currentOffsetRef.current
    const deltaTime = Date.now() - dragStartTimeRef.current
    const velocity = Math.abs(deltaX) / deltaTime

    if (Math.abs(deltaX) > 60 || velocity > 0.5) {
      if (deltaX > 0) {
        prev()
      } else {
        next()
      }
    } else {
      setDragOffset(0)
      currentOffsetRef.current = 0
    }
  }, [isDragging, next, prev])

  // 鼠标拖拽事件
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    startXRef.current = e.clientX
    dragStartTimeRef.current = Date.now()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    const deltaX = e.clientX - startXRef.current
    const isBoundary = (current === 0 && deltaX > 0) || (current === images.length - 1 && deltaX < 0)
    const resistance = isBoundary ? 0.4 : 1
    const offset = deltaX * resistance
    setDragOffset(offset)
    currentOffsetRef.current = offset
  }, [isDragging, current, images.length])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    const deltaX = currentOffsetRef.current
    const deltaTime = Date.now() - dragStartTimeRef.current
    const velocity = Math.abs(deltaX) / (deltaTime || 1)

    if (Math.abs(deltaX) > 60 || velocity > 0.5) {
      if (deltaX > 0) {
        prev()
      } else {
        next()
      }
    } else {
      setDragOffset(0)
      currentOffsetRef.current = 0
    }
  }, [isDragging, next, prev])

  // 全局鼠标释放监听
  useEffect(() => {
    if (!isDragging) return
    const handleGlobalMouseUp = () => handleMouseUp()
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isDragging, handleMouseUp])

  if (!images.length) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full max-w-md mx-auto md:mx-0 aspect-square',
        'rounded-2xl overflow-hidden',
        'border border-card-border shadow-xl',
        'bg-card',
        'hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--color-plum),0.15)]',
        'transition-all duration-500 ease-out',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false)
        if (isDragging) handleMouseUp()
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        className="absolute inset-0 flex"
        style={{
          transform: `translateX(calc(${-current * 100}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`作品展示 ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            draggable={false}
            loading={index === current ? undefined : 'lazy'}
            fetchPriority={index === current ? 'high' : undefined}
            decoding="async"
          />
        ))}
      </div>

      {/* 渐变遮罩，让图片与卡片边框融合 */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-2xl" />

      {/* 左右切换按钮 */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{
              WebkitBackdropFilter: 'blur(12px) saturate(180%)',
              backdropFilter: 'blur(12px) saturate(180%)',
              background: 'rgba(var(--color-card), 0.5)',
            }}
            aria-label="上一张"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{
              WebkitBackdropFilter: 'blur(12px) saturate(180%)',
              backdropFilter: 'blur(12px) saturate(180%)',
              background: 'rgba(var(--color-card), 0.5)',
            }}
            aria-label="下一张"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* 指示点 */}
      {images.length > 1 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            backdropFilter: 'blur(12px) saturate(180%)',
            background: 'rgba(var(--color-card), 0.45)',
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === current
                  ? 'bg-white w-5 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                  : 'bg-white/40 hover:bg-white/60'
              )}
              aria-label={`第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
