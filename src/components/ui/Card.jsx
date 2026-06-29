import { cn } from '../../lib/utils'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-card/80 border border-card-border/80 p-6',
        'backdrop-blur-sm',
        'card-topline red-string',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:border-plum/35 hover:shadow-[0_10px_40px_rgba(var(--color-plum),0.12)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
