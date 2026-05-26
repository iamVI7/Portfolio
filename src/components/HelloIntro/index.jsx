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
    setTimeout(onDone, 500)
  }

  useEffect(() => {
    const t = setTimeout(() => setPhase('entering'), 40)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'entering') return

    const t = setTimeout(() => {
      setPhase('visible')

      const hold = setTimeout(() => {
        if (doneRef.current) return

        if (indexRef.current >= hellos.length - 1) {
          setTimeout(() => {
            if (!doneRef.current) {
              doneRef.current = true
              setLeaving(true)
              setTimeout(onDone, 500)
            }
          }, 200)
          return
        }

        setPhase('exiting')
        setTimeout(() => {
          indexRef.current += 1
          setCurrent(indexRef.current)
          setPhase('entering')
        }, 320)
      }, 480)

      return () => clearTimeout(hold)
    }, 400)

    return () => clearTimeout(t)
  }, [phase, current])

  const isIndigo = current % 2 !== 0

  const animStyle = (() => {
    if (phase === 'hidden')   return { opacity: 0, transform: 'translateX(-50%) translateY(10px)' }
    if (phase === 'entering') return { animation: 'wordIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }
    if (phase === 'visible')  return { opacity: 1, transform: 'translateX(-50%) translateY(0)' }
    if (phase === 'exiting')  return { animation: 'wordOut 0.3s cubic-bezier(0.4,0,1,1) forwards' }
  })()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400&display=swap');

        @keyframes wordIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        @keyframes wordOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0);    }
          to   { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        }
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
          ...(leaving ? { animation: 'overlayOut 0.5s cubic-bezier(0.22,1,0.36,1) forwards' } : {}),
        }}
      >
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.018, pointerEvents: 'none' }} aria-hidden="true">
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
              transform: 'translateX(-50%) translateY(-50%)',
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(1.7rem, 5.5vw, 3.4rem)',
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