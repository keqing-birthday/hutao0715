import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const GROUP_NUMBER = '693766057'

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(GROUP_NUMBER)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // 降级方案：选中并提示用户手动复制
      const input = document.createElement('input')
      input.value = GROUP_NUMBER
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <footer className="relative bg-ink pt-16 pb-8 overflow-hidden">
      {/* 梅花装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        {/* 左侧梅花 */}
        <div className="absolute bottom-0 left-[10%] opacity-15" style={{ width: 60, height: 60 }}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {[0, 72, 144, 216, 288].map((a, i) => (
              <g key={i} transform={`rotate(${a} 50 50)`}>
                <path d="M50 50C46 44 38 34 42 24Q46 21 50 23Q54 21 58 24C62 34 54 44 50 50Z" fill="var(--petal-1)" />
              </g>
            ))}
            <circle cx="50" cy="50" r="8" fill="var(--petal-1)" opacity="0.7" />
          </svg>
        </div>
        {/* 右侧梅花 */}
        <div className="absolute bottom-0 right-[15%] opacity-12" style={{ width: 48, height: 48 }}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {[0, 72, 144, 216, 288].map((a, i) => (
              <g key={i} transform={`rotate(${a} 50 50)`}>
                <path d="M50 50C46 44 38 34 42 24Q46 21 50 23Q54 21 58 24C62 34 54 44 50 50Z" fill="var(--petal-2)" />
              </g>
            ))}
            <circle cx="50" cy="50" r="8" fill="var(--petal-2)" opacity="0.7" />
          </svg>
        </div>
        {/* 中间梅花 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-10" style={{ width: 72, height: 72 }}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {[0, 72, 144, 216, 288].map((a, i) => (
              <g key={i} transform={`rotate(${a} 50 50)`}>
                <path d="M50 50C46 44 38 34 42 24Q46 21 50 23Q54 21 58 24C62 34 54 44 50 50Z" fill="var(--petal-3)" />
              </g>
            ))}
            <circle cx="50" cy="50" r="8" fill="var(--petal-3)" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* 卷轴装饰顶部 */}
      <div className="absolute top-0 left-0 right-0 h-6 pointer-events-none overflow-hidden">
        <div className="w-full h-full relative">
          {/* 卷轴轴头装饰 */}
          <div className="absolute top-0 left-4 w-8 h-6 rounded-b-full bg-earth/30 border-b border-earth/40" />
          <div className="absolute top-0 right-4 w-8 h-6 rounded-b-full bg-earth/30 border-b border-earth/40" />
          {/* 卷轴中间纹理 */}
          <div className="absolute top-0 left-12 right-12 h-4 border-b border-dashed border-earth/20" />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="divider-gradient mb-8" />

        {/* 联系方式 */}
        <div className="mb-10">
          <h3 className="text-title text-xl md:text-2xl text-paper mb-6">
            联系我们
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {/* 群二维码 */}
            <div className="relative group">
              <div
                className="p-2 rounded-xl border border-card-border shadow-sm"
                style={{
                  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                  backdropFilter: 'blur(12px) saturate(180%)',
                  background: 'rgba(var(--color-card), 0.6)',
                }}
              >
                <img
                  src="/images/qr-320.webp"
                  alt="交流群二维码"
                  className="w-36 h-36 sm:w-40 sm:h-40 object-cover rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="text-xs text-paper-dim/60 mt-2">扫码加入交流群</p>
            </div>

            {/* 群号与复制按钮 */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <p className="text-paper-dim text-sm">或搜索群号加入</p>
              <div
                className="flex items-center gap-3 p-3 rounded-xl border border-card-border/60"
                style={{
                  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                  backdropFilter: 'blur(12px) saturate(180%)',
                  background: 'rgba(var(--color-card), 0.6)',
                }}
              >
                <span className="text-title text-2xl sm:text-3xl text-paper tracking-wider">
                  {GROUP_NUMBER}
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-btn bg-plum/10 text-plum border border-plum/25 hover:bg-plum/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
                  aria-label="复制群号"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-title text-lg md:text-xl text-paper mb-2">
          胡桃生日会
        </h3>

        <p className="text-paper-dim text-sm md:text-base mb-6">
          往生堂第七十七代堂主 · 生贺组作品
        </p>

        <p className="text-sm text-paper-dim/80 mb-4">
          本站为原神角色「胡桃」同人生日庆祝活动页面，非官方内容
        </p>

        <p className="text-sm text-paper-dim/80 mb-8">
          由胡桃生贺组「引蝶杯」制作 · QQ群：693766057
        </p>

        <p className="text-xs text-paper-dim/50 mb-2">
          © 2026 Hutao Birthday Fan Project. All rights reserved.
        </p>

        <p className="text-xs text-paper-dim/50 mb-2">v1.0.1</p>

        <p className="text-xs text-paper-dim/50 mb-1">
          本网站为同人作品，所涉及的官方游戏角色、图像、音乐等素材版权归米哈游所有。
        </p>

        <p className="text-xs text-paper-dim/50">
          Genshin Impact and Hutao are trademarks of miHoYo/HoYoverse. This is a fan-made project and is not affiliated with miHoYo.
        </p>
      </div>
    </footer>
  )
}
