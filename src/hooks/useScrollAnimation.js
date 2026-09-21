import { useEffect, useRef } from 'react'

export function useScrollAnimation({
  selector = '.animate-on-scroll',
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
  once = true,
} = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current || document
    const elements = Array.from(container.querySelectorAll(selector))
    if (!elements.length) return

    const reveal = (el) => el.classList.add('scroll-visible')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 进入视口，或已经滚过（位于视口上方）都直接显示，
          // 避免快速滚动 / 切换标签页时元素永久停留在 opacity: 0
          const passed = entry.boundingClientRect.bottom <= 0
          if (entry.isIntersecting || (once && passed)) {
            reveal(entry.target)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('scroll-visible')
          }
        })
      },
      { threshold, rootMargin }
    )

    elements.forEach((el) => observer.observe(el))

    // 兜底：标签页在后台等情况下 IntersectionObserver 首帧可能不回调，
    // 这里手动把已在视口内的元素显示出来，避免内容永久不可见
    const raf = requestAnimationFrame(() => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < viewportHeight && rect.bottom > 0) reveal(el)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [selector, threshold, rootMargin, once])

  return containerRef
}
