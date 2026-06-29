import { useState, useRef, useEffect } from 'react'
import {
  Menu,
  X,
  ScrollText,
  Users,
  Music,
  Sun,
  Moon,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const navLinks = [
  { label: '招募大厅', href: '#recruitment', icon: ScrollText },
  { label: '关于我们', href: '#about', icon: Users },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)
  const { resolvedTheme, toggle } = useTheme()

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
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
    } else {
      audio.play().catch(() => {
        // 浏览器自动播放策略阻止时静默处理
      })
    }
    setIsPlaying(!isPlaying)
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <audio ref={audioRef} src="/music/蝶语之言.mp3" preload="metadata" />

      <nav
        className="relative w-full xl:w-[92vw] max-w-6xl h-18 px-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-b-2xl border-b border-x border-card-border/60 bg-card/85 shadow-[0_4px_24px_rgba(var(--color-shade),0.08)]"
        style={{
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          className="btn-plain flex items-center gap-2.5 h-12 px-4 rounded-xl text-paper font-bold text-lg shrink-0"
        >
          <img
            src="/ghost.png"
            alt="胡桃生日会"
            className="h-7 w-7 object-contain rounded-lg"
          />
          <span className="text-title hidden sm:inline">胡桃生日会</span>
        </a>

        {/* Desktop nav - centered */}
        <ul className="hidden md:flex items-center justify-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="btn-plain flex items-center gap-2 h-10 px-4 text-[15px] font-medium text-paper-dim hover:text-plum rounded-xl transition-colors duration-200"
                >
                  <Icon size={16} strokeWidth={1.9} />
                  <span>{link.label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right utilities */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="btn-plain hidden md:flex items-center justify-center w-11 h-11 rounded-xl text-paper-dim hover:text-plum transition-colors relative"
            aria-label={playerOpen ? '收起音乐播放器' : '展开音乐播放器'}
            onClick={() => setPlayerOpen(!playerOpen)}
          >
            <Music size={18} strokeWidth={1.9} />
            {isPlaying && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-plum animate-pulse" />
            )}
          </button>

          <button
            className="btn-plain hidden md:flex items-center justify-center w-11 h-11 rounded-xl text-paper-dim hover:text-plum transition-colors"
            aria-label={resolvedTheme === 'dark' ? '切换为浅色模式' : '切换为深色模式'}
            onClick={() => toggle()}
          >
            {resolvedTheme === 'dark' ? (
              <Sun size={18} strokeWidth={1.9} />
            ) : (
              <Moon size={18} strokeWidth={1.9} />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn-plain flex items-center justify-center w-10 h-10 rounded-xl text-paper hover:text-plum transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="切换菜单"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Music player dropdown */}
      {playerOpen && (
        <div
          className="hidden md:block absolute top-full right-4 xl:right-[4vw] mt-2 w-72 p-4 rounded-2xl border border-card-border/60 shadow-[0_8px_30px_rgba(var(--color-shade),0.15)] bg-card/95 animate-fade-up"
          style={{
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            backdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center text-plum">
              <Music size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-paper truncate">蝶语之言</p>
              <p className="text-xs text-paper-dim/60 truncate">羽小泠，夏翊然，LittleLiu</p>
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
            <div className="flex justify-between text-xs text-paper-dim/50 mt-1">
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

      {/* Mobile nav */}
      {open && (
        <div
          className="md:hidden absolute top-full left-4 right-4 mt-2 p-2 rounded-2xl border border-card-border/60 shadow-[0_8px_32px_rgba(var(--color-shade),0.1)] bg-card/95 animate-fade-up"
          style={{
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            backdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="btn-plain flex items-center gap-2.5 h-10 px-4 text-paper-dim hover:text-plum rounded-xl transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={17} strokeWidth={1.9} />
                    <span>{link.label}</span>
                  </a>
                </li>
              )
            })}
            <li>
              <button
                className="btn-plain w-full flex items-center gap-2.5 h-10 px-4 text-paper-dim hover:text-plum rounded-xl transition-colors"
                onClick={() => {
                  toggle()
                  setOpen(false)
                }}
                aria-label={resolvedTheme === 'dark' ? '切换为浅色模式' : '切换为深色模式'}
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun size={17} strokeWidth={1.9} />
                    <span>浅色模式</span>
                  </>
                ) : (
                  <>
                    <Moon size={17} strokeWidth={1.9} />
                    <span>深色模式</span>
                  </>
                )}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
