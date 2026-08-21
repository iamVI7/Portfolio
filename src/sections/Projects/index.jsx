import { useRef, useState, useCallback } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
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
  { tx: 47, ty: 0, rotate: 0, scale: 0.93, z: 1 },
  { tx: 29, ty: 0, rotate: 0, scale: 0.96, z: 2 },
  { tx: 11, ty: 0, rotate: 0, scale: 1.00, z: 3 },
]

// Shared markup for a single card face — used by both the draggable front
// card and the static back cards, so image + pill are always one element
// tree moved by one transform, never two things animating separately.
// `dragging` swaps the pill's backdrop-blur for a plain solid fill while its
// card is actively being dragged — backdrop-filter has to resample whatever
// is now behind it on every single frame, which is expensive and gets worse
// the further the card overlaps the peeking cards behind it (hence why a
// rightward drag, which increases that overlap, felt choppier than left).
function CardFace({ proj, dragging = false }) {
  return (
    <>
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

      {/* Floating pill — pointer-events-none on the wrapper so it never
          steals the drag gesture from the card; only the link opts back in. */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-lg shadow-black/10',
            dragging
              ? 'bg-white dark:bg-slate-900'
              : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'
          )}
        >
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
            onPointerDown={e => e.stopPropagation()}
            className="pointer-events-auto shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          >
            <span className="text-[11px]" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </>
  )
}

// Front-card offset is always the same slot (last in STACK_OFFSETS).
const FRONT_OFFSET = STACK_OFFSETS[STACK_OFFSETS.length - 1]

function MobileStack({ projects: items, dark }) {
  const [order, setOrder]         = useState(items.map((_, i) => i).reverse())
  const [isDragging, setDragging] = useState(false)

  // Driven directly by Framer Motion's drag gesture — updates happen on the
  // compositor thread, not via React state, so the whole card (image + pill
  // together, since they're one element tree) moves as a single transform
  // with no per-pixel re-render to fall behind on.
  const dragX = useMotionValue(0)
  const frontX = useTransform(dragX, (v) => FRONT_OFFSET.tx + v)
  const frontRotate = useTransform(dragX, (v) => v / 18)
  const frontOpacity = useTransform(dragX, (v) => Math.max(0.55, 1 - Math.abs(v) / 260))

  const frontIdx = order[order.length - 1]

  // Front card is sent to the back of the pile — next card comes on top.
  const cycleNext = useCallback(() => {
    setOrder(prev => {
      const next = [...prev]
      next.unshift(next.pop())
      return next
    })
  }, [])

  // Inverse of cycleNext — pulls the previous card back on top of the pile.
  const cyclePrev = useCallback(() => {
    setOrder(prev => {
      const next = [...prev]
      next.push(next.shift())
      return next
    })
  }, [])

  const handleDragStart = () => setDragging(true)

  const handleDragEnd = (_event, info) => {
    setDragging(false)
    const x = info.offset.x
    if (x <= -65) {
      cycleNext()          // swipe left  → next card comes on top
      dragX.set(0)
    } else if (x >= 65) {
      cyclePrev()          // swipe right → previous card comes on top
      dragX.set(0)
    } else {
      animate(dragX, 0, { type: 'spring', stiffness: 500, damping: 34 })
    }
  }

  return (
    <div className="sm:hidden flex flex-col items-center w-full">
      <div style={{ width: 368, height: 466, position: 'relative', margin: '0 auto' }}>
        <div className="relative h-full" style={{ overflow: 'visible', width: 326, margin: '0 auto' }}>
          {order.map((projectIdx, stackPos) => {
            const isFront = stackPos === order.length - 1
            const { tx, ty, rotate, scale, z } = STACK_OFFSETS[Math.min(stackPos, 2)]
            const proj = items[projectIdx]

            const baseStyle = {
              position:     'absolute',
              top:          0,
              left:         0,
              width:        290,
              height:       446,
              borderRadius: 24,
              zIndex:       z,
              willChange:   'transform',
              overflow:     'hidden',
            }

            if (isFront) {
              return (
                <motion.div
                  key={proj.id}
                  drag="x"
                  dragMomentum={false}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...baseStyle,
                    x:        frontX,
                    y:        ty,
                    rotate:   frontRotate,
                    scale,
                    opacity:  frontOpacity,
                    touchAction: 'none',
                    boxShadow:   '0 20px 60px rgba(0,0,0,0.18)',
                    cursor:      isDragging ? 'grabbing' : 'grab',
                  }}
                  className="select-none"
                >
                  <CardFace proj={proj} dragging={isDragging} />
                </motion.div>
              )
            }

            return (
              <div
                key={proj.id}
                className="select-none"
                style={{
                  ...baseStyle,
                  transform:     `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`,
                  transition:    'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                  pointerEvents: 'none',
                  boxShadow:     '0 8px 24px rgba(0,0,0,0.10)',
                }}
              >
                <CardFace proj={proj} />
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
                  // Rotate whichever way reaches target `i` in fewer steps.
                  const forward = [...prev]
                  let fSteps = 0
                  while (forward[forward.length - 1] !== i) { forward.unshift(forward.pop()); fSteps++ }

                  const backward = [...prev]
                  let bSteps = 0
                  while (backward[backward.length - 1] !== i) { backward.push(backward.shift()); bSteps++ }

                  return fSteps <= bSteps ? forward : backward
                })
                dragX.set(0)
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

      {/* Counter */}
      <p className="mt-2.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
        swipe to explore · {frontIdx + 1} / {items.length}
      </p>

      {/* See more button — mobile only, below the stack */}
      <a
        href="https://github.com/iamVI7?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-200 whitespace-nowrap mt-6',
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

          {/* See more — desktop only (hidden on mobile, shown inside MobileStack) */}
          <a
            href="https://github.com/iamVI7?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'hidden sm:inline-flex group items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-200 whitespace-nowrap shrink-0 self-start sm:self-auto',
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

        {/* Mobile: swipe stack (includes See more button at bottom) */}
        <MobileStack projects={projects} dark={dark} />

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