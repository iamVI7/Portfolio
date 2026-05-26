import { motion } from 'framer-motion'
import { hoverLift } from '../../utils/variants'
import { cn } from '../../utils/cn'

export function Card({ children, className, hover = false, padding = 'md' }) {
  const paddings = {
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-7 sm:p-8',
  }

  const base = cn(
    'rounded-[28px] border bg-white dark:bg-white/5 border-indigo-100/70 dark:border-white/10',
    paddings[padding],
    className
  )

  if (hover) {
    return (
      <motion.div
        variants={hoverLift}
        initial="rest"
        whileHover="hover"
        className={base}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cn(base, 'shadow-card dark:shadow-card-dark')}>
      {children}
    </div>
  )
}
