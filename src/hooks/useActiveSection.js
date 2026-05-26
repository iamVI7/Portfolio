import { useState, useEffect } from 'react'

export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || '')

  useEffect(() => {
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        {
          threshold: 0,
          rootMargin: '-80px 0px -60% 0px',
        }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [sectionIds])

  return active
}