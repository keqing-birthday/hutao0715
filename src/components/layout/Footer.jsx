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
      {/* 彼岸花装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <div className="absolute bottom-0 left-[10%] text-6xl opacity-15">🌺</div>
        <div className="absolute bottom-0 right-[15%] text-5xl opacity-12">🌸</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-7xl opacity-10">🌺</div>
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
              <div className="p-2 bg-card rounded-xl border border-card-border shadow-sm">
                <img
                  src="/images/6639ec1cb1e5a01bac318e61e264a5b5_720.jpg"
                  alt="交流群二维码"
                  className="w-36 h-36 sm:w-40 sm:h-40 object-cover rounded-lg"
                />
              </div>
              <p className="text-xs text-paper-dim/60 mt-2">扫码加入交流群</p>
            </div>

            {/* 群号与复制按钮 */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <p className="text-paper-dim text-sm">或搜索群号加入</p>
              <div className="flex items-center gap-3">
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
          胡桃生日会 · 往生堂第七十七代堂主
        </h3>

        <p className="text-decorative text-paper-dim/80 text-lg italic mb-6">
          「赤团开时斜飞去，最不安神晴又复雨」
        </p>

        <p className="text-sm text-paper-dim/50">
          本网站为同人非官方作品 · 仅供交流学习
        </p>
      </div>
    </footer>
  )
}
