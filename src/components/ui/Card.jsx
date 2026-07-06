import { memo } from 'react'
import { cn } from '../../lib/utils'

function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-card-border/80 p-6',
        'backdrop-blur-md bg-card/70',
        'card-topline red-string',
        'transition-all duration-300 ease-out',
        'hover:backdrop-blur-lg hover:bg-card/85',
        'hover:scale-[1.02] hover:-translate-y-1.5 hover:border-plum/35 hover:shadow-[0_10px_40px_rgba(var(--color-plum),0.12)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default memo(Card)
