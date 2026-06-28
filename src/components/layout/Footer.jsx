export default function Footer() {
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

        <h3 className="text-title text-xl md:text-2xl text-paper mb-2">
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
