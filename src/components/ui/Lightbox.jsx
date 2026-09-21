import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

const MIN_SCALE = 1
const MAX_SCALE = 5
const STEP = 0.5

const clampScale = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))

/**
 * 通用大图浏览（相册页与线下活动海报共用）
 * 支持：缩放（按钮 / 滚轮 / 双击 / 双指捏合）、放大后拖拽平移、方向键切换、Esc 关闭
 *
 * @param items       [{ url, alt }]
 * @param activeIndex 当前下标
 * @param onClose     关闭回调
 * @param onPrevious/onNext 切换上一张/下一张
 */
export default function Lightbox({ items, activeIndex, onClose, onPrevious, onNext }) {
  const stageRef = useRef(null)
  const imgRef = useRef(null)
  const closeButtonRef = useRef(null)
  const closingRef = useRef(false)

  const [closing, setClosing] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  // 用 ref 同步缩放状态，避免事件回调里读到旧值
  const scaleRef = useRef(1)
  const offsetRef = useRef({ x: 0, y: 0 })
  const pointersRef = useRef(new Map())
  const dragRef = useRef(null)
  const pinchRef = useRef(null)

  const item = items[activeIndex]

  const apply = useCallback((nextScale, nextOffset) => {
    scaleRef.current = nextScale
    offsetRef.current = nextOffset
    setScale(nextScale)
    setOffset(nextOffset)
  }, [])

  // 把平移限制在图片范围内，避免拖出画面
  const clampOffset = useCallback((next, s) => {
    const stage = stageRef.current
    const img = imgRef.current
    if (!stage || !img) return next
    const rect = stage.getBoundingClientRect()
    const maxX = Math.max(0, (img.offsetWidth * s - rect.width) / 2)
    const maxY = Math.max(0, (img.offsetHeight * s - rect.height) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    }
  }, [])

  // 以某个屏幕坐标为锚点缩放（滚轮/双击/捏合都用它）
  const zoomAt = useCallback(
    (clientX, clientY, nextScale) => {
      const stage = stageRef.current
      if (!stage) return
      const s = clampScale(nextScale)
      const prev = scaleRef.current
      if (s === prev) return

      const rect = stage.getBoundingClientRect()
      const cx = clientX - rect.left - rect.width / 2
      const cy = clientY - rect.top - rect.height / 2
      const off = offsetRef.current
      const px = (cx - off.x) / prev
      const py = (cy - off.y) / prev

      if (s === MIN_SCALE) {
        apply(MIN_SCALE, { x: 0, y: 0 })
        return
      }
      apply(s, clampOffset({ x: cx - s * px, y: cy - s * py }, s))
    },
    [apply, clampOffset]
  )

  const zoomByStep = useCallback(
    (delta) => {
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, scaleRef.current + delta)
    },
    [zoomAt]
  )

  const resetZoom = useCallback(() => apply(MIN_SCALE, { x: 0, y: 0 }), [apply])

  // 切图时重置缩放
  useEffect(() => {
    resetZoom()
  }, [activeIndex, resetZoom])

  // 先播放关闭动画，动画结束后再真正卸载
  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    window.setTimeout(onClose, 160)
  }, [onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') requestClose()
      if (event.key === 'ArrowLeft') onPrevious()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === '+' || event.key === '=') zoomByStep(STEP)
      if (event.key === '-' || event.key === '_') zoomByStep(-STEP)
      if (event.key === '0') resetZoom()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onNext, onPrevious, requestClose, zoomByStep, resetZoom])

  // 滚轮缩放（需非 passive 才能 preventDefault）
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const onWheel = (event) => {
      event.preventDefault()
      zoomAt(event.clientX, event.clientY, scaleRef.current * Math.exp(-event.deltaY * 0.0015))
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  /* ---------- 拖拽 / 双指捏合 ---------- */

  const handlePointerDown = (event) => {
    if (event.target.closest('button')) return
    const stage = event.currentTarget
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointersRef.current.size === 2) {
      dragRef.current = null
      const [a, b] = [...pointersRef.current.values()]
      pinchRef.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        scale: scaleRef.current,
      }
      setDragging(true)
      return
    }

    if (pointersRef.current.size === 1 && scaleRef.current > MIN_SCALE) {
      stage.setPointerCapture?.(event.pointerId)
      dragRef.current = {
        x: event.clientX,
        y: event.clientY,
        ox: offsetRef.current.x,
        oy: offsetRef.current.y,
      }
      setDragging(true)
    }
  }

  const handlePointerMove = (event) => {
    const pointers = pointersRef.current
    if (!pointers.has(event.pointerId)) return
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1
      zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, pinchRef.current.scale * (dist / pinchRef.current.dist))
      return
    }

    const drag = dragRef.current
    if (!drag) return
    apply(
      scaleRef.current,
      clampOffset(
        { x: drag.ox + (event.clientX - drag.x), y: drag.oy + (event.clientY - drag.y) },
        scaleRef.current
      )
    )
  }

  const handlePointerUp = (event) => {
    pointersRef.current.delete(event.pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null

    if (pointersRef.current.size === 1) {
      const [remaining] = [...pointersRef.current.values()]
      dragRef.current = { x: remaining.x, y: remaining.y, ox: offsetRef.current.x, oy: offsetRef.current.y }
      return
    }
    dragRef.current = null
    setDragging(false)
  }

  const handleDoubleClick = (event) => {
    if (event.target.closest('button')) return
    if (scaleRef.current > MIN_SCALE) resetZoom()
    else zoomAt(event.clientX, event.clientY, 2.5)
  }

  if (!item) return null

  const zoomed = scale > MIN_SCALE

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-4 sm:p-8 backdrop-blur-md motion-reduce:animate-none ${
        closing ? 'animate-lightbox-backdrop-out' : 'animate-lightbox-backdrop'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="查看图片"
      onClick={requestClose}
    >
      <div
        ref={stageRef}
        className="relative flex h-full w-full max-w-6xl touch-none items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          className="absolute right-0 top-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
          aria-label="关闭大图浏览"
        >
          <X size={22} aria-hidden="true" />
        </button>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="absolute left-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
              aria-label="查看上一张图片"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
              aria-label="查看下一张图片"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}

        <figure
          className={`flex max-h-full max-w-full flex-col items-center motion-reduce:animate-none ${
            closing ? 'animate-lightbox-image-out' : 'animate-lightbox-image'
          }`}
        >
          <img
            ref={imgRef}
            src={item.url}
            alt={item.alt || '图片'}
            draggable={false}
            className={`max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl select-none ${
              dragging ? '' : 'transition-transform duration-200'
            } ${zoomed ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
            style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})` }}
          />
        </figure>

        {/* 缩放工具条 */}
        <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-paper/20 bg-ink/80 p-1 text-paper backdrop-blur-sm">
          <button
            type="button"
            onClick={() => zoomByStep(-STEP)}
            disabled={!zoomed}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-plum disabled:opacity-40 disabled:hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
            aria-label="缩小"
          >
            <ZoomOut size={18} aria-hidden="true" />
          </button>
          <span className="w-14 text-center text-xs tabular-nums text-paper-dim" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoomByStep(STEP)}
            disabled={scale >= MAX_SCALE}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-plum disabled:opacity-40 disabled:hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
            aria-label="放大"
          >
            <ZoomIn size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            disabled={!zoomed && offset.x === 0 && offset.y === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-plum disabled:opacity-40 disabled:hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
            aria-label="重置缩放"
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
