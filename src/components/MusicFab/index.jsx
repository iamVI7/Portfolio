import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, Play } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useResponsiveSpring } from '../../utils/motionSprings'
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
//
// The bars run on native CSS animation rather than framer-motion's
// `animate` prop. This component gets unmounted/remounted constantly — the
// pill collapsing on outside click, the play/pause icon swap inside
// AnimatePresence — and a JS-driven animation would restart from frame 0
// (or blank out entirely) every single time, which read as the waveform
// "stopping". CSS animation-delay accepts negative values, which start the
// animation mid-cycle instead of from 0%, so as long as we know how long
// the wave has conceptually been running (`startedAt`, a timestamp that
// lives on the parent and survives remounts) each bar can resume exactly
// where it should be, frame-accurate, no matter how many times it's torn
// down and rebuilt.
function Wave({ startedAt }) {
  const elapsed = startedAt != null ? (performance.now() - startedAt) / 1000 : 0

  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((i) => {
        const duration = 0.9 + i * 0.15
        const delayOffset = i * 0.12
        // Phase within this bar's own cycle, folded back into [0, duration).
        const phase = ((elapsed + delayOffset) % duration + duration) % duration
        return (
          <span
            key={i}
            className="wave-bar w-[3px] rounded-full bg-current"
            style={{
              height: '100%',
              transformOrigin: 'bottom',
              animationDuration: `${duration}s`,
              animationDelay: `-${phase}s`,
            }}
          />
        )
      })}
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
  // Shared with TicTacToeFab's play-pill resize, so both widgets move at
  // the same weight — smoother on desktop, original snappier feel on mobile.
  const containerSpring = useResponsiveSpring()
  // Timestamp the wave "started" at, set once on the first successful play
  // and never reset — it's the clock the Wave bars sync their phase to, so
  // remounting them (pill collapse, icon swap) never looks like a restart.
  const waveStartRef = useRef(null)

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
      audio
        .play()
        .then(() => {
          if (waveStartRef.current == null) waveStartRef.current = performance.now()
          setPlaying(true)
        })
        .catch(() => setPlaying(false))
    }
  }

  // Hidden (not unmounted) while another overlay is open — same reasoning
  // as TicTacToeFab's own fix: unmounting made the collapsed-circle button
  // replay its pop-in animation every time a modal closed. `contents`
  // keeps this wrapper box-free (matching the old Fragment exactly, so it
  // can't disturb the absolute/flex positioning the parent dock relies on)
  // while still letting `invisible`/`pointer-events-none` inherit down to
  // the actual button.
  return (
    <div className={cn('contents', suppressed && 'invisible pointer-events-none')}>
      <audio ref={audioRef} src={NOW_PLAYING.src} loop preload="none" />

      <motion.div
        ref={containerRef}
        layout
        transition={containerSpring}
        className={cn(
          'relative flex shrink-0 overflow-hidden',
          open
            ? 'h-14 items-center gap-3 pl-1.5 pr-4 rounded-full sm:h-auto sm:w-[176px] sm:flex-col sm:justify-center sm:gap-2 sm:rounded-3xl sm:py-4 sm:px-3 bg-white dark:bg-[#14141f] border border-indigo-100/70 dark:border-white/10 shadow-card dark:shadow-card-dark'
            : 'h-12 w-12 items-center justify-center rounded-full bg-white/85 dark:bg-white/[0.07] backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-nav sm:shadow-pill sm:bg-indigo-50/70 sm:dark:bg-indigo-500/10 sm:border-indigo-200 sm:dark:border-indigo-500/30'
        )}
      >
        {/* mode="wait" is kept (children aren't absolutely stacked, so
            letting them coexist would crowd each other) — instead the exit
            is quick and the enter has no extra delay, so the handoff reads
            as one continuous motion riding the container's `layout` spring,
            not a fade-out-then-pop-in. */}
        <AnimatePresence mode="wait" initial={false}>
          {!open ? (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.26, ease: 'easeInOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.14, ease: 'easeInOut' } }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={handleExpand}
              aria-label="Show what's playing"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {playing ? (
                  <motion.span
                    key="wave-collapsed"
                    layout
                    layoutId="music-collapsed-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex"
                  >
                    <Wave startedAt={waveStartRef.current} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="icon-collapsed"
                    layout
                    layoutId="music-collapsed-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
              animate={{ opacity: 1, transition: { duration: 0.26, ease: 'easeInOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.14, ease: 'easeInOut' } }}
              className="flex flex-row items-center gap-3 sm:flex-col sm:gap-2"
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
                      layout
                      layoutId="music-expanded-icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="flex"
                    >
                      <Wave startedAt={waveStartRef.current} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="play"
                      layout
                      layoutId="music-expanded-icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="flex pl-0.5"
                    >
                      <Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="flex flex-col leading-tight pr-2 sm:items-center sm:text-center sm:pr-0">
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  Currently vibing to
                </span>
                {NOW_PLAYING.url ? (
                  <a
                    href={NOW_PLAYING.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[15px] font-bold tracking-tight text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 whitespace-nowrap sm:whitespace-normal"
                  >
                    {NOW_PLAYING.artist} – {NOW_PLAYING.title}
                  </a>
                ) : (
                  <span className="text-[15px] font-bold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap sm:whitespace-normal">
                    {NOW_PLAYING.artist} – {NOW_PLAYING.title}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}