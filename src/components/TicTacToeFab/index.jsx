import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, X, RotateCcw, Sun, Moon } from 'lucide-react'
import { cn } from '../../utils/cn'
import { subscribeModalVisibility } from '../../utils/modalBus'
import { subscribeMusicVisibility } from '../../utils/musicBus'
import { announceGameOpen } from '../../utils/gameBus'
import { useTheme } from '../../context/ThemeContext'
import { MusicFab } from '../MusicFab'

/**
 * TicTacToeFab
 * A persistent bottom-right floating trigger. Tapping it pops open an
 * unbeatable tic-tac-toe game (minimax) in a floating panel — a small,
 * self-contained proof of "this person builds interactive things," not
 * just static pages.
 *
 * Mounted once in RootLayout so it floats above every section.
 */

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] }
    }
  }
  if (board.every(Boolean)) return { player: 'draw', line: [] }
  return null
}

// Minimax with alpha-beta pruning. AI is "O" and always plays second, so it
// never loses — the best a visitor can do is force a draw.
function minimax(board, isMaximizing, depth, alpha, beta) {
  const result = getWinner(board)
  if (result) {
    if (result.player === 'O') return 10 - depth
    if (result.player === 'X') return depth - 10
    return 0
  }

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue
      board[i] = 'O'
      best = Math.max(best, minimax(board, false, depth + 1, alpha, beta))
      board[i] = null
      alpha = Math.max(alpha, best)
      if (beta <= alpha) break
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue
      board[i] = 'X'
      best = Math.min(best, minimax(board, true, depth + 1, alpha, beta))
      board[i] = null
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }
}

function bestMove(board) {
  let move = -1
  let bestScore = -Infinity
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue
    board[i] = 'O'
    const score = minimax(board, false, 0, -Infinity, Infinity)
    board[i] = null
    if (score > bestScore) {
      bestScore = score
      move = i
    }
  }
  return move
}

const EMPTY_BOARD = Array(9).fill(null)

