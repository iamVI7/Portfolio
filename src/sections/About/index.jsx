import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '../../ui/Container'
import { skills } from '../../data/skills'

import {
  SiPython, SiReact, SiNextdotjs, SiNodedotjs,
  SiGithub, SiTailwindcss, SiMongodb, SiGit, SiVercel,
} from 'react-icons/si'
import { TbApi } from 'react-icons/tb'

const techList = [
  { name: 'React',        Icon: SiReact,       color: '#61DAFB' },
  { name: 'Next.js',      Icon: SiNextdotjs,   color: '#64748b' },
  { name: 'Python',       Icon: SiPython,      color: '#3776AB' },
  { name: 'Node.js',      Icon: SiNodedotjs,   color: '#339933' },
  { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'MongoDB',      Icon: SiMongodb,     color: '#47A248' },
  { name: 'GitHub',       Icon: SiGithub,      color: '#64748b' },
  { name: 'Git',          Icon: SiGit,         color: '#F05032' },
  { name: 'Vercel',       Icon: SiVercel,      color: '#64748b' },
  { name: 'REST API',     Icon: TbApi,         color: '#6366F1' },
]

function TechGrid() {
  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-slate-100">
        Technologies I'm familiar with
      </span>

      <div className="flex flex-wrap gap-2.5">
        {techList.map(({ name, Icon, color }) => (
          <div
            key={name}
            className="
              group flex flex-1 items-center justify-center gap-2 px-3 py-3
              rounded-xl border border-slate-200 dark:border-white/[0.08]
              bg-slate-50 dark:bg-white/[0.03]
              hover:border-slate-300 dark:hover:border-white/[0.15]
              hover:bg-white dark:hover:bg-white/[0.06]
              transition-all duration-200 cursor-default select-none
              min-w-[120px]
            "
          >
            <Icon
              className="h-[18px] w-[18px] shrink-0 transition-all duration-200"
              style={{ color, opacity: 0.75 }}
            />
            <span className="font-medium text-[13px] tracking-tight leading-none text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-200 whitespace-nowrap">
              {name}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-auto font-mono text-[11px] tracking-[0.12em] text-slate-400 dark:text-slate-500 select-none text-center w-full">
        — and still learning.
      </p>
    </div>
  )
}

export function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.section
      ref={ref}
      id="about"
      className="py-14 sm:py-20 overflow-hidden"
      aria-labelledby="about-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Container size="lg">

        <div className="mb-14">
          <div className="mb-4">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-indigo-400 dark:text-indigo-500">About</span>
          </div>
          <h2 id="about-heading" className="font-serif text-[40px] sm:text-[50px] font-normal leading-[1.06] tracking-tight text-slate-900 dark:text-slate-100">
            A bit about <em className="italic text-slate-500 dark:text-slate-400">me</em>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10">

          {/* Bio card — tighter, no dead space */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.025] p-7 sm:p-8 lg:max-w-lg w-full shrink-0 flex flex-col justify-between">
            <div>
              <p className="text-justify text-[15.5px] leading-[1.9] text-slate-600 dark:text-slate-300">
                B.Tech CSE graduate with a quiet interest in{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">defence and technology</span>.
                I like building things that are useful — software that reduces friction and actually works for people.
                Clarity and{' '}
                <em className="not-italic font-medium text-slate-700 dark:text-slate-300">responsibility</em>{' '}
                matter more to me than shortcuts.
              </p>
              <p className="text-justify mt-4 text-[15px] leading-[1.9] text-slate-500 dark:text-slate-400">
                Long term, I want to contribute to the{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">defence sector</span>{' '}
                — through code and systems, not just intent. That's the direction I'm working toward.
              </p>
            </div>

            {/* Signature — flush to bottom, no dead space */}
            <div className="mt-6 flex justify-end">
              <img
                src="/signature.png"
                alt="Vishal's signature"
                className="h-28 w-auto opacity-70 dark:opacity-55 dark:invert mix-blend-multiply dark:mix-blend-screen select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Tech grid — single column list, left-aligned, vertically centered */}
          <div className="w-full flex items-start lg:items-stretch">
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.025] p-7 sm:p-8 w-full flex items-start">
              <TechGrid />
            </div>
          </div>

        </div>

        {/* Quote — inside container, intentional spacing, reads as closing thought */}
        <div className="mt-14 sm:mt-16 flex items-center gap-6 sm:gap-10">
          <div className="flex-1 border-t border-dashed border-slate-300/80 dark:border-white/[0.2]" />
          <p className="shrink-0 font-serif text-[18px] sm:text-[24px] md:text-[28px] font-normal leading-snug tracking-tight text-center text-slate-800 dark:text-slate-200 max-w-[28ch]">
            Where others see <em className="italic">friction</em>,{' '}
            <br />
            I create <em className="italic text-indigo-400">ease</em> and{' '}
            <em className="italic text-indigo-400">empathy</em>.
          </p>
          <div className="flex-1 border-t border-dashed border-slate-300/80 dark:border-white/[0.2]" />
        </div>

      </Container>
    </motion.section>
  )
}