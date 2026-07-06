import { useState, useCallback, memo } from 'react'
import { cn } from '../../lib/utils'

function RippleButton({
  children,
  variant = 'primary',
  className,
  showFire = true,
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const handleClick = useCallback((e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now() + Math.random()

    setRipples((prev) => [...prev, { id, x, y, size }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 px-6 py-3 font-medium transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'

  const variants = {
    primary: cn(
      'btn-primary bg-plum text-paper shadow-[0_4px_15px_rgba(var(--color-plum),0.25)]',
      'hover:bg-fire hover:shadow-[0_6px_25px_rgba(var(--color-fire),0.45)]',
      'active:scale-95'
    ),
    secondary: cn(
      'bg-card/50 border-2 border-plum text-plum backdrop-blur-sm',
      'hover:bg-plum/8 hover:shadow-[inset_0_0_15px_rgba(var(--color-plum),0.15)]',
      'active:scale-95'
    ),
  }

  return (
    <button
      className={cn(
        baseStyles,
        variant === 'primary' && variants.primary,
        variant === 'secondary' && variants.secondary,
        className
      )}
      style={{ borderRadius: '8px 20px 8px 20px' }}
      onClick={handleClick}
      {...props}
    >
      {/* 涟漪效果 */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      <span>{children}</span>
      {variant === 'primary' && showFire && (
        <span className="relative w-5 h-5">
          <span className="absolute -bottom-1 -right-1 text-lg animate-flame">🔥</span>
        </span>
      )}
    </button>
  )
}

function Button({
  children,
  variant = 'primary',
  className,
  showFire = true,
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const handleClick = useCallback((e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now() + Math.random()

    setRipples((prev) => [...prev, { id, x, y, size }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)

    props.onClick?.(e)
  }, [props])

  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 px-6 py-3 font-medium transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'

  const variants = {
    primary: cn(
      'btn-primary bg-plum text-paper shadow-[0_4px_15px_rgba(var(--color-plum),0.25)]',
      'hover:bg-fire hover:shadow-[0_6px_25px_rgba(var(--color-fire),0.45)]',
      'active:scale-95'
    ),
    secondary: cn(
      'bg-card/50 border-2 border-plum text-plum backdrop-blur-sm',
      'hover:bg-plum/8 hover:shadow-[inset_0_0_15px_rgba(var(--color-plum),0.15)]',
      'active:scale-95'
    ),
  }

  return (
    <button
      className={cn(
        baseStyles,
        variant === 'primary' && variants.primary,
        variant === 'secondary' && variants.secondary,
        className
      )}
      style={{ borderRadius: '8px 20px 8px 20px' }}
      onClick={handleClick}
      {...props}
    >
      {/* 涟漪效果 */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      <span>{children}</span>
      {variant === 'primary' && showFire && (
        <span className="relative w-5 h-5">
          <span className="absolute -bottom-1 -right-1 text-lg animate-flame">🔥</span>
        </span>
      )}
    </button>
  )
}

export default memo(Button)
