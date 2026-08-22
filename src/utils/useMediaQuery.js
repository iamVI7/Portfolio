import { useEffect, useState } from 'react'

// Framer Motion transition objects are plain JS, so they can't read
// Tailwind's `sm:` breakpoints — anything that needs to differ between
// mobile and desktop motion has to check the viewport itself. Defaults to
// `false` so server/first-paint renders assume mobile until the browser
// confirms otherwise, then stays in sync via the media query's own
// change event (handles resize and devtools device toggling, not just
// initial load).
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}