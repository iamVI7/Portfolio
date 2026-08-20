import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { announceModalOpen } from '../../../utils/modalBus'

const ease = [0.16, 1, 0.3, 1]

export function Lightbox({ cert, onClose }) {
  useEffect(() => {
    announceModalOpen(!!cert)
    return () => announceModalOpen(false)
  }, [cert])

  useEffect(() => {
    if (cert) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [cert])

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(10,10,20,0.82)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease }}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image — taller aspect ratio */}
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.name}
                className="w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300 dark:text-slate-600">
                  No Preview Available
                </span>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 bg-white dark:bg-slate-900">
              <div>
                <p className="font-sans font-semibold text-[14px] text-slate-900 dark:text-slate-100">
                  {cert.name}
                </p>
                <p className="text-[11px] font-mono text-indigo-500 dark:text-indigo-400 mt-0.5 tracking-wide">
                  {cert.issuer} · {cert.date}
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}