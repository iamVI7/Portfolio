import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '../../ui/Container'
import { projects } from '../../data/projects'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/cn'

const ACCENT_BG = {
  indigo: '#c7d2fe',
  violet: '#ddd6fe',
  blue:   '#bfdbfe',
  purple: '#e9d5ff',
  rose:   '#fecdd3',
  teal:   '#99f6e4',
  amber:  '#fde68a',
}

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
}

function ProjectCard({ project, index }) {
  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      aria-label={`Project: ${project.name}`}
      className="relative rounded-3xl overflow-hidden aspect-[4/5]"
    >
      {/* Full-bleed image / gradient */}
      <a href={project.href} aria-label={`Open ${project.name}`} className="absolute inset-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: ACCENT_BG[project.accent] ?? '#c7d2fe' }}
          >
            <span className="text-7xl select-none" aria-hidden="true">{project.emoji}</span>
          </div>
        )}
        {/* Subtle dark scrim at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </a>

      {/* Floating pill */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/10">
          <div className="min-w-0">
            <p className="font-serif text-[15px] font-normal leading-snug tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {project.name}
            </p>
            <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {project.description}
            </p>
          </div>
          <a
            href={project.href}
            aria-label={`View case study for ${project.name}`}
            className="pointer-events-auto shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          >
            <span className="text-[11px]" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Stack offsets: back cards peek from the right ────────────────────────────
const STACK_OFFSETS = [
  { tx: 32, ty: 0, rotate: 0, scale: 0.93, z: 1 },
  { tx: 16, ty: 0, rotate: 0, scale: 0.96, z: 2 },
  { tx:  0, ty: 0, rotate: 0, scale: 1.00, z: 3 },
]

function MobileStack({ projects: items }) {
  // Initialize reversed so index 0 is at the end (front), cycling 0→1→2→0
  const [order, setOrder]       = useState(items.map((_, i) => i).reverse())
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX]       = useState(0)
  const startXRef               = useRef(0)

  // front card is always last element in order array
  const frontIdx = order[order.length - 1]

  const cycleNext = useCallback(() => {
    setOrder(prev => {
      const next = [...prev]
      next.unshift(next.pop())
      return next
    })
    setDragX(0)
  }, [])

  const onPointerDown = (e) => {
    setDragging(true)
    startXRef.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    setDragX(e.clientX - startXRef.current)
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (Math.abs(dragX) > 65) cycleNext()
    else setDragX(0)
  }

  return (
    <div className="sm:hidden flex flex-col items-center">

      {/* Stack scene */}
      <div style={{ width: 310, height: 420, position: 'relative' }}>
        <div className="relative w-full h-full" style={{ overflow: 'visible' }}>
          {order.map((projectIdx, stackPos) => {
            const isFront = stackPos === order.length - 1
            const { tx, ty, rotate, scale, z } = STACK_OFFSETS[Math.min(stackPos, 2)]
            const proj = items[projectIdx]

            const dragTx     = isFront && dragging ? dragX : 0
            const dragRotate = 0
            const opacity    = isFront && dragging
              ? Math.max(0.4, 1 - Math.abs(dragX) / 200)
              : 1

            const cardStyle = {
              position:      'absolute',
              top:           0,
              left:          0,
              width:         260,
              height:        400,
              borderRadius:  24,
              transform:     `translate(${tx + dragTx}px, ${ty}px) rotate(${rotate + dragRotate}deg) scale(${scale})`,
              zIndex:        z,
              opacity,
              transition:    isFront && dragging
                ? 'none'
                : 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
              cursor:        isFront ? (dragging ? 'grabbing' : 'grab') : 'default',
              pointerEvents: isFront ? 'auto' : 'none',
              willChange:    'transform',
              touchAction:   'none',
              overflow:      'hidden',
              boxShadow:     isFront ? '0 20px 60px rgba(0,0,0,0.18)' : '0 8px 24px rgba(0,0,0,0.10)',
            }

            return (
              <div
                key={proj.id}
                style={cardStyle}
                className="select-none"
                onPointerDown={isFront ? onPointerDown : undefined}
                onPointerMove={isFront ? onPointerMove : undefined}
                onPointerUp={isFront ? onPointerUp : undefined}
                onPointerCancel={isFront ? () => { setDragging(false); setDragX(0) } : undefined}
              >
                {/* Solid background to prevent bleed-through */}
                <div className="absolute inset-0 bg-white dark:bg-slate-900" />
                {/* Full-bleed image / gradient */}
                <div className="absolute inset-0">
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: ACCENT_BG[proj.accent] ?? '#c7d2fe' }}
                    >
                      <span className="text-7xl select-none" aria-hidden="true">{proj.emoji}</span>
                    </div>
                  )}
                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating pill */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/10">
                    <div className="min-w-0">
                      <p className="font-serif text-[15px] font-normal leading-snug tracking-tight text-slate-900 dark:text-slate-100 truncate">
                        {proj.name}
                      </p>
                      <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {proj.description}
                      </p>
                    </div>
                    <a
                      href={proj.href}
                      aria-label={`View ${proj.name}`}
                      onClick={e => e.stopPropagation()}
                      className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    >
                      <span className="text-[11px]" aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-5">
        {items.map((_, i) => {
          const isActive = frontIdx === i
          return (
            <button
              key={i}
              onClick={() => {
                setOrder(prev => {
                  let o = [...prev]
                  while (o[o.length - 1] !== i) o.unshift(o.pop())
                  return o
                })
                setDragX(0)
              }}
              aria-label={`Go to project ${i + 1}`}
              className={cn(
                'h-[5px] rounded-full transition-all duration-300',
                isActive
                  ? 'w-5 bg-indigo-500'
                  : 'w-[6px] bg-slate-300 dark:bg-slate-600'
              )}
            />
          )
        })}
      </div>

      {/* Counter — derived from frontIdx, always in sync with active dot */}
      <p className="mt-2.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
        swipe to explore · {frontIdx + 1} / {items.length}
      </p>

    </div>
  )
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export function Projects() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { dark } = useTheme()

  return (
    <section
      id="projects"
      className="py-14 sm:py-22"
      aria-labelledby="projects-heading"
    >
      <Container size="lg">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-18 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 dark:text-indigo-500 mb-3">
              Selected work
            </p>
            <h2
              id="projects-heading"
              className="font-serif text-[38px] sm:text-[50px] font-normal leading-[1.05] tracking-tight text-slate-900 dark:text-slate-100"
            >
              Things I've <em className="italic text-slate-500 dark:text-slate-400">built</em>
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-400/60 dark:text-slate-500/60 font-normal tracking-wide">
              Products built with care for craft and{' '}
              <em className="italic">lasting impact.</em>
            </p>
          </div>

          <a
            href="https://github.com/iamVI7?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-200 whitespace-nowrap shrink-0 self-start sm:self-auto',
              dark
                ? 'bg-slate-100 text-slate-900 hover:bg-white shadow-[0_4px_20px_rgba(99,102,241,0.18)]'
                : 'bg-slate-900 text-white hover:bg-black shadow-[0_4px_16px_rgba(15,15,20,0.14)]'
            )}
          >
            See more
            <svg
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </a>
        </motion.div>

        {/* Mobile: swipe stack */}
        <MobileStack projects={projects} />

        {/* Desktop: 3-col grid */}
        <div className="hidden sm:grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </Container>
    </section>
  )
}