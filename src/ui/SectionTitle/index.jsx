import { motion } from 'framer-motion'
import { revealUp, staggerContainer } from '../../utils/variants'
import { cn } from '../../utils/cn'

export function SectionTitle({ eyebrow, title, subtitle, center = true, className, id }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={cn('mb-16 sm:mb-24', center && 'text-center', className)}
    >
      {eyebrow && (
        <motion.div variants={revealUp} className="mb-4 inline-flex">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {eyebrow}
          </span>
        </motion.div>
      )}

      <motion.h2
        id={id}
        variants={revealUp}
        className="font-serif text-3xl font-normal leading-tight tracking-tight text-indigo-950 dark:text-slate-100 sm:text-4xl lg:text-[2.75rem] text-balance"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={revealUp}
          className={cn(
            'mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg',
            center && 'mx-auto max-w-xl'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
