import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Container } from '../../ui/Container'
import { journey } from '../../data/journey'

const TAG_CONFIG = {
  education: { label: 'Education', color: '#38bdf8', dim: 'rgba(56,189,248,0.1)' },
  work:      { label: 'Work',      color: '#6366f1', dim: 'rgba(99,102,241,0.1)' },
  building:  { label: 'Building',  color: '#a78bfa', dim: 'rgba(167,139,250,0.1)' },
  pivot:     { label: 'Pivot',     color: '#fbbf24', dim: 'rgba(251,191,36,0.1)'  },
  now:       { label: 'Now',       color: '#fb7185', dim: 'rgba(251,113,133,0.1)' },
}

function NowPulse({ color }) {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}

function TimelineItem({ item, index, isLast }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const tag = item.tag?.toLowerCase() ?? 'work'
  const cfg = TAG_CONFIG[tag] ?? TAG_CONFIG.work

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[80px_1px_1fr] sm:grid-cols-[120px_1px_1fr] gap-x-0"
      aria-label={`${item.year}: ${item.title}`}
    >
      {/* Left: year pill */}
      <div className="flex flex-col items-end pr-4 sm:pr-6 pt-[12px]">
        <motion.span
          initial={{ opacity: 0, x: 6 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: index * 0.07 + 0.15 }}
          className="inline-flex items-center rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.04] px-3 py-1 font-mono text-[12px] sm:text-[13px] tabular-nums text-slate-400 dark:text-slate-500"
        >
          {item.year}
        </motion.span>
      </div>

      {/* Centre: vertical line + dot */}
      <div className="relative flex flex-col items-center" aria-hidden="true">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: index * 0.07 + 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 mt-[12px] h-3 w-3 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-950"
          style={{ backgroundColor: cfg.color }}
        />
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.07 + 0.2, ease: 'easeOut' }}
            className="mt-2 w-px flex-1 origin-top bg-slate-200 dark:bg-white/[0.08]"
          />
        )}
      </div>

      {/* Right: content card */}
      <div className={`pl-5 sm:pl-7 ${isLast ? 'pb-0' : 'pb-10 sm:pb-14'}`}>
        <div className="mt-[5px]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.07 + 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-slate-100 dark:border-white/[0.055] bg-slate-50/50 dark:bg-white/[0.025] px-4 sm:px-6 py-4 sm:py-5 backdrop-blur-sm"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            {/* Tag chip */}
            <div className="mb-2.5 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.13em]"
                style={{ backgroundColor: cfg.dim, color: cfg.color }}
              >
                {item.isNow && <NowPulse color={cfg.color} />}
                {cfg.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[16px] sm:text-[19px] font-semibold leading-snug tracking-[-0.02em] text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-1.5 text-[13px] sm:text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
              {item.description}
            </p>

            {/* Meta */}
            {item.meta?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {item.meta.map((m, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-600"
                  >
                    {m}
                    {i < item.meta.length - 1 && (
                      <span className="ml-3 text-slate-200 dark:text-slate-700">·</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.li>
  )
}

export function Journey() {
  const reversed = [...journey].reverse()

  return (
    <section id="journey" className="py-16 sm:py-24" aria-labelledby="journey-heading">
      <Container size="md">

        {/* Header */}
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">
  Journey
</p>
          <h2
            id="journey-heading"
            className="font-serif text-[38px] sm:text-[50px] font-normal leading-[1.05] tracking-tight text-slate-900 dark:text-slate-100"
          >
            How I got <em className="italic text-slate-500 dark:text-slate-400">here</em>
          </h2>
          <p className="mt-2.5 max-w-[280px] text-[13px] leading-relaxed text-slate-400 dark:text-slate-500">
            A timeline of growth, curiosity, and deliberate building.
          </p>
        </motion.div>

        {/* Timeline */}
        <ol className="flex flex-col" aria-label="Career timeline">
          {reversed.map((item, i) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={i}
              isLast={i === reversed.length - 1}
            />
          ))}
        </ol>

      </Container>
    </section>
  )
}