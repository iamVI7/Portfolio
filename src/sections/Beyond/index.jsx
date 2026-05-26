import { useRef } from 'react'
import { Container } from '../../ui/Container'

const ITEMS = [
  { label: 'Cooking' },
  { label: 'Exercise' },
  { label: 'Music' },
  { label: 'Gaming' },
  { label: 'Crafting' },
  { label: 'Drawing' },
  { label: 'Movies' },
  { label: 'Design' },
  { label: 'Public Speaking' },
  { label: 'Sketching' },
]

function MarqueeItem({ label }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap select-none">
      <span
        className="font-serif italic font-light tracking-tight text-white"
        style={{ fontSize: 'clamp(1rem, 1.8vw, 1.6rem)' }}
      >
        {label}
      </span>
      <span
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 'clamp(0.65rem, 1vw, 0.85rem)',
          margin: '0 clamp(18px, 3vw, 36px)',
          lineHeight: 1,
        }}
      >
        ✦
      </span>
    </span>
  )
}

const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

export function Beyond() {
  const ref = useRef(null)

  return (
    <section
      id="beyond"
      aria-labelledby="beyond-heading"
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-24 flex flex-col gap-16"
    >
      <Container size="lg">
        <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">
          Beyond the keyboard
        </p>
        <h2
          id="beyond-heading"
          className="font-serif text-[38px] sm:text-[50px] font-normal leading-[1.05] tracking-tight text-slate-900 dark:text-slate-100"
        >
          What keeps me <em className="italic text-slate-500 dark:text-slate-400">human</em>
        </h2>
      </Container>

      {/* ── Single indigo marquee strip ── */}
      <div
        aria-hidden="true"
        style={{
          transform: 'rotate(-4deg)',
          margin: '0 -12%',
          width: '124%',
          background: '#6366f1',
          overflow: 'hidden',
          boxShadow: '0 12px 28px -4px rgba(99, 102, 241, 0.4)',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            align-items: center;
            width: max-content;
            animation: marquee 80s linear infinite;
          }
        `}</style>

        <div style={{ padding: '1.4rem 0' }}>
          <div className="marquee-track">
            {[...repeated, ...repeated].map((item, i) => (
              <MarqueeItem key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

      <Container size="lg">
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 sm:pt-10">
          <p className="font-serif italic text-[clamp(0.85rem,1.5vw,1.1rem)] text-slate-400 dark:text-slate-600 mb-5">
            A quote I live by
          </p>

          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <span
                className="absolute top-0 -left-6 sm:-left-8 font-serif text-indigo-200 dark:text-indigo-900 select-none"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
                aria-hidden="true"
              >
                "
              </span>
              <p
                className="font-serif font-normal leading-[1.05] tracking-tight text-slate-900 dark:text-slate-100"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)' }}
              >
                <em className="not-italic text-indigo-500 dark:text-indigo-400">Disrupt</em>
                {' '}
                <em className="italic text-slate-900 dark:text-slate-100">with</em>
                {' '}
                <em className="not-italic text-violet-500 dark:text-violet-400">purpose.</em>
              </p>
            </div>
          </div>
        </div>
      </Container>

      <ul className="sr-only">
        {ITEMS.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
    </section>
  )
}