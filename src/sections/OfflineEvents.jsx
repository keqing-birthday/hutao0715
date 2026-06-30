import Tag from '../components/ui/Tag'

const POSTERS = [
  {
    src: '/images/23B22C87A93D9C77459F6A2585AF4229.webp',
    alt: '线下活动主海报',
  },
  {
    src: '/images/5F752DAB9A50DD7D286690F989DE7236.webp',
    alt: '郑州场海报',
  },
  {
    src: '/images/61CA8874BE7702944F0E2B364D48B9B1.webp',
    alt: '上海场海报',
  },
]

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {POSTERS.map((poster) => (
            <a
              key={poster.src}
              href={poster.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-2xl overflow-hidden bg-card border border-card-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={poster.src}
                alt={poster.alt}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
