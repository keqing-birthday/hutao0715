import { cn } from '../../lib/utils'

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 bg-card/70 border border-card-border/80 text-paper placeholder:text-paper-dim/60 backdrop-blur-sm',
        'outline-none transition-all duration-200',
        'focus:border-plum focus:shadow-[0_0_10px_rgba(var(--color-plum),0.15)]',
        className
      )}
      style={{ borderRadius: '8px 16px 8px 16px' }}
      {...props}
    />
  )
}
