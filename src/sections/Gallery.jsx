import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import Tag from '../components/ui/Tag'
import { galleryItems } from '../data/gallery'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function GalleryLightbox({ items, activeIndex, onClose, onPrevious, onNext }) {
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
      aria-label={`查看图片：${item.title || item.alt}`}
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-6xl items-center justify-center"
        onClick={(event) => event.stopPropagation()}
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
          <button
            type="button"
            onClick={onPrevious}
            className="absolute left-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
            aria-label="查看上一张图片"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
        )}

        <figure className="flex max-h-full max-w-[calc(100%-3.5rem)] flex-col items-center">
          <img
            src={item.src}
            alt={item.alt}
            className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          {(item.title || item.creator || item.description) && (
            <figcaption className="mt-4 w-full max-w-2xl text-center">
              {item.title && <p className="text-title text-lg text-paper">{item.title}</p>}
              {item.creator && <p className="mt-1 text-sm text-earth">{item.creator}</p>}
              {item.description && <p className="mt-2 text-sm text-paper-dim">{item.description}</p>}
            </figcaption>
          )}
        </figure>

        {items.length > 1 && (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
            aria-label="查看下一张图片"
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)
  const containerRef = useScrollAnimation()
  const hasItems = galleryItems.length > 0

  const closeLightbox = () => setActiveIndex(null)
  const showPrevious = () => {
    setActiveIndex((index) => (index + galleryItems.length - 1) % galleryItems.length)
  }
  const showNext = () => {
    setActiveIndex((index) => (index + 1) % galleryItems.length)
  }

  return (
    <section id="gallery" ref={containerRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <div className="mb-4 flex justify-center">
            <Tag className="text-base px-4 py-1.5">📷 生日会图集</Tag>
          </div>
          <h2 className="text-title text-3xl md:text-4xl text-paper mb-4">光影留存</h2>
          <p className="text-paper-dim max-w-2xl mx-auto">
            每一张画面都承载着相遇与心意。点击图片可查看完整大图。
          </p>
        </div>

        {hasItems ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`gallery-tile group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-lg border border-card-border bg-card text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-plum/60 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-plum sm:mb-6 animate-on-scroll scroll-stagger-${Math.min(index + 1, 8)}`}
                aria-label={`查看大图：${item.title || item.alt}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <Expand size={17} aria-hidden="true" />
                </span>
                {(item.title || item.creator) && (
                  <span className="absolute inset-x-0 bottom-0 p-4 text-paper translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.title && <span className="block text-title text-base">{item.title}</span>}
                    {item.creator && <span className="mt-1 block text-xs text-paper-dim">{item.creator}</span>}
                  </span>
                )}
                {item.demo && (
                  <span className="absolute left-3 top-3 rounded-sm border border-earth/40 bg-ink/75 px-2 py-1 text-xs text-earth">
                    待替换素材
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-card-border bg-card/40 py-16 text-center text-paper-dim">
            图集正在整理中。
          </div>
        )}
      </div>

      {activeIndex !== null && (
        <GalleryLightbox
          items={galleryItems}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </section>
  )
}
