import Tag from '../components/ui/Tag'

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

function PosterCard({ poster, className = '', children }) {
  return (
    <a
      key={poster.src}
      href={poster.src}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block relative rounded-2xl overflow-hidden bg-card border border-card-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <img
        src={poster.src}
        alt={poster.alt}
        className="w-full h-auto object-contain"
        loading="lazy"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
      {children}
    </a>
  )
}

export default function OfflineEvents() {
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
          {POSTERS.slice(0, 2).map((poster) => (
            <PosterCard key={poster.src} poster={poster} />
          ))}
        </div>

        <div className="mt-8 md:mt-10">
          <PosterCard
            poster={POSTERS[2]}
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
    </section>
  )
}
