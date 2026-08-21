import { Container } from '../../ui/Container'

const links = [
  { label: 'About',     href: '#about'     },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey',  href: '#journey'  },
]

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/iamVI7',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/vishal-yadav-v7',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:vishalyadav75186@gmail.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-slate-100 dark:border-white/[0.07]">
      <Container size="lg">
        <div className="flex flex-col items-center gap-6 pt-8 pb-28 sm:py-8 sm:flex-row sm:items-center sm:justify-between">

          {/* Centre — nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center items-center gap-5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-mono text-[11px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — socials + year */}
          <div className="flex items-center gap-4 justify-center sm:justify-end">
            <div className="flex items-center gap-2" aria-label="Social links">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 transition-colors hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                  {icon}
                </a>
              ))}
            </div>
            <span className="h-3.5 w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
            <span className="font-mono text-[10.5px] text-slate-400 dark:text-slate-500">
              {String.fromCharCode(169)} {new Date().getFullYear()}
            </span>
          </div>

        </div>
      </Container>
    </footer>
  )
}