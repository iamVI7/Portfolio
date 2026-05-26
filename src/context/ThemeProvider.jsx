import { useState, useEffect } from 'react'
import { ThemeContext } from './ThemeContext'

function fadeThrough(goingDark, onFlip) {
  const midColor = goingDark ? '#000000' : '#ffffff'
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    pointer-events: none;
    background: ${midColor};
    opacity: 0;
    will-change: opacity;
  `
  document.body.appendChild(overlay)

  const fadeIn = overlay.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 150, easing: 'ease-in', fill: 'forwards' }
  )

  fadeIn.onfinish = () => {
    document.documentElement.classList.toggle('dark', goingDark)
    onFlip()

    const fadeOut = overlay.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 250, easing: 'ease-out', fill: 'forwards' }
    )
    fadeOut.onfinish = () => overlay.remove()
  }
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      return stored === 'dark' ||
        (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const toggle = () => {
    fadeThrough(!dark, () => setDark(d => !d))
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}