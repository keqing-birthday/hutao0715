import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'
import Butterflies from '../components/effects/Butterflies'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Butterflies count={5} />

      {/* 背景光晕 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(181,58,42,0.18), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-fade-up">
        <div className="mb-6 flex justify-center">
          <Tag className="text-base px-4 py-1.5">
            🌸 往生堂第七十七代堂主 · 生日庆典
          </Tag>
        </div>

        <h1 className="text-display text-6xl md:text-8xl lg:text-9xl mb-6">
          <span
            className="inline-block text-plum"
            style={{
              transform: 'rotate(-3deg)',
              textShadow: '0 0 10px rgba(181,58,42,0.35), 0 0 40px rgba(181,58,42,0.15)',
            }}
          >
            雪
          </span>
          <span
            className="inline-block text-paper"
            style={{
              textShadow: '0 0 10px rgba(181,58,42,0.35), 0 0 40px rgba(181,58,42,0.15)',
            }}
          >
            霁梅香
          </span>
        </h1>

        <p className="text-decorative text-xl md:text-2xl text-paper-dim mb-4">
          「赤团开时斜飞去，最不安神晴又复雨」
        </p>

        <p className="text-paper-dim/70 text-base md:text-lg max-w-2xl mx-auto mb-10">
          欢迎来到胡桃生日会——一场属于往生堂第七十七代堂主的庆典。
          在这里，梅花与火焰共舞，蝴蝶引路，幽魂作伴。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#recruitment">
            <Button>立即加入招募</Button>
          </a>
          <a href="#about">
            <Button variant="secondary">了解我们</Button>
          </a>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #f7f2e8, transparent)' }}
      />
    </section>
  )
}
