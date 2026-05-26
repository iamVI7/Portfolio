export const revealUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const revealFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const staggerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
}

export const hoverLift = {
  rest: { y: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(99,102,241,0.07)' },
  hover: {
    y: -4,
    boxShadow: '0 16px 48px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.15)',
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}
