import { cn } from '../../lib/utils'

export default function TalismanCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'relative p-[2px] rounded-xl',
        'bg-gradient-to-br from-plum via-earth to-plum',
        className
      )}
      {...props}
    >
      <div className="relative rounded-xl bg-card p-[2px]">
        {/* 内层细线边框，模拟符咒框线 */}
        <div
          className="relative bg-card/70 p-6 rounded-xl border border-plum/15 backdrop-blur-sm"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(var(--color-plum),0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(var(--color-plum),0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%',
          }}
        >
          {/* 四角折角装饰 */}
          <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-plum/50" />
          <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-plum/50" />
          <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-plum/50" />
          <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-plum/50" />
          {children}
        </div>
      </div>
    </div>
  )
}
