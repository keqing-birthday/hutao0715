import { cn } from '../../lib/utils'

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 bg-card border border-card-border text-paper placeholder:text-paper-dim/60',
        'outline-none transition-all duration-200',
        'focus:border-plum focus:shadow-[0_0_10px_rgba(181,58,42,0.15)]',
        className
      )}
      style={{ borderRadius: '8px 16px 8px 16px' }}
      {...props}
    />
  )
}
