import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export function PillButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  disabled = false,
  as: Tag = 'button',
  href,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:pointer-events-none select-none'

  const variants = {
    primary:
      'bg-indigo-700 text-white shadow-cta hover:bg-indigo-800 active:scale-[0.98]',
    secondary:
      'bg-white dark:bg-white/10 text-indigo-950 dark:text-slate-100 shadow-pill border border-indigo-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-white/20 hover:shadow-md active:scale-[0.98]',
    ghost:
      'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/25 hover:bg-indigo-100/80 dark:hover:bg-indigo-500/20 active:scale-[0.98]',
    outline:
      'bg-transparent text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-7 py-3 text-[15px]',
    xl: 'px-8 py-3.5 text-base',
  }

  const Component = href ? motion.a : motion.button

  return (
    <Component
      href={href}
      type={!href ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  )
}