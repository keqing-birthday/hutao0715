import { useEffect, useState } from 'react'

const STORAGE_KEY = 'hutao-theme'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement

  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  return resolved
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system'
    return localStorage.getItem(STORAGE_KEY) || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    setResolvedTheme(applyTheme(theme))
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') {
        setResolvedTheme(applyTheme('system'))
      }
    }
    if (media.addEventListener) {
      media.addEventListener('change', handler)
    } else if (media.addListener) {
      media.addListener(handler)
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handler)
      } else if (media.removeListener) {
        media.removeListener(handler)
      }
    }
  }, [theme])

  const toggle = () => {
    setTheme((prev) => {
      return prev === 'system'
        ? (getSystemTheme() === 'dark' ? 'light' : 'dark')
        : (prev === 'dark' ? 'light' : 'dark')
    })
  }

  return { theme, resolvedTheme, setTheme, toggle }
}

// 手动调试入口
if (typeof window !== 'undefined') {
  window.__hutaoTheme = {
    get theme() { return localStorage.getItem(STORAGE_KEY) },
    setTheme(value) { applyTheme(value); localStorage.setItem(STORAGE_KEY, value) },
    toggle() {
      const current = localStorage.getItem(STORAGE_KEY) || 'system'
      const next = current === 'system'
        ? (getSystemTheme() === 'dark' ? 'light' : 'dark')
        : (current === 'dark' ? 'light' : 'dark')
      this.setTheme(next)
    }
  }
}
