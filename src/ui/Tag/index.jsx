import { cn } from '../../utils/cn'

export function Tag({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-indigo-200/70 dark:border-indigo-500/25 bg-indigo-50/80 dark:bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400',
        className
      )}
    >
      {children}
    </span>
  )
}