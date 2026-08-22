import { useState, useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'
import { Container } from '../../ui/Container'
import { TimelinePanel } from './components/TimelinePanel'
import { CertificatesRow } from './components/CertificatesRow'

export function Story() {
  const { dark } = useTheme()
  const [expanded, setExpanded] = useState(false)

  // Measured-height accordion instead of animating to/from Framer
  // Motion's `'auto'` height: with content this nested (timeline +
  // certificate grid, both with their own images and layout), animating
  // to a literal 'auto' target makes Framer re-measure mid-animation and
  // can visibly stutter. Animating to a known pixel value — tracked live
  // via ResizeObserver, so it stays correct if content reflows — is
  // smooth regardless of what's inside.
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="journey"
      aria-labelledby="story-heading"
      className="relative py-20 sm:py-28"
    >
      <Container size="md">

        {/* ── View more / view less toggle — sits right after Projects ── */}
        <div className={cn('flex flex-col items-center', expanded ? 'mb-14 sm:mb-20' : '')}>
          <span className={cn(
            'font-mono text-[11px] uppercase tracking-[0.2em] mb-4',
            dark ? 'text-slate-500' : 'text-slate-400'
          )}>
            {expanded ? 'View less' : 'View more'}
          </span>

          <motion.button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="story-content"
            aria-label={expanded ? 'Show less of the journey' : 'Show more of the journey'}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              'flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-200',
              dark
                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                : 'bg-white border-indigo-100 text-indigo-700 shadow-pill hover:bg-indigo-50 hover:border-indigo-200'
            )}
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex"
            >
              <ChevronDown size={20} strokeWidth={2} />
            </motion.span>
          </motion.button>
        </div>

        {/* ── Heading, timeline, certificates: all hidden until expanded ── */}
        <motion.div
          id="story-content"
          initial={false}
          animate={{ height: expanded ? contentHeight : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div ref={contentRef}>
            <motion.div
              className="mb-14 sm:mb-20"
              animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: expanded ? 0.1 : 0 }}
            >
              <p className={cn(
                'font-mono text-[11px] uppercase tracking-[0.2em] mb-4',
                dark ? 'text-indigo-400' : 'text-indigo-500'
              )}>
                Milestones & Journey
              </p>

              <h2
                id="story-heading"
                className={cn(
                  'font-serif text-[38px] sm:text-[50px] font-normal leading-[1.05] tracking-tight',
                  dark ? 'text-slate-100' : 'text-slate-900'
                )}
              >
                A record of <em className={cn(
                  'italic',
                  dark ? 'text-slate-500' : 'text-slate-400'
                )}>growth</em>
              </h2>

              <p className={cn(
                'text-justify mt-2.5 text-[13px] leading-relaxed',
                dark ? 'text-slate-500' : 'text-slate-400'
              )}>
                Milestones, certificates, and the path that shaped the work.
              </p>
            </motion.div>

            {/* ── Timeline ── */}
            <TimelinePanel />

            {/* ── Certificates ── */}
            <div className="mt-20 sm:mt-28">
              <CertificatesRow />
            </div>
          </div>
        </motion.div>

      </Container>
    </section>
  )
}