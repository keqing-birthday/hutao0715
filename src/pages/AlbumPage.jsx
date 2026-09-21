import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Expand, X, ArrowLeft, RefreshCw, Images } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PlumBlossoms from '../components/effects/PlumBlossoms'
import Tag from '../components/ui/Tag'
import { listAlbumFiles, fetchImageUrls } from '../services/openlist'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

/* ---------- Lightbox ---------- */

function AlbumLightbox({ items, activeIndex, onClose, onPrevious, onNext }) {
  const closeButtonRef = useRef(null)
  const item = items[activeIndex]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrevious()
      if (event.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onNext, onPrevious])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-4 sm:p-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`查看图片：${item.name}`}
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-6xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
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

        <figure className="flex max-h-full max-w-[calc(100%-3.5rem)] flex-col items-center">
          <img
            src={item.url}
            alt={item.name}
            className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <figcaption className="mt-4 w-full max-w-2xl text-center">
            <p className="text-title text-lg text-paper">{item.name}</p>
            <p className="mt-1 text-sm text-earth">
              {new Date(item.time).toLocaleString('zh-CN')}
            </p>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

/* ---------- Gallery Grid ---------- */

function GalleryGrid({ images, onSelect }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 sm:gap-6">
      {images.map((item, index) => (
        <button
          key={item.name + index}
          type="button"
          onClick={() => onSelect(index)}
          className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-lg border border-card-border bg-card text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-plum/60 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-plum sm:mb-6"
          aria-label={`查看大图：${item.name}`}
        >
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Expand size={17} aria-hidden="true" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-paper translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block text-title text-base truncate">{item.name}</span>
            <span className="mt-1 block text-xs text-paper-dim">
              {new Date(item.time).toLocaleDateString('zh-CN')}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

/* ---------- Album Page ---------- */

export default function AlbumPage() {
  const navigate = useNavigate()
  const containerRef = useScrollAnimation()

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [activeIndex, setActiveIndex] = useState(null)

  const loadAlbum = useCallback(async () => {
    setLoading(true)
    setError(null)
    setProgress({ done: 0, total: 0 })

    try {
      const files = await listAlbumFiles()
      if (files.length === 0) {
        setImages([])
        setLoading(false)
        return
      }

      const urls = await fetchImageUrls(files, {
        onProgress: (done, total) => setProgress({ done, total }),
      })
      setImages(urls)
    } catch (err) {
      setError(err.message || '加载失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAlbum()
  }, [loadAlbum])

  const closeLightbox = () => setActiveIndex(null)
  const showPrevious = () => {
    setActiveIndex((i) => (i + images.length - 1) % images.length)
  }
  const showNext = () => {
    setActiveIndex((i) => (i + 1) % images.length)
  }

  return (
    <div className="relative min-h-screen bg-ink text-paper overflow-x-hidden">
      <PlumBlossoms />
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-on-scroll">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-1.5 text-sm text-paper-dim hover:text-plum transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>返回首页</span>
                </button>
              </div>
              <div className="mb-4 flex justify-start">
                <Tag className="text-base px-4 py-1.5">
                  <Images size={16} className="inline mr-1 -mt-0.5" />
                  生日会图集
                </Tag>
              </div>
              <h1 className="text-title text-3xl md:text-4xl text-paper mb-3">光影留存</h1>
              <p className="text-paper-dim max-w-xl">
                每一张画面都承载着相遇与心意。点击单图可查看完整大图。
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            {/* Loading */}
            {loading && (
              <div className="rounded-lg border border-card-border bg-card/40 py-20 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-plum/10 text-plum mb-4 animate-spin">
                  <RefreshCw size={20} />
                </div>
                <p className="text-paper-dim mb-2">正在加载图集…</p>
                {progress.total > 0 && (
                  <p className="text-sm text-paper-dim/60">
                    已获取 {progress.done} / {progress.total} 张图片
                  </p>
                )}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-lg border border-card-border bg-card/40 py-20 text-center">
                <p className="text-fire mb-4">{error}</p>
                <button
                  onClick={loadAlbum}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-plum text-paper text-sm font-medium hover:bg-fire transition-colors"
                >
                  <RefreshCw size={16} />
                  重新加载
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && images.length === 0 && (
              <div className="rounded-lg border border-dashed border-card-border bg-card/40 py-20 text-center text-paper-dim">
                <Images size={40} className="mx-auto mb-3 opacity-40" />
                <p>暂无图片，请前往 OpenList 上传后刷新页面。</p>
              </div>
            )}

            {/* Gallery */}
            {!loading && !error && images.length > 0 && (
              <GalleryGrid images={images} onSelect={setActiveIndex} />
            )}
          </div>
        </div>
      </main>

      <Footer showContact={false} showGroupNumber={false} />

      {activeIndex !== null && (
        <AlbumLightbox
          items={images}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </div>
  )
}
