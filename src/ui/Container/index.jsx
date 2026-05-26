import { cn } from '../../utils/cn'

export function Container({ children, className, size = 'md' }) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', sizes[size], className)}>
      {children}
    </div>
  )
}
