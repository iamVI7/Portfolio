import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Container } from '../../ui/Container'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const TOPICS = ['defence', 'sci-fi', 'tech', 'India', 'astronomy', 'startups', 'space', 'the future']

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.05 } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
}

const topicVariants = {
  enter: { opacity: 0, y: 10, filter: 'blur(4px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
}

function RotatingTopic() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TOPICS.length)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className="relative inline-block"
      style={{ minWidth: '7.5ch' }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="invisible" aria-hidden="true">the future</span>
      <AnimatePresence mode="wait">
        <motion.em
          key={TOPICS[index]}
          variants={topicVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute left-0 top-0 whitespace-nowrap not-italic"
          style={{ color: '#6366f1' }}
        >
          {TOPICS[index]}
        </motion.em>
      </AnimatePresence>
    </span>
  )
}

function ContactModal({ open, onClose, dark }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (formError) setFormError(false)
    if (sendError) setSendError(false)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormError(true)
      return
    }
    setLoading(true)
    setSendError(false)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name: form.name, email: form.email, message: form.message },
        EMAILJS_PUBLIC_KEY
      )
      setSent(true)
    } catch (err) {
      console.error('EmailJS error:', err)
      setSendError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSent(false)
      setSendError(false)
      setForm({ name: '', email: '', message: '' })
      setFormError(false)
    }, 250)
  }

  const inputCls = (field) => cn(
    'w-full rounded-lg border px-4 py-3 text-[14px] outline-none transition-all duration-200',
    'placeholder:text-slate-400 dark:placeholder:text-slate-600',
    'text-slate-900 dark:text-slate-100',
    focused === field
      ? 'border-slate-400 dark:border-white/30 bg-white dark:bg-white/[0.07] ring-3 ring-slate-900/5 dark:ring-white/5'
      : 'border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/20'
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-heading"
          >
            <motion.div
              key="modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'relative w-full max-w-[480px] rounded-2xl shadow-2xl',
                dark
                  ? 'bg-[#111116] border border-white/[0.08]'
                  : 'bg-white border border-slate-200/60'
              )}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-16 px-8 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <div className={cn(
                      'mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl',
                      dark ? 'bg-white/[0.06]' : 'bg-slate-50'
                    )}>
                      ✉️
                    </div>
                    <h3 className="font-serif text-[24px] font-normal text-slate-900 dark:text-slate-100">
                      Message sent!
                    </h3>
                    <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400 max-w-[28ch] leading-relaxed">
                      Thanks for reaching out — I'll reply within 24 hours.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-7 font-mono text-[11px] text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 underline underline-offset-4 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0 }} className="p-7 sm:p-8">
                    <div className="flex items-start justify-between mb-2">
                      <h2
                        id="modal-heading"
                        className="font-serif text-[28px] sm:text-[32px] font-normal italic leading-tight text-slate-900 dark:text-slate-100"
                      >
                        Get in touch
                      </h2>
                      <button
                        onClick={handleClose}
                        aria-label="Close"
                        className={cn(
                          'mt-1 flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                          dark
                            ? 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.08]'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-7">
                      Send me a message and I'll get back to you as soon as possible.
                    </p>

                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="modal-name" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Name</label>
                        <input
                          id="modal-name" name="name" type="text" required autoComplete="name" autoFocus
                          value={form.name} onChange={handleChange}
                          onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                          placeholder="Vishal" className={inputCls('name')}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="modal-email" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input
                          id="modal-email" name="email" type="email" required autoComplete="email"
                          value={form.email} onChange={handleChange}
                          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                          placeholder="vishal@example.com" className={inputCls('email')}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="modal-message" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Message</label>
                        <textarea
                          id="modal-message" name="message" required rows={5}
                          value={form.message} onChange={handleChange}
                          onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                          placeholder="I am all ears..." className={cn(inputCls('message'), 'resize-none')}
                        />
                      </div>

                      <AnimatePresence>
                        {formError && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }} role="alert"
                            className="font-mono text-[11px] text-rose-400 -mt-2"
                          >
                            Please fill in all fields before sending.
                          </motion.p>
                        )}
                        {sendError && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }} role="alert"
                            className="font-mono text-[11px] text-rose-400 -mt-2"
                          >
                            Something went wrong. Please try again.
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <button
                        type="button" disabled={loading} onClick={handleSubmit}
                        className={cn(
                          'flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3',
                          'text-[14px] font-medium transition-all duration-200 disabled:opacity-60',
                          'bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
                          'shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
                        )}
                      >
                        {loading ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                              className="block h-4 w-4 rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900"
                            />
                            Sending…
                          </>
                        ) : (
                          'Send message'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Contact() {
  const [modalOpen, setModalOpen] = useState(false)
  const { dark } = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="contact"
      className="py-8 sm:py-16"
      aria-labelledby="contact-heading"
      ref={ref}
    >
      <Container size="lg">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* ── Pill container ── */}
          <motion.div
            variants={fadeUp}
            className={cn(
              'rounded-2xl border border-slate-100 dark:border-white/[0.06]',
              'bg-white dark:bg-white/[0.025]',
              'px-6 py-7 sm:px-10 sm:py-9',
              'shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            )}
          >
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-2.5">
              <span className={cn(
                'font-mono text-[11px] font-medium uppercase tracking-widest',
                dark ? 'text-slate-500' : 'text-slate-400'
              )}>
                Let's connect
              </span>
            </div>

            {/* Two-col: text left, button right */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: heading */}
              <div className="max-w-[44ch] text-center sm:text-left">
                <h2
                  id="contact-heading"
                  className={cn(
                    'font-serif font-normal leading-[1.1] tracking-tight',
                    dark ? 'text-slate-100' : 'text-slate-900'
                  )}
                >
                  <span className="text-[30px] sm:text-[38px]">Got something in mind?</span>
                  <br />
                  <span className="inline-block mt-3 text-[22px] sm:text-[28px] whitespace-nowrap">
                    Let's talk{' '}
                    <span className="inline-flex items-baseline gap-0">
                      <span className={cn(
                        'italic font-normal',
                        dark ? 'text-slate-100' : 'text-slate-900'
                      )}>about </span>
                      <span className="ml-1.5">
                        <RotatingTopic />
                      </span>
                    </span>
                  </span>
                </h2>
              </div>

              {/* Right: CTA */}
              <div className="shrink-0 flex justify-center sm:justify-end">
                <button
                  onClick={() => setModalOpen(true)}
                  className={cn(
                    'group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-all duration-200 whitespace-nowrap',
                    dark
                      ? 'bg-slate-100 text-slate-900 hover:bg-white shadow-[0_4px_20px_rgba(99,102,241,0.15)]'
                      : 'bg-slate-900 text-white hover:bg-black shadow-[0_4px_16px_rgba(15,15,20,0.14)]'
                  )}
                >
                  Get in touch
                  <svg
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dark={dark}
      />
    </section>
  )
}