import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Container } from '../../ui/Container'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/vishal-yadav-v7',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/iamVI7',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
]

const EMAIL = 'vishalyadav75186@gmail.com'

function CopyEmailButton({ dark }) {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setHovered(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const label = copied ? 'Copied!' : hovered ? 'Copy email' : EMAIL

  return (
    <motion.button
      layout
      onClick={handleCopy}
      onMouseEnter={() => !copied && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Copy email address"
      transition={{ layout: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10.5px] sm:text-[11px] transition-colors duration-200 overflow-hidden whitespace-nowrap',
        copied
          ? dark
            ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-400'
            : 'border-emerald-300 bg-emerald-50 text-emerald-600'
          : dark
          ? 'border-white/[0.09] bg-white/[0.03] text-slate-500 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.07]'
          : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300'
      )}
    >
      {/* Icon */}
      <motion.span layout className="flex-shrink-0">
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        )}
      </motion.span>

      {/* Label — pill resizes to fit, animates smoothly via layout */}
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

function AvatarCircle({ dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="relative flex-shrink-0"
    >
      <div className={cn(
        'relative flex items-center justify-center rounded-full select-none',
        'w-[168px] h-[168px] sm:w-[196px] sm:h-[196px]',
        dark ? 'bg-[#111827]' : 'bg-[#eef2ff]',
        'shadow-[0_4px_20px_rgba(99,102,241,0.10)]'
      )}>
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: dark
              ? 'radial-gradient(circle at 50% 35%, rgba(99,102,241,0.16) 0%, transparent 68%)'
              : 'radial-gradient(circle at 50% 35%, rgba(99,102,241,0.09) 0%, transparent 68%)',
          }}
          aria-hidden="true"
        />
        {/* Transparent overlay to block right-click saving */}
        <div
          className="absolute inset-0 rounded-full z-10"
          onContextMenu={(e) => e.preventDefault()}
          aria-hidden="true"
        />
        <img
          src="/avatar.png"
          alt="Vishal Yadav"
          className="relative h-full w-full rounded-full object-cover object-top select-none pointer-events-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* Available badge */}
      <div className={cn(
        'absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-3 py-1 whitespace-nowrap',
        dark
          ? 'bg-[#0d1117] border border-emerald-500/20 shadow-md'
          : 'bg-white border border-emerald-200 shadow-sm'
      )}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className={cn('font-mono text-[9px] uppercase tracking-widest', dark ? 'text-emerald-400' : 'text-emerald-600')}>
          Available
        </span>
      </div>
    </motion.div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

export function Hero() {
  const { dark } = useTheme()

  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden pb-10 pt-24"
      aria-label="Introduction"
    >
      {/* Page-level indigo glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
        style={{
          background: dark
            ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container size="lg">
        <div className="flex flex-col items-center gap-10 sm:items-start sm:flex-row sm:gap-12 lg:gap-16 mx-auto w-fit">

          {/* ── Avatar ── */}
          <div className="flex items-start pt-0 sm:pt-[2.8rem]">
            <AvatarCircle dark={dark} />
          </div>

          {/* ── Text block ── */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">

            {/* Heading — custom={0} now since namaste is removed */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <h1>
                <span className={cn(
                  'block font-sans font-bold leading-[1.08] tracking-tight',
                  'text-[2.6rem] sm:text-[3.1rem] lg:text-[3.75rem]',
                  dark ? 'text-slate-100' : 'text-slate-900'
                )}>
                  I'm{' '}
                  <span className="font-serif italic font-normal" style={{ color: '#6366f1' }}>
                    Vishal Yadav
                  </span>
                </span>
                <span className={cn(
                  'block font-serif italic font-normal leading-[1.15] mt-1',
                  'text-[1.7rem] sm:text-[2.05rem] lg:text-[2.5rem]',
                  dark ? 'text-slate-400' : 'text-slate-500'
                )}>
                  software engineer.
                </span>
              </h1>
            </motion.div>

            {/* Sub text */}
            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={cn(
                'mt-5 max-w-[40ch] text-[15px] sm:text-[16px] leading-[1.8]',
                dark ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              A B.Tech graduate Engineered in{' '}
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[13px] font-medium align-middle',
                dark
                  ? 'border-white/[0.12] bg-white/[0.06] text-slate-300'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              )}>
                {/* India flag SVG */}
                <svg width="18" height="12" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" className="rounded-[2px] flex-shrink-0">
                  <rect width="900" height="200" y="0"   fill="#FF9933"/>
                  <rect width="900" height="200" y="200" fill="#FFFFFF"/>
                  <rect width="900" height="200" y="400" fill="#138808"/>
                  <circle cx="450" cy="300" r="80" fill="none" stroke="#000088" strokeWidth="10"/>
                  {Array.from({length: 24}).map((_, i) => {
                    const angle = (i * 15 - 90) * Math.PI / 180
                    return (
                      <line
                        key={i}
                        x1={450 + 12 * Math.cos(angle)}
                        y1={300 + 12 * Math.sin(angle)}
                        x2={450 + 78 * Math.cos(angle)}
                        y2={300 + 78 * Math.sin(angle)}
                        stroke="#000088"
                        strokeWidth="5"
                      />
                    )
                  })}
                  <circle cx="450" cy="300" r="12" fill="#000088"/>
                </svg>
                India
              </span>{' '}
              crafting products people{' '}
              <span className={cn('font-semibold', dark ? 'text-slate-200' : 'text-slate-700')}>
                love to use
              </span>{' '}
              and don't forget.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start"
            >
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className={cn(
                  'group flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] sm:text-[14px] font-medium transition-all duration-200',
                  dark
                    ? 'bg-slate-100 text-slate-900 hover:bg-white shadow-[0_4px_20px_rgba(99,102,241,0.22)]'
                    : 'bg-slate-900 text-white hover:bg-slate-700 shadow-[0_4px_16px_rgba(15,15,20,0.16)]'
                )}
              >
                View Works
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </button>

              <a
                href="/Vishal_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] sm:text-[14px] font-medium border transition-all duration-200',
                  dark
                    ? 'border-white/[0.13] text-slate-300 hover:bg-white/[0.05] hover:border-white/25'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                )}
              >
                Resume
                <svg
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                </svg>
              </a>
            </motion.div>

            {/* Social row */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={cn(
                'mt-8 flex items-center justify-center gap-2.5 border-t pt-6 sm:justify-start',
                dark ? 'border-white/[0.07]' : 'border-slate-200/70',
                'self-stretch'
              )}
              aria-label="Social links"
            >
              <LayoutGroup>
                {socials.map(({ label, href, icon }) => (
                  <motion.a
                    layout
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    transition={{ layout: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
                    className={cn(
                      'flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-colors duration-200',
                      dark
                        ? 'border-white/[0.09] bg-white/[0.03] text-slate-500 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.07]'
                        : 'border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300'
                    )}
                  >
                    {icon}
                  </motion.a>
                ))}
                <CopyEmailButton dark={dark} />
              </LayoutGroup>
            </motion.div>

          </div>
        </div>
      </Container>
    </section>
  )
}