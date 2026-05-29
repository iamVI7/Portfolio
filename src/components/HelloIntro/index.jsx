import { useState, useEffect, useRef } from 'react'

const hellos = [
  { text: 'Hello'   },
  { text: 'السلام'  },
  { text: 'Hola'    },
  { text: 'Bonjour' },
  { text: 'नमस्ते'  },
]

export function HelloIntro({ onDone }) {
  const [phase, setPhase]     = useState('hidden')
  const [current, setCurrent] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const doneRef  = useRef(false)
  const indexRef = useRef(0)

  const skip = () => {
    if (doneRef.current) return
    doneRef.current = true
    setLeaving(true)
    setTimeout(onDone, 900)
  }

  useEffect(() => {
    const t = setTimeout(() => setPhase('entering'), 40)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'entering') return

    const isLast = indexRef.current >= hellos.length - 1

    if (isLast) {
      const t = setTimeout(() => {
        setPhase('visible')
        const hold = setTimeout(() => {
          if (doneRef.current) return
          doneRef.current = true
          setLeaving(true)
          setTimeout(onDone, 900)
        }, 1500)
        return () => clearTimeout(hold)
      }, 60)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setPhase('visible')

      const off = setTimeout(() => {
        if (doneRef.current) return
        setPhase('hidden')

        const next = setTimeout(() => {
          indexRef.current += 1
          setCurrent(indexRef.current)
          setPhase('entering')
        }, 60)

        return () => clearTimeout(next)
      }, 200)

      return () => clearTimeout(off)
    }, 40)

    return () => clearTimeout(t)
  }, [phase, current])

  const isLast   = current === hellos.length - 1
  const isIndigo = current % 2 !== 0

  const animStyle = (() => {
    if (phase === 'hidden')   return {
      opacity: 0,
      transform: 'translateX(-50%) translateY(-50%) scale(1.15)',
    }
    if (phase === 'entering') return {
      opacity: 0,
      transform: 'translateX(-50%) translateY(-50%) scale(1.15)',
    }
    if (phase === 'visible')  return {
      opacity: 1,
      transform: 'translateX(-50%) translateY(-50%) scale(1)',
      transition: isLast
        ? 'opacity 0.15s ease-out, transform 0.22s cubic-bezier(0.16,1,0.3,1)'
        : 'opacity 0.06s ease-out, transform 0.09s cubic-bezier(0.16,1,0.3,1)',
      ...(isLast ? { textShadow: '0 0 80px rgba(79,82,160,0.25)' } : {}),
    }
  })()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400&display=swap');

        @keyframes overlayOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes skipFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        .intro-skip {
          position: fixed;
          bottom: 2.2rem;
          right: 2.4rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.67rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          color: rgba(99, 102, 180, 0.4);
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          white-space: nowrap;
          animation: skipFadeIn 0.5s 0.8s cubic-bezier(0.16,1,0.3,1) both;
          transition: color 0.25s;
          text-transform: lowercase;
        }
        .intro-skip:hover {
          color: rgba(99, 102, 180, 0.9);
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4f2ee',
          ...(leaving ? { animation: 'overlayOut 0.9s cubic-bezier(0.4,0,0.2,1) forwards' } : {}),
        }}
      >
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.018, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        <div style={{ position: 'relative', width: 420, height: 70, marginBottom: '6vh' }}>
          <span
            key={current}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: isLast
                ? 'clamp(2.2rem, 7vw, 4.2rem)'
                : 'clamp(1.7rem, 5.5vw, 3.4rem)',
              fontWeight: 400,
              color: isIndigo ? '#4f52a0' : '#1a1916',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              opacity: 0,
              ...animStyle,
            }}
          >
            {hellos[current].text}
          </span>
        </div>

        <button className="intro-skip" onClick={skip}>
          skip
        </button>
      </div>
    </>
  )
}