import { useState, useEffect } from 'react'
import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'
import Butterflies from '../components/effects/Butterflies'

function getTargetDate() {
  const now = new Date()
  const year = now.getFullYear()
  const target = new Date(year, 6, 15, 0, 0, 0)
  if (now > target) {
    return new Date(year + 1, 6, 15, 0, 0, 0)
  }
  return target
}

function useCountdown() {
  const [target] = useState(getTargetDate)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown()

  return (
    <div className="inline-flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl bg-card/60 border border-card-border/60 backdrop-blur-sm">
      <span className="text-xs text-paper-dim/70">距离 7 月 15 日生日还有</span>
      <div className="flex items-center gap-1.5 text-paper font-mono text-lg md:text-xl tabular-nums">
        <span className="text-plum font-bold">{days}</span>
        <span className="text-sm text-paper-dim">天</span>
        <span className="w-px h-4 bg-card-border mx-1" />
        <span>{String(hours).padStart(2, '0')}</span>
        <span className="text-paper-dim">:</span>
        <span>{String(minutes).padStart(2, '0')}</span>
        <span className="text-paper-dim">:</span>
        <span>{String(seconds).padStart(2, '0')}</span>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Butterflies count={5} />

      {/* 背景光晕 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--hero-glow), transparent 70%)' }}
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
              textShadow: 'var(--hero-text-glow)',
            }}
          >
            雪
          </span>
          <span
            className="inline-block text-paper"
            style={{
              textShadow: 'var(--hero-text-glow)',
            }}
          >
            霁梅香
          </span>
        </h1>

        <div className="mb-6 flex justify-center">
          <Countdown />
        </div>

        <p className="text-decorative text-xl md:text-2xl text-paper-dim mb-4">
          「赤团开时斜飞去，最不安神晴又复雨」
        </p>

        <p className="text-paper-dim/70 text-base md:text-lg max-w-2xl mx-auto mb-10">
          欢迎来到胡桃生日会——一场属于往生堂第七十七代堂主的庆典。
          在这里，梅花与火焰共舞，蝴蝶引路，幽魂作伴。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#recruitment">
            <Button showFire={false}>立即加入招募</Button>
          </a>
          <a href="#about">
            <Button variant="secondary">了解我们</Button>
          </a>
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
