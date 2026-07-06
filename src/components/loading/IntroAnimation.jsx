import { useState, useEffect } from 'react'

/* ── 国画风格梅花：晕染+勾线 ── */
function InkPlumFlower({ cx, cy, scale = 1, inkTone = 'deep' }) {
  // 国画色调：朱砂、胭脂、曙红
  const tones = {
    deep:  { dark: '#a8241a', mid: '#c23b22', light: '#e0665a', wash: 'url(#ink-wash-deep)' },
    mid:   { dark: '#c23b22', mid: '#d4544a', light: '#e0665a', wash: 'url(#ink-wash-mid)' },
    light: { dark: '#d4544a', mid: '#e0665a', light: '#f2a6a0', wash: 'url(#ink-wash-light)' },
  }
  const t = tones[inkTone] || tones.deep

  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`}>
      {/* 花瓣阴影层（国画重叠效果） */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={`shadow-${i}`} transform={`rotate(${angle})`}>
          <path
            d="M0.5 0.5C-1.5 -3.5 -7 -10 -4 -16Q-1.5 -17.5 0.5 -15.5Q2.5 -17.5 5.5 -16C8.5 -10 3 -3.5 0.5 0.5Z"
            fill="none"
            stroke={t.dark}
            strokeWidth="1.5"
            strokeOpacity="0.15"
            transform="translate(1,1)"
          />
        </g>
      ))}

      {/* 主花瓣 */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={i} transform={`rotate(${angle})`}>
          {/* 花瓣晕染填充 */}
          <path
            d="M0 0C-2.5 -4 -8 -10 -5 -16Q-2.5 -17.5 0 -16Q2.5 -17.5 5 -16C8 -10 2.5 -4 0 0Z"
            fill={t.wash}
          />
          {/* 国画勾线 */}
          <path
            d="M0 0C-2.5 -4 -8 -10 -5 -16Q-2.5 -17.5 0 -16Q2.5 -17.5 5 -16C8 -10 2.5 -4 0 0Z"
            fill="none"
            stroke={t.dark}
            strokeWidth="0.6"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
          {/* 花瓣尖端浓色点缀（模拟国画焦墨） */}
          <ellipse cx="0" cy="-14" rx="2" ry="3" fill={t.dark} opacity="0.5" />
        </g>
      ))}

      {/* 花心晕染 */}
      <circle r="4" fill="url(#ink-center)" />
      {/* 花蕊（国画细笔点） */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r = 2.5
        const x = Math.cos(a * Math.PI / 180) * r
        const y = Math.sin(a * Math.PI / 180) * r
        return (
          <g key={i}>
            <line x1="0" y1="0" x2={x * 1.5} y2={y * 1.5} stroke="#FFD700" strokeWidth="0.5" opacity="0.7" />
            <circle cx={x * 1.5} cy={y * 1.5} r="0.6" fill="#FFD700" opacity="0.9" />
          </g>
        )
      })}
    </g>
  )
}

/* ── 国画叶片 ── */
function InkLeaf({ cx, cy, angle, scale = 1 }) {
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle}) scale(${scale})`}>
      {/* 叶片晕染 */}
      <path
        d="M0 0C-5 -7 -10 -14 -4 -20C0 -22 4 -20 8 -14C10 -7 5 0 0 0Z"
        fill="url(#ink-leaf)"
      />
      {/* 叶脉勾线 */}
      <path d="M0 0L0 -18" stroke="#2d5a3d" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
      <path d="M0 -6L-4 -10M0 -10L3 -14M0 -14L-2 -17" stroke="#2d5a3d" strokeWidth="0.4" opacity="0.3" />
      {/* 叶片边缘线 */}
      <path
        d="M0 0C-5 -7 -10 -14 -4 -20C0 -22 4 -20 8 -14C10 -7 5 0 0 0Z"
        fill="none"
        stroke="#3d6b4a"
        strokeWidth="0.5"
        opacity="0.5"
      />
    </g>
  )
}

