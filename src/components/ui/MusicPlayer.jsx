import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Music, X } from 'lucide-react'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [expanded, setExpanded] = useState(false)

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
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src="/music/蝶语之言.mp3" preload="metadata" />

      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-12 h-12 rounded-full bg-plum text-paper shadow-[0_4px_15px_rgba(181,58,42,0.35)] hover:bg-fire transition-colors flex items-center justify-center animate-pulse"
          aria-label="展开音乐播放器"
        >
          <Music size={20} />
        </button>
      ) : (
        <div className="w-72 bg-card/95 backdrop-blur-sm border border-card-border rounded-2xl shadow-[0_8px_30px_rgba(62,39,35,0.15)] p-4 animate-fade-up"
          style={{ WebkitBackdropFilter: 'blur(10px)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-plum/10 flex items-center justify-center text-plum">
                <Music size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-paper truncate">蝶语之言</p>
                <p className="text-xs text-paper-dim/60 truncate">羽小泠，夏翊然，LittleLiu</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-paper-dim/50 hover:text-paper transition-colors p-1"
              aria-label="收起播放器"
            >
              <X size={18} />
            </button>
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
    </div>
  )
}
