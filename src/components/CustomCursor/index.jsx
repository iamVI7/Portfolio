import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export function CustomCursor() {
  const { dark } = useTheme()
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const x = useSpring(mouseX, { stiffness: 800, damping: 50, mass: 0.1 })
  const y = useSpring(mouseY, { stiffness: 800, damping: 50, mass: 0.1 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)

    const handler = (e) => setIsTouch(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (isTouch) return

    const move = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    const onOver = (e) =>
      setHovering(!!e.target.closest('a, button, [role="button"], label, select, input, textarea'))

    const leave = () => setVisible(false)

    const enter = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', onOver)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [isTouch, mouseX, mouseY])

  if (isTouch) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        opacity: visible ? 1 : 0,
        width:  hovering ? 28 : 6,
        height: hovering ? 28 : 6,
        background: hovering
          ? dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,15,20,0.06)'
          : dark ? 'rgba(255,255,255,0.9)'  : 'rgba(15,15,20,0.75)',
        boxShadow: hovering
          ? `inset 0 0 0 1px ${dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,15,20,0.18)'}`
          : 'none',
        transition: 'width 0.2s cubic-bezier(0.32,0.72,0,1), height 0.2s cubic-bezier(0.32,0.72,0,1), background 0.2s ease, opacity 0.15s ease, box-shadow 0.2s ease',
      }}
    />
  )
}