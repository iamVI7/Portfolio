import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../../utils/cn'
import { useTheme } from '../../../context/ThemeContext'
import { certificates } from '../../../data/story'
import { CertTile } from './CertTile'
import { Lightbox } from './Lightbox'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 },
  }),
}

export function CertificatesRow() {
  const { dark } = useTheme()
  const [activeCert, setActiveCert] = useState(null)

  return (
    <>
      <div>
        {/* Divider */}
        <div className={cn(
          'mb-10 border-t',
          dark ? 'border-white/[0.06]' : 'border-slate-200'
        )} />

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <p className={cn(
            'font-mono text-[10px] uppercase tracking-[0.18em]',
            dark ? 'text-slate-500' : 'text-slate-400'
          )}>
            Latest Triumphs & Certificates
          </p>
          <span className={cn(
            'font-mono text-[10px] rounded-full px-2.5 py-0.5',
            dark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-500'
          )}>
            {certificates.length} total
          </span>
        </motion.div>

        {/* Grid */}
        <div className="flex flex-col gap-3">
          {certificates.map((cert, i) => (
            <CertTile
              key={i}
              cert={cert}
              index={i}
              dark={dark}
              onClick={setActiveCert}
            />
          ))}
        </div>
      </div>

      <Lightbox cert={activeCert} onClose={() => setActiveCert(null)} />
    </>
  )
}