export function TicTacToeFab() {
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [thinking, setThinking] = useState(false)
  const [record, setRecord] = useState({ wins: 0, losses: 0, draws: 0 })
  const [hasOpened, setHasOpened] = useState(false)
  const [suppressed, setSuppressed] = useState(false) // true while another modal/popup is open
  const [compact, setCompact] = useState(false) // true while the music widget is expanded
  const panelRef = useRef(null)

  // Hide entirely whenever something else (certificate lightbox, contact
  // success modal, etc.) has the user's attention — two overlapping popups
  // reads as cluttered rather than playful.
  useEffect(() => subscribeModalVisibility(setSuppressed), [])

  // Shrink down to a plain circle whenever the music widget expands, so the
  // two don't compete for space in the bottom dock.
  useEffect(() => subscribeMusicVisibility(setCompact), [])

  // Let the music widget know when the game panel is open, so it collapses
  // back to a circle instead of the two competing for attention.
  useEffect(() => {
    announceGameOpen(open)
  }, [open])

  useEffect(() => {
    if (suppressed) setOpen(false)
  }, [suppressed])

  // Lock background scroll while the game panel is open (matches ContactModal).
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const result = useMemo(() => getWinner(board), [board])

  const handleOpen = () => {
    setOpen(true)
    setHasOpened(true)
  }

  const handleCellClick = useCallback(
    (i) => {
      if (board[i] || result || thinking) return

      const next = [...board]
      next[i] = 'X'
      setBoard(next)

      const afterHuman = getWinner(next)
      if (afterHuman) {
        if (afterHuman.player === 'X') setRecord((r) => ({ ...r, wins: r.wins + 1 }))
        else if (afterHuman.player === 'draw') setRecord((r) => ({ ...r, draws: r.draws + 1 }))
        return
      }

      setThinking(true)
      setTimeout(() => {
        const move = bestMove(next)
        const withAI = [...next]
        if (move !== -1) withAI[move] = 'O'
        setBoard(withAI)
        setThinking(false)

        const afterAI = getWinner(withAI)
        if (afterAI) {
          if (afterAI.player === 'O') setRecord((r) => ({ ...r, losses: r.losses + 1 }))
          else if (afterAI.player === 'draw') setRecord((r) => ({ ...r, draws: r.draws + 1 }))
        }
      }, 400)
    },
    [board, result, thinking]
  )

  const reset = () => setBoard(EMPTY_BOARD)

  // Tooltip opens as a "thinking" typing indicator, then resolves into the
  // actual line — reads like a thought forming rather than a static label.
  const [tooltipPhase, setTooltipPhase] = useState('thinking')
  useEffect(() => {
    if (hasOpened) return
    const t = setTimeout(() => setTooltipPhase('text'), 850)
    return () => clearTimeout(t)
  }, [hasOpened])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // A few lines per outcome so it reads like a real person typing, not a
  // static status label — picked once per outcome, not re-rolled on rerender.
  const THINKING_LINES = ['Thinking…', 'Give me a sec…', 'Plotting…', 'Hmm, let me see…']
  const WIN_LINES = [
    "Vishal wins. I've had practice. 😌",
    'Vishal wins — try again? 🙂',
    "Vishal wins. I'm undefeated, not sorry. 😏",
  ]
  const LOSS_LINES = [
    'You beat Vishal. Screenshot this. 🏆',
    'You won. Okay, that actually stung. 😅',
    "You beat Vishal — didn't see that coming. 🎉",
  ]
  const DRAW_LINES = [
    "Draw. We're evenly matched, apparently. 🤝",
    'Draw — nobody panic. 😄',
    'Draw. A respectable stalemate. 🤔',
  ]

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const [statusText, setStatusText] = useState('Your move')
  useEffect(() => {
    if (thinking) {
      setStatusText(pick(THINKING_LINES))
    } else if (result?.player === 'draw') {
      setStatusText(pick(DRAW_LINES))
    } else if (result?.player === 'X') {
      setStatusText(pick(LOSS_LINES))
    } else if (result?.player === 'O') {
      setStatusText(pick(WIN_LINES))
    } else {
      setStatusText('Your move')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thinking, result?.player])

  if (suppressed) return null

  return (
    <>
      {/* Floating trigger — wide navbar-style pill on mobile, corner icon on desktop */}
      <div className="fixed z-[70] bottom-5 inset-x-0 justify-center sm:inset-x-auto sm:justify-start sm:left-auto sm:right-8 sm:bottom-8 flex items-center gap-3 sm:flex-row-reverse">
        {/* Dark mode toggle — its own circle, mobile only, sits beside the play pill */}
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={toggle}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="order-1 sm:hidden flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/85 dark:bg-white/[0.07] backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-nav text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-yellow-300 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.span
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="flex"
                  >
                    <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="flex"
                  >
                    <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!open && (
            <motion.button
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={handleOpen}
              aria-label="Play tic-tac-toe against Vishal"
              className={cn(
                'order-2 relative flex h-12 shrink-0 items-center justify-center gap-2 rounded-full transition-colors',
                compact ? 'w-12 px-0' : 'px-6 sm:w-12 sm:h-12 sm:px-0',
                'bg-white/85 dark:bg-white/[0.07] backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-nav sm:shadow-pill sm:bg-indigo-50/70 sm:dark:bg-indigo-500/10 sm:border-indigo-200 sm:dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
              )}
            >
              {!hasOpened && !compact && (
                <span className="absolute inset-0 rounded-full border border-indigo-400/50 animate-pulse-slow" />
              )}
              <Gamepad2 className="relative h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              <AnimatePresence initial={false}>
                {!compact && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="relative overflow-hidden whitespace-nowrap text-xs font-semibold tracking-tight leading-none sm:hidden"
                  >
                    Play me. I dare you.
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Music widget — kept rightmost via `order` since it needs to stay
            at the dock's outer edge in both normal (mobile) and
            flex-row-reverse (desktop) layouts. */}
        <div className="order-3 sm:order-1">
          <MusicFab />
        </div>

        {/* Tooltip, desktop only — mobile pill already shows the label inline */}
        {!open && !hasOpened && !compact && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="pointer-events-none hidden sm:flex h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-white dark:bg-white/10 text-indigo-950 dark:text-slate-100 shadow-pill border border-indigo-100 dark:border-white/10 px-4"
          >
            <AnimatePresence mode="wait">
              {tooltipPhase === 'thinking' ? (
                <motion.span
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.span>
              ) : (
                <motion.span
                  key="text"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[13px] font-semibold tracking-tight leading-none"
                >
                  Play me. I dare you.
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
        )}
      </div>

      {/* Backdrop — mobile only, gives the panel a proper bottom-sheet feel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-[69] bg-slate-900/40 backdrop-blur-[2px] sm:hidden"
          />
        )}
      </AnimatePresence>

      {/* Game panel — floating card on desktop, bottom sheet on mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Tic-tac-toe against Vishal"
            className={cn(
              'fixed z-[70]',
              'inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-8 sm:right-8',
              'w-full sm:w-[340px]',
              'rounded-t-[28px] rounded-b-none sm:rounded-[28px]',
              'border border-b-0 sm:border-b bg-white dark:bg-[#0f0f1a] border-indigo-100/70 dark:border-white/10',
              'shadow-card dark:shadow-card-dark p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-6'
            )}
          >
            {/* Drag handle — mobile bottom-sheet affordance, hidden on desktop */}
            <div className="sm:hidden mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 dark:bg-white/15" />

            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-indigo-500 font-semibold">
                  vs Vishal
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  You're X. Undefeated so far.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close game"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {board.map((cell, i) => {
                const isWinningCell = result?.line?.includes(i)
                return (
                  <button
                    key={i}
                    onClick={() => handleCellClick(i)}
                    disabled={!!cell || !!result || thinking}
                    className={cn(
                      'aspect-square flex items-center justify-center text-2xl font-bold rounded-2xl border transition-colors',
                      isWinningCell
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15'
                        : 'border-indigo-100 dark:border-white/10',
                      !cell && !result && !thinking
                        ? 'hover:border-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-white/5 cursor-pointer'
                        : ''
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {cell && (
                        <motion.span
                          key={cell + i}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.18 }}
                          className={cell === 'X' ? 'text-indigo-950 dark:text-slate-100' : 'text-indigo-500'}
                        >
                          {cell}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusText}
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-slate-500 dark:text-slate-400"
                >
                  {statusText}
                </motion.p>
              </AnimatePresence>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              {record.wins}W · {record.losses}L · {record.draws}D
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}