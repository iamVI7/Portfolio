import { useRef } from 'react'
import { Container } from '../../ui/Container'

const ITEMS = [
  { label: 'Cooking' },
  { label: 'Exercise' },
  { label: 'Music' },
  { label: 'Gaming' },
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
        className="font-serif italic font-light tracking-tight text-slate-500 dark:text-slate-400"
        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
      >
        {label}
      </span>
      <span
        className="text-slate-300 dark:text-slate-600"
        style={{
          fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)',
          margin: '0 clamp(20px, 3.5vw, 40px)',
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
      className="relative overflow-hidden py-16 sm:py-20 flex flex-col gap-8"
    >
      <Container size="lg">
        {/* Quote — bridges from work into what's beyond it */}
        <div className="mb-14 sm:mb-16 flex items-center gap-6 sm:gap-10">
          <div className="flex-1 border-t border-dashed border-slate-300/80 dark:border-white/[0.2]" />
          <p className="shrink-0 font-serif text-[18px] sm:text-[24px] md:text-[28px] font-normal leading-snug tracking-tight text-center text-slate-800 dark:text-slate-200 max-w-[28ch]">
            The keyboard builds my <em className="italic text-indigo-400">work</em>.
            <br />
            Everything else builds <em className="italic text-indigo-400">me</em>.
          </p>
          <div className="flex-1 border-t border-dashed border-slate-300/80 dark:border-white/[0.2]" />
        </div>

        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">
          Beyond the keyboard
        </p>

        <h2
          id="beyond-heading"
          className="font-serif text-[38px] sm:text-[50px] font-normal leading-[1.05] tracking-tight text-slate-900 dark:text-slate-100"
        >
          What keeps me <em className="italic text-slate-500 dark:text-slate-400">human</em>
        </h2>
      </Container>

      {/* Marquee strip */}
      <div
        aria-hidden="true"
        className="relative"
        style={{ overflow: 'hidden' }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f8f7f4] dark:from-[#0a0a0a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f8f7f4] dark:from-[#0a0a0a] to-transparent" />

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            align-items: center;
            width: max-content;
            animation: marquee 50s linear infinite;
          }
        `}</style>

        <div style={{ padding: '0.9rem 0' }}>
          <div className="marquee-track">
            {[...repeated, ...repeated].map((item, i) => (
              <MarqueeItem key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

      <ul className="sr-only">
        {ITEMS.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
    </section>
  )
}