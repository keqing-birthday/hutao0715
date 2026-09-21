import { useState } from 'react'
import { Expand } from 'lucide-react'
import Tag from '../components/ui/Tag'
import Lightbox from '../components/ui/Lightbox'

const POSTERS = [
  {
    src: '/images/poster-2026-main.webp',
    alt: '线下活动主海报',
  },
  {
    src: '/images/poster-2026-cities.webp',
    alt: '六城联动主海报',
  },
  {
    src: '/images/poster-2026-details.webp',
    alt: '全国线下痛楼打卡地址详情',
  },
]

const POSTER_ITEMS = POSTERS.map((poster) => ({ url: poster.src, alt: poster.alt }))

function PosterCard({ poster, index, onOpen, className = '', children }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`查看大图：${poster.alt}`}
      className={`group block w-full text-left relative rounded-2xl overflow-hidden bg-card border border-card-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum ${className}`}
    >
      <img
        src={poster.src}
        alt={poster.alt}
        className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
      <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper opacity-0 transition-all duration-300 group-hover:opacity-100">
        <Expand size={17} aria-hidden="true" />
      </span>
      {children}
    </button>
  )
}

export default function OfflineEvents() {
  const [lightbox, setLightbox] = useState(null)

  const openAt = (index) => setLightbox({ index })
  const closeLightbox = () => setLightbox(null)
  const showPrevious = () =>
    setLightbox((s) => (s ? { index: (s.index + POSTER_ITEMS.length - 1) % POSTER_ITEMS.length } : s))
  const showNext = () =>
    setLightbox((s) => (s ? { index: (s.index + 1) % POSTER_ITEMS.length } : s))

  return (
    <section id="offline" className="relative py-20 md:py-28 bg-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <Tag className="text-base px-4 py-1.5">🎪 生贺线下企划</Tag>
          </div>
          <h2 className="text-title text-3xl md:text-4xl text-paper mb-3">
            线下活动
          </h2>
          <p className="text-paper-dim/80 text-base md:text-lg max-w-2xl mx-auto">
            盛夏之约，与同好一起为堂主庆生。点击海报可查看完整大图。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {POSTERS.slice(0, 2).map((poster, index) => (
            <PosterCard key={poster.src} poster={poster} index={index} onOpen={openAt} />
          ))}
        </div>

        <div className="mt-8 md:mt-10">
          <PosterCard
            poster={POSTERS[2]}
            index={2}
            onOpen={openAt}
            className="max-w-3xl mx-auto max-h-[70vh]"
          >
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink/90 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="px-4 py-1.5 rounded-full text-sm text-paper bg-ink/70 border border-paper/10 backdrop-blur-sm">
                点击查看完整大图
              </span>
            </div>
          </PosterCard>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          items={POSTER_ITEMS}
          activeIndex={lightbox.index}
          onClose={closeLightbox}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </section>
  )
}
