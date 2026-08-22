import { useState, useLayoutEffect, useCallback } from 'react'
import { ThemeContext } from './ThemeContext'

// Matches the light/dark page background set in index.css. Used as the
// overlay's flat fill color so the circular reveal looks like the real
// destination theme growing in, not a generic flash.
const PAGE_BG = { light: '#f9f9f8', dark: '#0a0a14' }

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      return stored === 'dark' ||
        (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useLayoutEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  // Circular reveal anchored at the click point. Grows via `transform:
  // scale()` on a small circular div rather than animating `clip-path`
  // on a full-viewport one. clip-path isn't a guaranteed compositor-only
  // property — browsers generally have to repaint the clip mask on the
  // main thread most frames, and that repaint competing with the
  // subsequent React re-render (from setDark below) on the same thread
  // is what was making it stutter. `transform` and `opacity`, by
  // contrast, run on the compositor thread independent of main-thread
  // work, so this keeps animating smoothly even while React is busy
  // re-rendering underneath it.
  const toggle = useCallback((event) => {
    const nextDark = !dark

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDark(nextDark)
      return
    }

    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const SIZE = 40 // baseline diameter in px, scaled up to cover the viewport
    const scaleTo = (endRadius * 2) / SIZE

    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: ${y - SIZE / 2}px;
      left: ${x - SIZE / 2}px;
      width: ${SIZE}px;
      height: ${SIZE}px;
      border-radius: 50%;
      z-index: 99999;
      pointer-events: none;
      background: ${nextDark ? PAGE_BG.dark : PAGE_BG.light};
      transform: scale(0);
      will-change: transform;
    `
    document.body.appendChild(overlay)

    const grow = overlay.animate(
      [{ transform: 'scale(0)' }, { transform: `scale(${scaleTo})` }],
      { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    )

    // The real theme flips shortly after the circle starts growing, so
    // the swap is already hidden under solid color by the time it
    // happens. Because the overlay's growth runs on the compositor
    // thread, this state update (and the re-render it triggers) can't
    // stutter it even if it briefly occupies the main thread.
    window.setTimeout(() => setDark(nextDark), 80)

    grow.onfinish = () => {
      const fade = overlay.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 200, easing: 'ease-out', fill: 'forwards' }
      )
      fade.onfinish = () => overlay.remove()
    }
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}