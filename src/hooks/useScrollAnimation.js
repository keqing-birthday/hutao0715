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
    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('scroll-visible')
          }
        })
      },
      { threshold, rootMargin }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector, threshold, rootMargin, once])

  return containerRef
}