/* ── 飘落花瓣（国画点染风格） ── */
function InkPetal({ delay, left, duration, color }) {
  return (
    <div
      className="absolute animate-fall-intro"
      style={{
        left,
        top: '-5%',
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 16C5 11.5 1 6 4 1Q6.5 -0.5 8 1.5Q9.5 -0.5 12 1C15 6 11 11.5 8 16Z"
          fill={color}
          opacity="0.55"
        />
        {/* 飘落花瓣的勾线 */}
        <path
          d="M8 16C5 11.5 1 6 4 1Q6.5 -0.5 8 1.5Q9.5 -0.5 12 1C15 6 11 11.5 8 16Z"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity="0.3"
        />
      </svg>
    </div>
  )
}

export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState('growing') // growing -> blooming -> fading -> done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('blooming'), 1800)
    const t2 = setTimeout(() => setPhase('fading'), 3400)
    const t3 = setTimeout(() => {
      setPhase('done')
      onComplete?.()
    }, 4000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  if (phase === 'done') return null

  const isFading = phase === 'fading'
  const showFlowers = phase === 'blooming' || phase === 'fading'

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-700 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* ── 主画布 ── */}
      <div className="relative w-[380px] h-[400px] md:w-[460px] md:h-[480px]">
        <svg
          viewBox="0 0 460 480"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* ═══ 国画晕染渐变定义 ═══ */}
          <defs>
            {/* 深红花瓣晕染 */}
            <radialGradient id="ink-wash-deep" cx="50%" cy="15%" r="75%">
              <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#a8241a" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#c23b22" stopOpacity="0.6" />
              <stop offset="85%" stopColor="#e0665a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f2a6a0" stopOpacity="0.05" />
            </radialGradient>
            {/* 中红花瓣晕染 */}
            <radialGradient id="ink-wash-mid" cx="50%" cy="15%" r="75%">
              <stop offset="0%" stopColor="#a8241a" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#c23b22" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#d4544a" stopOpacity="0.55" />
              <stop offset="85%" stopColor="#e0665a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f2a6a0" stopOpacity="0.03" />
            </radialGradient>
            {/* 浅红花瓣晕染 */}
            <radialGradient id="ink-wash-light" cx="50%" cy="15%" r="75%">
              <stop offset="0%" stopColor="#c23b22" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#d4544a" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#e0665a" stopOpacity="0.5" />
              <stop offset="85%" stopColor="#f2a6a0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f2a6a0" stopOpacity="0.02" />
            </radialGradient>
            {/* 花心晕染 */}
            <radialGradient id="ink-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B2500" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#a8241a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#c23b22" stopOpacity="0.2" />
            </radialGradient>
            {/* 叶片晕染 */}
            <radialGradient id="ink-leaf" cx="50%" cy="70%" r="65%">
              <stop offset="0%" stopColor="#2d5a3d" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#3d6b4a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4a7c59" stopOpacity="0.2" />
            </radialGradient>
            {/* 枝干纹理滤镜（模拟水墨渗透） */}
            <filter id="ink-bleed">
              <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>

          {/* ═══ 左侧枝干 ═══ */}
          {/* 主干（毛笔笔触：上细下粗） */}
          <path
            d="M-20 430 Q10 400, 40 370 Q70 340, 100 310 Q130 280, 155 255 Q180 230, 205 200 Q225 175, 240 150"
            fill="none"
            stroke="#5a3a1a"
            strokeWidth="5.5"
            strokeLinecap="round"
            filter="url(#ink-bleed)"
            className="intro-branch-main"
            style={{ strokeWidth: '6', strokeLinecap: 'round' }}
          />
          {/* 上分叉 */}
          <path
            d="M205 200 Q235 170, 265 145 Q300 115, 335 90 Q370 65, 410 50 Q435 40, 455 32"
            fill="none"
            stroke="#6B4423"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="intro-branch-1"
          />
          {/* 中分叉 */}
          <path
            d="M180 230 Q220 210, 265 190 Q310 172, 350 160 Q385 150, 415 142 Q440 136, 455 130"
            fill="none"
            stroke="#6B4423"
            strokeWidth="3"
            strokeLinecap="round"
            className="intro-branch-2"
          />
          {/* 下分叉 */}
          <path
            d="M100 310 Q140 290, 180 270 Q220 250, 255 238 Q285 228, 310 220"
            fill="none"
            stroke="#7A5C1A"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="intro-branch-3"
          />
          {/* 细枝 */}
          <path
            d="M335 90 Q360 72, 385 58 Q405 46, 420 38"
            fill="none"
            stroke="#8B6914"
            strokeWidth="2"
            strokeLinecap="round"
            className="intro-branch-4"
          />
          <path
            d="M350 160 Q375 145, 400 132 Q420 122, 435 115"
            fill="none"
            stroke="#8B6914"
            strokeWidth="2"
            strokeLinecap="round"
            className="intro-branch-5"
          />

          {/* ═══ 右侧枝干 ═══ */}
          <path
            d="M480 430 Q450 400, 420 370 Q390 340, 360 310 Q330 280, 305 255 Q280 230, 255 200 Q235 175, 220 150"
            fill="none"
            stroke="#5a3a1a"
            strokeWidth="5.5"
            strokeLinecap="round"
            className="intro-branch-main"
          />
          <path
            d="M255 200 Q225 170, 195 145 Q160 115, 125 90 Q90 65, 50 50 Q25 40, 5 32"
            fill="none"
            stroke="#6B4423"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="intro-branch-1"
          />
          <path
            d="M280 230 Q240 210, 195 190 Q150 172, 110 160 Q75 150, 45 142 Q20 136, 5 130"
            fill="none"
            stroke="#6B4423"
            strokeWidth="3"
            strokeLinecap="round"
            className="intro-branch-2"
          />
          <path
            d="M360 310 Q320 290, 280 270 Q240 250, 205 238 Q175 228, 150 220"
            fill="none"
            stroke="#7A5C1A"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="intro-branch-3"
          />
          <path
            d="M125 90 Q100 72, 75 58 Q55 46, 40 38"
            fill="none"
            stroke="#8B6914"
            strokeWidth="2"
            strokeLinecap="round"
            className="intro-branch-4"
          />
          <path
            d="M110 160 Q85 145, 60 132 Q40 122, 25 115"
            fill="none"
            stroke="#8B6914"
            strokeWidth="2"
            strokeLinecap="round"
            className="intro-branch-5"
          />

          {/* ═══ 花苞 ═══ */}
          <g className={`intro-bud ${showFlowers ? 'opacity-0' : 'opacity-100'}`} style={{ transition: 'opacity 0.3s ease-out' }}>
            {/* 花苞用小圆点 + 晕染 */}
            <circle cx="455" cy="32" r="5" fill="#a8241a" opacity="0.7" />
            <circle cx="455" cy="130" r="4.5" fill="#c23b22" opacity="0.7" />
            <circle cx="420" cy="38" r="4" fill="#d4544a" opacity="0.7" />
            <circle cx="435" cy="115" r="4" fill="#a8241a" opacity="0.7" />
            <circle cx="310" cy="220" r="4.5" fill="#c23b22" opacity="0.7" />
            <circle cx="240" cy="150" r="4.5" fill="#a8241a" opacity="0.7" />
            <circle cx="205" cy="238" r="4" fill="#e0665a" opacity="0.7" />
            <circle cx="255" cy="200" r="4.5" fill="#d4544a" opacity="0.7" />
            {/* 右侧 */}
            <circle cx="5" cy="32" r="5" fill="#a8241a" opacity="0.7" />
            <circle cx="5" cy="130" r="4.5" fill="#c23b22" opacity="0.7" />
            <circle cx="40" cy="38" r="4" fill="#d4544a" opacity="0.7" />
            <circle cx="25" cy="115" r="4" fill="#a8241a" opacity="0.7" />
            <circle cx="150" cy="220" r="4.5" fill="#c23b22" opacity="0.7" />
            <circle cx="220" cy="150" r="4.5" fill="#a8241a" opacity="0.7" />
            <circle cx="255" cy="238" r="4" fill="#e0665a" opacity="0.7" />
            <circle cx="205" cy="200" r="4.5" fill="#d4544a" opacity="0.7" />
          </g>

          {/* ═══ 国画梅花绽放 ═══ */}
          <g className={`intro-flower ${showFlowers ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.3s ease-out' }}>
            {/* 左支梅花 */}
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.8s both' }}>
              <InkPlumFlower cx={455} cy={32} scale={1.8} inkTone="deep" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.9s both' }}>
              <InkPlumFlower cx={455} cy={130} scale={1.6} inkTone="mid" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.0s both' }}>
              <InkPlumFlower cx={420} cy={38} scale={1.4} inkTone="light" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.05s both' }}>
              <InkPlumFlower cx={435} cy={115} scale={1.4} inkTone="deep" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.85s both' }}>
              <InkPlumFlower cx={240} cy={150} scale={1.5} inkTone="mid" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.1s both' }}>
              <InkPlumFlower cx={310} cy={220} scale={1.3} inkTone="light" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.0s both' }}>
              <InkPlumFlower cx={205} cy={238} scale={1.2} inkTone="mid" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.95s both' }}>
              <InkPlumFlower cx={255} cy={200} scale={1.4} inkTone="deep" />
            </g>

            {/* 右支梅花 */}
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.8s both' }}>
              <InkPlumFlower cx={5} cy={32} scale={1.8} inkTone="deep" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.9s both' }}>
              <InkPlumFlower cx={5} cy={130} scale={1.6} inkTone="mid" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.0s both' }}>
              <InkPlumFlower cx={40} cy={38} scale={1.4} inkTone="light" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.05s both' }}>
              <InkPlumFlower cx={25} cy={115} scale={1.4} inkTone="deep" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.85s both' }}>
              <InkPlumFlower cx={220} cy={150} scale={1.5} inkTone="mid" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.1s both' }}>
              <InkPlumFlower cx={150} cy={220} scale={1.3} inkTone="light" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 2.0s both' }}>
              <InkPlumFlower cx={255} cy={238} scale={1.2} inkTone="mid" />
            </g>
            <g style={{ animation: 'flower-pop 0.5s ease-out 1.95s both' }}>
              <InkPlumFlower cx={205} cy={200} scale={1.4} inkTone="deep" />
            </g>
          </g>

          {/* ═══ 国画叶片 ═══ */}
          <g className={`intro-leaf ${showFlowers ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.6s ease-out 2.2s' }}>
            {/* 左支 */}
            <InkLeaf cx={320} cy={70} angle={-30} scale={0.9} />
            <InkLeaf cx={350} cy={105} angle={15} scale={0.8} />
            <InkLeaf cx={280} cy={170} angle={-40} scale={0.85} />
            <InkLeaf cx={200} cy={230} angle={30} scale={0.75} />
            <InkLeaf cx={360} cy={45} angle={-10} scale={0.8} />
            {/* 右支 */}
            <InkLeaf cx={140} cy={70} angle={25} scale={0.9} />
            <InkLeaf cx={110} cy={105} angle={-15} scale={0.8} />
            <InkLeaf cx={180} cy={170} angle={40} scale={0.85} />
            <InkLeaf cx={260} cy={230} angle={-30} scale={0.75} />
            <InkLeaf cx={100} cy={45} angle={10} scale={0.8} />
          </g>
        </svg>

        {/* ═══ 飘落花瓣 ═══ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { d: 1.8, l: '5%', dur: 3.5, c: '#c23b22' },
            { d: 2.0, l: '15%', dur: 4.0, c: '#e0665a' },
            { d: 2.2, l: '28%', dur: 3.8, c: '#a8241a' },
            { d: 2.4, l: '42%', dur: 4.2, c: '#d4544a' },
            { d: 2.6, l: '55%', dur: 3.6, c: '#e0665a' },
            { d: 2.8, l: '68%', dur: 4.0, c: '#c23b22' },
            { d: 3.0, l: '18%', dur: 3.7, c: '#f2a6a0' },
            { d: 3.2, l: '78%', dur: 4.3, c: '#d4544a' },
            { d: 3.4, l: '48%', dur: 3.9, c: '#e0665a' },
            { d: 3.6, l: '35%', dur: 4.1, c: '#a8241a' },
            { d: 3.8, l: '62%', dur: 3.8, c: '#f2a6a0' },
            { d: 4.0, l: '8%', dur: 4.2, c: '#c23b22' },
          ].map((p, i) => (
            <InkPetal key={i} delay={p.d} left={p.l} duration={p.dur} color={p.c} />
          ))}
        </div>
      </div>

      {/* ═══ 标题 ═══ */}
      <div className="relative mt-4 text-center">
        <p
          className={`text-display text-3xl md:text-4xl text-paper transition-all duration-700 ${showFlowers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '400ms' }}
        >
          雪霁梅香
        </p>
        <p
          className={`text-decorative text-sm text-paper-dim mt-2 transition-all duration-700 ${showFlowers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '700ms' }}
        >
          胡桃生日会
        </p>
      </div>
    </div>
  )
}
