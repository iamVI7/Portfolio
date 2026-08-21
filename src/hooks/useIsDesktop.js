import { useState, useEffect } from 'react'

// Matches Tailwind's `md` breakpoint (768px) — the same point at which the
// navbar switches from the mobile hamburger layout to inline desktop links.
const QUERY = '(min-width: 768px)'

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handleChange = (e) => setIsDesktop(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isDesktop
}