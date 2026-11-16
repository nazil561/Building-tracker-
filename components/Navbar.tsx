'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/predict', label: 'Predict' },
  { href: '/rules', label: 'Rules' },
  { href: '/about', label: 'Method' },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-parchment/10 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-sm border border-parchment/30" />
            <div className="absolute inset-[3px] border border-saffron/60" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-xs font-semibold text-saffron">R</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-medium tracking-tight">RegCat</span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-parchment/40 mt-0.5">TN Permit Check</span>
          </div>
        </Link>

        <nav>
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => {
              const active = path === l.href || (l.href !== '/' && path.startsWith(l.href));
              return (
                <li key={l.href}>
                  <Link href={l.href}
                    className={`relative rounded-md px-3 py-1.5 text-[13px] transition ${
                      active ? 'text-parchment' : 'text-parchment/50 hover:text-parchment/90'
                    }`}>
                    {l.label}
                    {active && <span className="absolute -bottom-[17px] left-2 right-2 h-px bg-saffron" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href="/predict"
          className="group relative hidden overflow-hidden rounded-sm bg-saffron px-4 py-2 text-[13px] font-medium text-ink transition hover:bg-saffron/90 sm:inline-flex">
          <span>Check a site</span>
          <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-0" />
        </Link>
      </div>
    </header>
  );
}
