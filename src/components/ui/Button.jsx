import { cn } from '../../lib/utils'

export default function Button({
  children,
  variant = 'primary',
  className,
  showFire = true,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 font-medium transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

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
      {...props}
    >
      <span>{children}</span>
      {variant === 'primary' && showFire && (
        <span className="relative w-5 h-5">
          <span className="absolute -bottom-1 -right-1 text-lg animate-flame">🔥</span>
        </span>
      )}
    </button>
  )
}
