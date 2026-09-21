import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Home,
  ScrollText,
  Images,
  BadgeCheck,
  Music,
  Sun,
  Moon,
  Monitor,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const navItems = [
  { label: '首页', to: '/', type: 'route', icon: Home },
  { label: '招募大厅', to: 'recruitment', type: 'scroll', icon: ScrollText },
  { label: '贡献成员', to: 'credits', type: 'scroll', icon: BadgeCheck },
  { label: '图集', to: '/album', type: 'route', icon: Images },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [themeOpen, setThemeOpen] = useState(false)
  const themePopoverRef = useRef(null)

  const isHome = location.pathname === '/'

  const handleNavClick = (item, e) => {
    if (item.type === 'scroll') {
      e.preventDefault()
      if (isHome) {
        document.getElementById(item.to)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate(`/?section=${item.to}`)
      }
      setOpen(false)
    }
  }

  // 点击「当前所在页面」的导航项（如首页点首页）时，Link 不会触发导航，
  // 这里兜底：清掉查询参数并滚回顶部
  const handleRouteClick = (item, e) => {
    if (location.pathname !== item.to) return
    e.preventDefault()
    if (location.search) navigate(item.to, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setOpen(false)
  }

  useEffect(() => {
    if (!themeOpen) return
    const handle = (e) => {
      if (themePopoverRef.current && !themePopoverRef.current.contains(e.target)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [themeOpen])

  const themeOptions = [
    { key: 'light', label: '浅色模式', icon: Sun },
    { key: 'dark', label: '深色模式', icon: Moon },
    { key: 'system', label: '跟随系统', icon: Monitor },
  ]

  const audioRef = useRef(null)
  const lastTimeUpdateRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      // 节流：每 250ms 最多更新一次进度，避免高频 timeupdate 触发重渲染
      const now = performance.now()
      if (now - lastTimeUpdateRef.current < 250) return
      lastTimeUpdateRef.current = now
      setCurrentTime(audio.currentTime)
    }
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    // 首次播放时才真正加载音频，避免首屏拉取 7.8 MB 文件
    if (!audio.src) {
      audio.src = '/music/蝶语之言.mp3'
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // 浏览器自动播放策略阻止时静默处理
        setIsPlaying(false)
      })
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio) return
    const time = parseFloat(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const audio = audioRef.current
    if (!audio) return
    const value = parseFloat(e.target.value)
    audio.volume = value
    setVolume(value)
    if (value > 0 && isMuted) {
      audio.muted = false
      setIsMuted(false)
    }
  }

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 isolate flex justify-center">
      <audio ref={audioRef} preload="none" />

      <nav
        className="relative w-full xl:w-[92vw] max-w-6xl h-18 px-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-b-2xl border-b border-x border-card-border/60 bg-card/85 shadow-[0_4px_24px_rgba(var(--color-shade),0.08)]"
        style={{
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => handleRouteClick({ to: '/' }, e)}
          className="btn-plain flex items-center gap-2.5 h-12 px-4 rounded-xl text-paper font-bold text-lg shrink-0"
        >
          <img
            src="/ghost.png"
            alt="胡桃生日会"
            className="h-7 w-7 object-contain rounded-lg"
          />
          <span className="text-title hidden sm:inline">胡桃生日会</span>
        </Link>

        {/* Desktop nav - centered */}
        <ul className="hidden lg:flex items-center justify-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const content = (
              <>
                <Icon size={16} strokeWidth={1.9} />
                <span>{item.label}</span>
              </>
            )
            return (
              <li key={item.to + item.type}>
                {item.type === 'route' ? (
                  <Link
                    to={item.to}
                    onClick={(e) => handleRouteClick(item, e)}
                    className="btn-plain flex items-center gap-2 h-10 px-3 xl:px-4 text-[15px] font-medium text-paper-dim hover:text-plum rounded-xl transition-colors duration-200"
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    href={`/?section=${item.to}`}
                    onClick={(e) => handleNavClick(item, e)}
                    className="btn-plain flex items-center gap-2 h-10 px-3 xl:px-4 text-[15px] font-medium text-paper-dim hover:text-plum rounded-xl transition-colors duration-200"
                  >
                    {content}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        {/* Right utilities */}
        <div className="flex items-center justify-end gap-1 shrink-0">
          {/* 音乐播放器（按钮 + 下拉面板，面板锚定按钮避免错位） */}
          <div className="relative hidden lg:block">
            <button
              className="btn-plain flex items-center justify-center w-11 h-11 rounded-xl text-paper-dim hover:text-plum transition-colors relative"
              aria-label={playerOpen ? '收起音乐播放器' : '展开音乐播放器'}
              aria-haspopup="true"
              aria-expanded={playerOpen}
              onClick={() => setPlayerOpen(!playerOpen)}
            >
              <Music size={18} strokeWidth={1.9} />
              {isPlaying && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-plum animate-pulse" />
              )}
            </button>

            {playerOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 p-4 rounded-2xl border border-card-border bg-card shadow-[0_10px_36px_rgba(var(--color-shade),0.24)] origin-top-right animate-dropdown">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center text-plum shrink-0">
                    <Music size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-paper truncate">蝶语之言</p>
                    <p className="text-xs text-paper-dim truncate">羽小泠，夏翊然，LittleLiu</p>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-card-border rounded-lg appearance-none cursor-pointer accent-plum"
                  />
                  <div className="flex justify-between text-xs text-paper-dim mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* 控制按钮 */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-plum text-paper hover:bg-fire transition-colors flex items-center justify-center"
                    aria-label={isPlaying ? '暂停' : '播放'}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-paper-dim hover:text-plum transition-colors"
                      aria-label={isMuted ? '取消静音' : '静音'}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-card-border rounded-lg appearance-none cursor-pointer accent-plum"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme selector */}
          <div className="relative hidden lg:block" ref={themePopoverRef}>
            <button
              className="btn-plain flex items-center justify-center w-11 h-11 rounded-xl text-paper-dim hover:text-plum transition-colors"
              aria-label="切换主题"
              aria-haspopup="menu"
              aria-expanded={themeOpen}
              onClick={() => setThemeOpen((o) => !o)}
            >
              {resolvedTheme === 'dark' ? (
                <Moon size={18} strokeWidth={1.9} />
              ) : (
                <Sun size={18} strokeWidth={1.9} />
              )}
            </button>

            {themeOpen && (
              <div
                role="menu"
                className="absolute top-full right-0 mt-2 w-56 p-2 rounded-2xl border border-card-border bg-card shadow-[0_10px_36px_rgba(var(--color-shade),0.24)] origin-top-right animate-dropdown"
              >
                {themeOptions.map(({ key, label, icon: Icon }) => {
                  const active = theme === key
                  return (
                    <button
                      key={key}
                      role="menuitem"
                      onClick={() => {
                        setTheme(key)
                        setThemeOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        active
                          ? 'bg-plum/10 text-plum'
                          : 'text-paper hover:bg-plum/[0.06] hover:text-plum'
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          active ? 'bg-plum/15 text-plum' : 'bg-ink text-paper-dim'
                        }`}
                      >
                        <Icon size={18} strokeWidth={1.9} />
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-plum" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden btn-plain flex items-center justify-center w-10 h-10 rounded-xl text-paper hover:text-plum transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="切换菜单"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {open && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-[55] cursor-default bg-ink/70"
            aria-label="关闭菜单"
            onClick={() => setOpen(false)}
          />
          <div
            className="lg:hidden fixed top-20 right-4 z-[60] w-72 max-w-[calc(100%-2rem)] p-2 rounded-2xl border border-card-border shadow-[0_10px_36px_rgba(var(--color-shade),0.24)] bg-card origin-top-right animate-dropdown"
          >
            <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to + item.type}>
                  {item.type === 'route' ? (
                    <Link
                      to={item.to}
                      className="btn-plain flex items-center gap-2.5 h-10 px-4 text-paper-dim hover:text-plum rounded-xl transition-colors"
                      onClick={(e) => {
                        handleRouteClick(item, e)
                        setOpen(false)
                      }}
                    >
                      <Icon size={17} strokeWidth={1.9} />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <a
                      href={`/?section=${item.to}`}
                      className="btn-plain flex items-center gap-2.5 h-10 px-4 text-paper-dim hover:text-plum rounded-xl transition-colors"
                      onClick={(e) => {
                        handleNavClick(item, e)
                        setOpen(false)
                      }}
                    >
                      <Icon size={17} strokeWidth={1.9} />
                      <span>{item.label}</span>
                    </a>
                  )}
                </li>
              )
            })}
            <li className="pb-3 border-b border-card-border/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center text-plum">
                  <Music size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-paper truncate">蝶语之言</p>
                  <p className="text-xs text-paper-dim/60 truncate">羽小泠，夏翊然，LittleLiu</p>
                </div>
              </div>

              <div className="mb-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-card-border rounded-lg appearance-none cursor-pointer accent-plum"
                />
                <div className="flex justify-between text-xs text-paper-dim/50 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-plum text-paper hover:bg-fire transition-colors flex items-center justify-center"
                  aria-label={isPlaying ? '暂停' : '播放'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-paper-dim hover:text-plum transition-colors"
                    aria-label={isMuted ? '取消静音' : '静音'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-card-border rounded-lg appearance-none cursor-pointer accent-plum"
                  />
                </div>
              </div>
            </li>
            <li className="pt-1">
              <p className="px-4 pb-2 text-xs text-paper-dim/60">主题</p>
              <div className="grid grid-cols-3 gap-2 px-2">
                {themeOptions.map(({ key, label, icon: Icon }) => {
                  const active = theme === key
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key)
                        setOpen(false)
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                        active
                          ? 'bg-plum/10 border-plum/50 text-plum'
                          : 'bg-card/50 border-card-border/60 text-paper-dim hover:border-plum/40 hover:text-plum'
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.9} />
                      <span>{label}</span>
                    </button>
                  )
                })}
              </div>
            </li>
            </ul>
          </div>
        </>
      )}
    </header>
  )
}
