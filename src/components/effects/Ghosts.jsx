export default function Ghosts() {
  const ghosts = [
    { id: 1, top: '12%', left: '8%', size: 120, delay: 0 },
    { id: 2, top: '50%', left: '82%', size: 95, delay: 4 },
    { id: 3, top: '78%', left: '18%', size: 80, delay: 8 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {ghosts.map((ghost) => (
        <img
          key={ghost.id}
          src="/ghost.png"
          alt=""
          className="absolute animate-float opacity-25 hover:opacity-40 transition-opacity"
          style={{
            top: ghost.top,
            left: ghost.left,
            width: ghost.size,
            height: 'auto',
            animationDelay: `${ghost.delay}s`,
            animationDuration: `${20 + ghost.id * 2}s`,
            filter: 'drop-shadow(0 0 10px rgba(123,104,238,0.15))',
          }}
        />
      ))}
    </div>
  )
}
