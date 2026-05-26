import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '../../ui/Container'
import { skills } from '../../data/skills'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

function PillChip({ name, Icon }) {
  return (
    <span className="flex items-center gap-2 shrink-0 select-none cursor-default px-5 py-2.5 rounded-full bg-indigo-600 text-white">
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="font-bold text-[14px] tracking-tight whitespace-nowrap leading-none">{name}</span>
    </span>
  )
}

function WordChip({ name, Icon, color }) {
  return (
    <span className="flex items-center gap-2.5 shrink-0 select-none cursor-default text-slate-700 dark:text-slate-300">
      {Icon && <Icon className="h-6 w-6 shrink-0" style={{ color }} />}
      <span className="font-bold text-[17px] tracking-tight whitespace-nowrap leading-none">{name}</span>
    </span>
  )
}

function Dot() {
  return <span className="shrink-0 text-slate-300 dark:text-slate-600 font-bold text-xl leading-none select-none px-2">·</span>
}

function SkillSet({ items }) {
  return (
    <div className="flex items-center shrink-0">
      {items.map((s) => (
        <div key={s.name} className="flex items-center gap-4 shrink-0">
          {s.pill
            ? <PillChip name={s.name} Icon={s.Icon} />
            : <WordChip name={s.name} Icon={s.Icon} color={s.color} />
          }
          <Dot />
        </div>
      ))}
    </div>
  )
}

function SkillsMarquee() {
  const raw1 = skills.filter((_, i) => i % 2 === 0)
  const raw2 = skills.filter((_, i) => i % 2 === 1)

  const tag = (arr) => arr.map((s, i) => ({ ...s, pill: i === 1 || i === 4 }))
  const row1 = tag(raw1)
  const row2 = tag(raw2)

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent" />

      <div className="flex items-center overflow-hidden border-b border-slate-100 dark:border-white/[0.04] py-5">
        <div className="flex items-center animate-go-left shrink-0"><SkillSet items={row1} /></div>
        <div className="flex items-center animate-go-left shrink-0" aria-hidden><SkillSet items={row1} /></div>
        <div className="flex items-center animate-go-left shrink-0" aria-hidden><SkillSet items={row1} /></div>
      </div>

      <div className="flex items-center overflow-hidden py-5">
        <div className="flex items-center animate-go-right shrink-0"><SkillSet items={row2} /></div>
        <div className="flex items-center animate-go-right shrink-0" aria-hidden><SkillSet items={row2} /></div>
        <div className="flex items-center animate-go-right shrink-0" aria-hidden><SkillSet items={row2} /></div>
      </div>

      <style>{`
        @keyframes go-left  { from { transform: translateX(0); }     to { transform: translateX(-100%); } }
        @keyframes go-right { from { transform: translateX(-100%); } to { transform: translateX(0); }    }
        .animate-go-left  { animation: go-left  32s linear infinite; }
        .animate-go-right { animation: go-right 32s linear infinite; }
      `}</style>
    </div>
  )
}

export function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const quoteRef = useRef(null)
  const quoteInView = useInView(quoteRef, { once: true, margin: '-40px' })

  return (
    <section id="about" className="py-14 sm:py-20 overflow-hidden" aria-labelledby="about-heading">
      <Container size="lg">

        <motion.div ref={ref} custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mb-14">
          <div className="mb-4">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">About</span>
          </div>
          <h2 id="about-heading" className="font-serif text-[40px] sm:text-[50px] font-normal leading-[1.06] tracking-tight text-slate-900 dark:text-slate-100">
            A little about <em className="italic text-slate-500 dark:text-slate-400">me</em>
          </h2>
        </motion.div>

        {/* Bio card — three paragraphs, aspiration as the third */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="rounded-2xl border border-slate-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.025] p-7 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-2">
          <p className="text-[15.5px] leading-[2] text-slate-600 dark:text-slate-300">
            I am a B.Tech Computer Science &amp; Engineering graduate, beginning my journey of exploring purpose and
            destiny with a deep interest in{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">defence and development</span>.
            Guided by the principle of{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">Nation First</span>,
            I strive to use technology to serve people, reduce friction, and create meaningful impact.
          </p>
          <p className="mt-5 text-[15px] leading-[2] text-slate-500 dark:text-slate-400">
            Always eager to help others and ready for challenges, I aim to build solutions that embody{' '}
            <em className="not-italic font-medium text-slate-700 dark:text-slate-300">clarity, care, and responsibility</em>.
          </p>
          <p className="mt-5 text-[15px] leading-[2] text-slate-500 dark:text-slate-400">
            My deepest aspiration is to put my skills in service of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">Defence forces</span>{' '}
            — {' '}
          Not as a spectator, but as someone
            who shows up through code, systems, and unwavering{' '}
            <span className="font-medium text-indigo-500 dark:text-indigo-400">commitment to the nation</span>.
          </p>
        </motion.div>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="px-1 pt-10">
          <span className="font-serif text-[18px] sm:text-[20px] font-normal tracking-tight text-slate-500 dark:text-slate-400">
            Technologies I'm familiar with
          </span>
        </motion.div>

      </Container>

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mt-4 w-full">
        <SkillsMarquee />
      </motion.div>

      {/* Quote */}
      <motion.div
        ref={quoteRef}
        initial={{ opacity: 0, y: 20 }}
        animate={quoteInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 sm:mt-20 w-full flex items-center py-10 sm:py-14"
      >
        <div className="flex-1 border-t border-dashed border-slate-300/80 dark:border-white/[0.2]" />
        <p className="shrink-0 px-8 sm:px-12 font-serif text-[20px] sm:text-[27px] md:text-[32px] font-normal leading-snug tracking-tight text-center text-slate-800 dark:text-slate-200 max-w-[28ch]">
          Where others see <em className="italic">friction</em>, I create{' '}
          <em className="italic text-indigo-400">ease</em> and{' '}
          <em className="italic text-indigo-400">empathy</em>.
        </p>
        <div className="flex-1 border-t border-dashed border-slate-300/80 dark:border-white/[0.2]" />
      </motion.div>

    </section>
  )
}