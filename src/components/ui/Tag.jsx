import { cn } from '../../lib/utils'

export default function Tag({ children, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-sm text-plum',
        'bg-plum/[0.08] border border-plum/25 backdrop-blur-sm',
        className
      )}
      style={{ borderRadius: '4px 12px 4px 12px' }}
      {...props}
    >
      {children}
    </span>
  )
}
