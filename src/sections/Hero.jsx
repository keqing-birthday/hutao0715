import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'
import ImageCarousel from '../components/ui/ImageCarousel'
import Butterflies from '../components/effects/Butterflies'
import Countdown from '../components/Countdown'

const CAROUSEL_IMAGES = [
  '/images/0076e02e245c16577fa78a3f63af4b37_5103137104824509611.webp',
  '/images/2a6f9c18ab0686d46167e42129b9c535_955622761399978787.webp',
  '/images/9e679c14a6f21f145854431f64d6600f_1852449604643516023.webp',
  '/images/e8b0734241af9e779abd7f2571302f9e_5642792909118691293.webp',
  '/images/f0a609999ca21704e13438a0ac7eb435_3079362125314025578.webp',
]

function PlumDecoration({ className, size = 24 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 2C12 2 10 8 10 10C10 12 11 13 12 13C13 13 14 12 14 10C14 8 12 2 12 2Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M2 12C2 12 8 10 10 10C12 10 13 11 12 12C13 13 12 14 10 14C8 14 2 12 2 12Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M22 12C22 12 16 10 14 10C12 10 11 11 12 12C11 13 12 14 14 14C16 14 22 12 22 12Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M12 22C12 22 10 16 10 14C10 12 11 11 12 12C13 11 14 12 14 14C14 16 12 22 12 22Z"
        fill="currentColor"
        opacity="0.8"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Butterflies count={5} />

      {/* 水墨/梅花剪影背景装饰层 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="plum-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.5" />
              <circle cx="150" cy="150" r="25" fill="currentColor" opacity="0.4" />
              <circle cx="100" cy="180" r="20" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plum-pattern)" />
        </svg>
      </div>

      {/* 宣纸纹理背景 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 背景光晕 - 视差滚动 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none parallax-glow"
        style={{ background: 'radial-gradient(circle, var(--hero-glow), transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 animate-fade-up">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          {/* 左侧文字 */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              <Tag className="text-base px-4 py-1.5">
                🌸 往生堂第七十七代堂主 · 生日庆典
              </Tag>
            </div>

            {/* 标题错落排版 */}
            <h1 className="text-display text-5xl md:text-7xl lg:text-8xl mb-6 relative">
              <span className="relative inline-flex items-baseline">
                <span
                  className="inline-block text-plum"
                  style={{
                    transform: 'rotate(-3deg) translateY(-2px)',
                    textShadow: 'var(--hero-text-glow)',
                  }}
                >
                  雪
                </span>
                <span
                  className="inline-block text-paper"
                  style={{
                    transform: 'rotate(-1deg) translateY(1px)',
                    textShadow: 'var(--hero-text-glow)',
                    marginLeft: '0.05em',
                  }}
                >
                  霁
                </span>
                <span
                  className="inline-block text-paper"
                  style={{
                    transform: 'rotate(2deg) translateY(-1px)',
                    textShadow: 'var(--hero-text-glow)',
                    marginLeft: '0.05em',
                  }}
                >
                  梅
                </span>
                <span
                  className="inline-block text-paper"
                  style={{
                    transform: 'rotate(4deg) translateY(2px)',
                    textShadow: 'var(--hero-text-glow)',
                    marginLeft: '0.05em',
                  }}
                >
                  香
                </span>
                {/* 梅花装饰 */}
                <PlumDecoration
                  className="absolute -top-4 -right-6 text-plum/40 dark:text-plum/30 animate-float"
                  size={28}
                />
                <PlumDecoration
                  className="absolute -bottom-2 -left-4 text-plum/30 dark:text-plum/20 animate-float"
                  size={20}
                  style={{ animationDelay: '1s' }}
                />
              </span>
            </h1>

            <div className="mb-6 flex justify-center md:justify-start">
              <Countdown />
            </div>

            <p className="text-decorative text-xl md:text-2xl text-paper-dim mb-4">
              「赤团开时斜飞去，最不安神晴又复雨」
            </p>

            <p className="text-paper-dim/70 text-base md:text-lg max-w-xl mx-auto md:mx-0 mb-10">
              欢迎来到胡桃生日会——一场属于往生堂第七十七代堂主的庆典。
              在这里，梅花与火焰共舞，蝴蝶引路，幽魂作伴。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a href="#recruitment">
                <Button showFire={false}>立即加入招募</Button>
              </a>
              <a href="#about">
                <Button variant="secondary">了解我们</Button>
              </a>
            </div>
          </div>

          {/* 右侧轮播 */}
          <div className="w-full md:w-1/2 flex justify-center">
            <ImageCarousel images={CAROUSEL_IMAGES} />
          </div>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgb(var(--color-ink)), transparent)' }}
      />
    </section>
  )
}
