import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { navLinks } from '../../data/nav'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrollY } from '../../hooks/useScrollY'

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

const drawerVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.04, delayChildren: 0.04 },
  },
  exit: {
    opacity: 0, y: -6, scale: 0.98,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1], staggerChildren: 0.02, staggerDirection: -1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: 2, transition: { duration: 0.12, ease: 'easeIn' } },
}

const pillTransition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
const fadeTransition  = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }

export function Navbar() {
  const scrollY = useScrollY()
  const sectionIds = navLinks.map((l) => l.href)
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()

  const scrolled = scrollY > 40
  const pillActive = scrolled || open

  const handleNav = useCallback((href) => {
    scrollToSection(href)
    setOpen(false)
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <nav
          className="mx-auto max-w-[900px] px-4 pt-4 sm:px-8 sm:pt-5 flex items-center justify-between pointer-events-auto"
          aria-label="Main navigation"
        >
          {/* ── Wordmark ── */}
          <motion.button
            onClick={() => handleNav('home')}
            aria-label="Go to home"
            animate={{
              paddingLeft: scrolled ? '14px' : '0px',
              paddingRight: scrolled ? '14px' : '0px',
              paddingTop: scrolled ? '8px' : '0px',
              paddingBottom: scrolled ? '8px' : '0px',
            }}
            transition={pillTransition}
            className={cn(
              'relative font-serif text-[18px] tracking-tight',
              dark ? 'text-slate-100 hover:text-white' : 'text-slate-900 hover:text-slate-600',
            )}
          >
            <motion.span
              aria-hidden="true"
              animate={{ opacity: scrolled ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                'absolute inset-0 rounded-full',
                dark
                  ? 'bg-white/[0.04] border border-white/[0.07] shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
                  : 'bg-white/75 border border-slate-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
              )}
            />
            <span className="relative z-10">
              Vishal<span className={dark ? 'text-slate-400' : 'text-slate-400'}>/</span>
            </span>
          </motion.button>

          {/* ── Right side: one unified pill holding links (desktop), toggle, and hamburger (mobile) ── */}
          <div className="flex items-center">
            <motion.div
              className="relative flex items-center rounded-full"
              animate={pillActive
                ? dark
                  ? {
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      borderColor: 'rgba(255,255,255,0.10)',
                      boxShadow: '0 2px 20px rgba(0,0,0,0.45)',
                      paddingLeft: '6px',
                      paddingRight: '6px',
                    }
                  : {
                      backgroundColor: 'rgba(255,255,255,0.90)',
                      borderColor: 'rgba(148,163,184,0.5)',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                      paddingLeft: '6px',
                      paddingRight: '6px',
                    }
                : {
                    backgroundColor: 'rgba(255,255,255,0)',
                    borderColor: 'rgba(255,255,255,0)',
                    boxShadow: '0 0px 0px rgba(0,0,0,0)',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }
              }
              transition={pillTransition}
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
              }}
            >
              {/* ══ DESKTOP: inline nav links (hidden on mobile) ══ */}
              <div className="hidden md:flex items-center">
                {navLinks.map(({ label, href }) => {
                  const isActive = active === href
                  return (
                    <button
                      key={href}
                      onClick={() => handleNav(href)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'px-4 py-2 rounded-full text-[14px] tracking-tight transition-colors duration-200',
                        isActive
                          ? dark
                            ? 'text-white/80 font-medium'
                            : 'text-slate-700 font-medium'
                          : dark
                            ? 'text-slate-300 font-normal hover:text-white'
                            : 'text-slate-500 font-normal hover:text-slate-900'
                      )}
                    >
                      {label}
                    </button>
                  )
                })}

                {/* Divider between links and toggle */}
                <motion.span
                  aria-hidden="true"
                  animate={{ opacity: scrolled ? 1 : 0, scaleY: scrolled ? 1 : 0.5 }}
                  transition={fadeTransition}
                  className={cn(
                    'h-4 w-px shrink-0 origin-center mx-2',
                    dark ? 'bg-white/[0.15]' : 'bg-slate-200'
                  )}
                />
              </div>

              {/* Dark mode toggle */}
              <motion.button
                onClick={toggle}
                whileTap={{ scale: 0.88 }}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                className={cn(
                  'relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200',
                  dark ? 'text-slate-300 hover:text-yellow-300' : 'text-slate-500 hover:text-indigo-600',
                )}
              >
                <AnimatePresence initial={false}>
                  {dark ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ position: 'absolute' }}
                    >
                      <SunIcon />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 30, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -30, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ position: 'absolute' }}
                    >
                      <MoonIcon />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Divider — only shown on mobile */}
              <motion.span
                aria-hidden="true"
                animate={{ opacity: pillActive ? 1 : 0, scaleY: pillActive ? 1 : 0.5 }}
                transition={fadeTransition}
                className={cn(
                  'h-4 w-px shrink-0 origin-center md:hidden',
                  dark ? 'bg-white/[0.15]' : 'bg-slate-200'
                )}
              />

              {/* ══ Hamburger — mobile only ══ */}
              <div className="relative md:hidden">
                <button
                  onClick={() => setOpen((o) => !o)}
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                  aria-controls="nav-drawer"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200',
                    open
                      ? dark ? 'text-white' : 'text-slate-800'
                      : dark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                      <motion.svg
                        key="close"
                        initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="open"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                        width="17" height="11" viewBox="0 0 17 11" fill="none"
                        aria-hidden="true"
                      >
                        <line x1="0" y1="1"   x2="17" y2="1"   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        <line x1="0" y1="10"  x2="17" y2="10"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </button>

                {/* ── Mobile dropdown menu ── */}
                <AnimatePresence>
                  {open && (
                    <>
                      <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setOpen(false)}
                      />

                      <motion.div
                        id="nav-drawer"
                        key="drawer"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-label="Navigation menu"
                        style={{
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                        }}
                        className={cn(
                          'absolute right-0 top-[calc(100%+12px)]',
                          'w-[calc(100vw-2rem)] max-w-[240px] sm:w-[240px]',
                          'rounded-2xl overflow-hidden',
                          dark
                            ? 'bg-[#0d0d1a] border border-white/[0.10] shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                            : 'bg-white/95 border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.12)]'
                        )}
                      >
                        <nav className="py-4 px-3" aria-label="Page links">
                          {navLinks.map(({ label, href }, i) => {
                            const isActive = active === href
                            return (
                              <motion.button
                                key={href}
                                variants={itemVariants}
                                onClick={() => handleNav(href)}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                  'group flex w-full items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-colors duration-150',
                                  isActive
                                    ? dark
                                      ? 'bg-white/[0.06] text-white/75'
                                      : 'bg-slate-100/70 text-slate-700'
                                    : dark
                                      ? 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                )}
                              >
                                <span className={cn(
                                  'font-mono text-[11px] tabular-nums shrink-0 leading-none w-4 text-right',
                                  isActive
                                    ? dark ? 'text-slate-400' : 'text-slate-400'
                                    : dark ? 'text-slate-500' : 'text-slate-400'
                                )}>
                                  {String(i + 1).padStart(2, '0')}
                                </span>

                                <span className={cn(
                                  'h-3.5 w-px shrink-0',
                                  dark ? 'bg-white/[0.12]' : 'bg-slate-200'
                                )} aria-hidden="true" />

                                <span className={cn(
                                  'text-[17px] tracking-tight leading-none',
                                  isActive ? 'font-medium' : 'font-normal'
                                )}>
                                  {label}
                                </span>
                              </motion.button>
                            )
                          })}
                        </nav>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </nav>
      </header>
    </>
  )
}