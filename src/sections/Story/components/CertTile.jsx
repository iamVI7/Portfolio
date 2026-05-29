import { motion } from 'framer-motion'
import { cn } from '../../../utils/cn'

const ease = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease, delay: i * 0.07 },
  }),
}

function CertIcon({ image, name, dark }) {
  return (
    <div className={cn(
      'flex-shrink-0 h-16 w-20 sm:h-20 sm:w-28 rounded-xl overflow-hidden flex items-center justify-center',
      dark ? 'bg-white/[0.06] border border-white/[0.07]' : 'bg-slate-100 border border-slate-200/80'
    )}>
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <svg
          width="22" height="22" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round"
          className={dark ? 'text-slate-500' : 'text-slate-400'}
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )}
    </div>
  )
}

function ViewIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  )
}

export function CertTile({ cert, index, dark, onClick }) {
  return (
    <motion.button
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      onClick={() => onClick(cert)}
      className={cn(
        'group relative w-full text-left rounded-xl px-5 py-4 transition-all duration-300 focus:outline-none',
        'flex items-center gap-4',
        dark
          ? 'bg-white/[0.02] hover:bg-white/[0.04]'
          : 'bg-white/60 hover:bg-white hover:shadow-sm'
      )}
    >
      {/* Icon */}
      <CertIcon image={cert.image} name={cert.name} dark={dark} />

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <p className={cn(
          'font-serif italic text-[15px] sm:text-[16px] leading-snug mb-1',
          dark ? 'text-slate-100' : 'text-slate-800'
        )}>
          {cert.name}
        </p>

        {/* Issuer row — pill inline on mobile, hidden on desktop (pill is absolute there) */}
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <p className={cn(
            'text-[11px] font-mono',
            dark ? 'text-indigo-400' : 'text-indigo-500'
          )}>
            {cert.issuer}
          </p>

          {/* Pill: inline on mobile, hidden on sm+ */}
          <span className={cn(
            'sm:hidden rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wide',
            dark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-500'
          )}>
            {cert.date}
          </span>
        </div>

        {cert.description && (
          <p className={cn(
            'text-[12px] sm:text-[13px] leading-relaxed line-clamp-2',
            dark ? 'text-slate-400' : 'text-slate-500'
          )}>
            {cert.description}
          </p>
        )}
      </div>

      {/* Pill: absolute right on desktop only */}
      <span className={cn(
        'hidden sm:inline-flex items-center self-center flex-shrink-0',
        'rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wide',
        dark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-500'
      )}>
        {cert.date}
      </span>

      {/* Arrow — visible on hover */}
      <div className={cn(
        'flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200',
        'opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0',
        dark
          ? 'bg-white/[0.06] text-slate-400'
          : 'bg-slate-100 text-slate-500'
      )}>
        <ViewIcon />
      </div>
    </motion.button>
  )
}