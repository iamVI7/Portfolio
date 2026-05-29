import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'
import { Container } from '../../ui/Container'
import { TimelinePanel } from './components/TimelinePanel'
import { CertificatesRow } from './components/CertificatesRow'

export function Story() {
  const { dark } = useTheme()

  return (
    <section
      id="journey"
      aria-labelledby="story-heading"
      className="relative py-20 sm:py-28"
    >
      <Container size="md">

        {/* ── Section Header ── */}
        <motion.div
          className="mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            'mt-2.5 text-[13px] leading-relaxed',
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

      </Container>
    </section>
  )
}