import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { announceModalOpen } from '../../../utils/modalBus'
import { useResponsiveSpring } from '../../../utils/motionSprings'

export function Lightbox({ cert, onClose }) {
  // Tracks whether the *current* cert's image has finished decoding, so we
  // can crossfade it in instead of letting it pop in abruptly once it's
  // ready — that abrupt pop is what read as a "heavy" render.
  const [loaded, setLoaded] = useState(false)
  // Same responsive tween used across the site's other popups (contact
  // modal, game panel, music widget), so this one opens/closes with the
  // same weight instead of its own slightly different timing.
  const panelSpring = useResponsiveSpring()

  useEffect(() => {
    announceModalOpen(!!cert)
    return () => announceModalOpen(false)
  }, [cert])

  useEffect(() => {
    if (cert) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [cert])

  // Reset the fade-in whenever a different cert is opened, and cover the
  // case where the browser already has the image cached (from the
  // thumbnail, or the hover-preload in CertTile) — onLoad won't fire again
  // for an already-complete image, so check `.complete` directly too.
  useEffect(() => {
    setLoaded(false)
  }, [cert?.image])

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(10,10,20,0.82)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={panelSpring}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Image — reserves its real aspect ratio up front (from
                cert.width/height) so nothing crops or jumps once it loads;
                falls back to 4:3 only if a cert has no known dimensions. */}
            {cert.image ? (
              <div
                className="relative w-full bg-slate-100 dark:bg-slate-800"
                style={{ aspectRatio: cert.width && cert.height ? `${cert.width} / ${cert.height}` : '4 / 3' }}
              >
                {/* Skeleton pulse behind the image so there's never a blank
                    panel while a slower connection is still fetching it. */}
                <div
                  className={`absolute inset-0 bg-slate-200 dark:bg-slate-700 transition-opacity duration-300 ${
                    loaded ? 'opacity-0' : 'opacity-100 animate-pulse'
                  }`}
                  aria-hidden="true"
                />
                <img
                  src={cert.image}
                  alt={cert.name}
                  width={cert.width}
                  height={cert.height}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onLoad={(e) => { if (e.currentTarget.complete) setLoaded(true) }}
                  ref={(node) => { if (node?.complete) setLoaded(true) }}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
                    loaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  draggable={false}
                />
              </div>
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