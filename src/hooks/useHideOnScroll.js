import { useEffect, useRef, useState } from 'react'

/**
 * useHideOnScroll
 * Returns true once the user has scrolled down past `threshold` and is
 * actively scrolling further down — false near the top, or as soon as they
 * scroll back up even slightly. `tolerance` filters out the tiny scroll
 * jitters (momentum scrolling, trackpad noise) so it doesn't flicker.
 */
export function useHideOnScroll({ threshold = 80, tolerance = 6 } = {}) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    lastY.current = window.scrollY

    const update = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY.current

      if (currentY <= threshold) {
        setHidden(false)
      } else if (Math.abs(delta) > tolerance) {
        setHidden(delta > 0) // scrolling down → hide, scrolling up → reveal
      }

      lastY.current = currentY
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, tolerance])

  return hidden
}