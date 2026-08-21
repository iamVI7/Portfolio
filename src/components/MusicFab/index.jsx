import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, Play } from 'lucide-react'
import { cn } from '../../utils/cn'
import { subscribeModalVisibility } from '../../utils/modalBus'
import { announceMusicOpen } from '../../utils/musicBus'
import { subscribeGameVisibility } from '../../utils/gameBus'
import { NOW_PLAYING } from '../../data/music'

// How long the pill stays up after tapping pause before it shrinks back
// down — long enough to register the icon change, short enough to stay
// out of the way.
const COLLAPSE_DELAY = 380

// Small animated equalizer — stands in for the static icon whenever music
// is actually playing, in both the expanded play button and the collapsed
// circle, so "currently playing" always reads the same way. Uses
// `currentColor` so it inherits whichever text color its parent button has.
function Wave() {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-current"
          style={{ height: '100%', transformOrigin: 'bottom' }}
          animate={{ scaleY: [0.35, 1, 0.35] }}
          transition={{
            duration: 0.9 + i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}
    </span>
  )
}

/**
 * MusicFab
 * Sits in the same bottom dock as TicTacToeFab, rightmost. Collapsed, it's
 * a plain circle. Tap it and it grows into a "currently vibing to" pill
 * (one box animated via the `layout` prop, so it morphs rather than swaps)
 * — nothing plays yet. Tap the play button and the track starts; the same
 * animated wave then shows in both the expanded play button and the
 * collapsed circle, so "currently playing" reads consistently either way.
 * Tap play/pause again to pause (which also collapses the pill), or tap
 * outside the pill to collapse it without stopping playback.
 * Broadcasts on musicBus while expanded so TicTacToeFab can shrink its own
 * pill down to a circle and make room.
 */
export function MusicFab() {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [suppressed, setSuppressed] = useState(false)
  const audioRef = useRef(null)
  const containerRef = useRef(null)
  const collapseTimer = useRef(null)

  // Hide alongside other big overlays (lightbox, contact modal) — same
  // pattern TicTacToeFab already uses.
  useEffect(() => subscribeModalVisibility(setSuppressed), [])

  useEffect(() => {
    if (suppressed) {
      setOpen(false)
      audioRef.current?.pause()
      setPlaying(false)
    }
  }, [suppressed])

  // Let the tic-tac-toe pill know to collapse while this is expanded.
  useEffect(() => {
    announceMusicOpen(open)
  }, [open])

  // Collapse back to a circle when the game panel opens — playback keeps
  // going, only the pill closes, mirroring what this widget does to the
  // tic-tac-toe pill.
  useEffect(() => subscribeGameVisibility((gameOpen) => {
    if (gameOpen) setOpen(false)
  }), [])

  // Collapse on outside click — playback keeps going, only the pill closes.
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  useEffect(() => () => clearTimeout(collapseTimer.current), [])

  // Tapping the collapsed circle only reveals the pill — playback starts
  // solely from the play button inside it.
  const handleExpand = () => setOpen(true)

  const togglePlayback = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      // Pause: stop, then let the pill shrink itself back to a circle.
      audio.pause()
      setPlaying(false)
      clearTimeout(collapseTimer.current)
      collapseTimer.current = setTimeout(() => setOpen(false), COLLAPSE_DELAY)
    } else {
      // Play: start and stay open, showing the wave.
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  if (suppressed) return null

  return (
    <>
      <audio ref={audioRef} src={NOW_PLAYING.src} loop preload="none" />

      <motion.div
        ref={containerRef}
        layout
        transition={{ type: 'spring', stiffness: 230, damping: 30, mass: 0.9 }}
        className={cn(
          'relative flex shrink-0 items-center overflow-hidden rounded-full',
          open
            ? 'h-14 gap-3 pl-1.5 pr-4 bg-white dark:bg-[#14141f] border border-indigo-100/70 dark:border-white/10 shadow-card dark:shadow-card-dark'
            : 'h-12 w-12 justify-center bg-white/85 dark:bg-white/[0.07] backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-nav sm:shadow-pill sm:bg-indigo-50/70 sm:dark:bg-indigo-500/10 sm:border-indigo-200 sm:dark:border-indigo-500/30'
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!open ? (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExpand}
              aria-label="Show what's playing"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {playing ? (
                  <motion.span
                    key="wave-collapsed"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex"
                  >
                    <Wave />
                  </motion.span>
                ) : (
                  <motion.span
                    key="icon-collapsed"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex"
                  >
                    <Music2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, delay: 0.1, ease: 'easeInOut' }}
              className="flex items-center gap-3"
            >
              <button
                onClick={togglePlayback}
                aria-label={playing ? 'Pause' : 'Play'}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-950 dark:bg-white text-white dark:text-indigo-950"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {playing ? (
                    <motion.span
                      key="wave"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="flex"
                    >
                      <Wave />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="play"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="flex pl-0.5"
                    >
                      <Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="flex flex-col leading-tight pr-2">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Currently vibing to
                </span>
                {NOW_PLAYING.url ? (
                  <a
                    href={NOW_PLAYING.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 whitespace-nowrap"
                  >
                    {NOW_PLAYING.artist} – {NOW_PLAYING.title}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                    {NOW_PLAYING.artist} – {NOW_PLAYING.title}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}