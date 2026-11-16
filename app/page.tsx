import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative">
      <div className="ambient-glow"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 20% 0%, rgba(245,158,11,0.08), transparent 60%)' }} />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        {/* Hero — editorial layout */}
        <section className="grid items-end gap-12 pb-16 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-saffron">
              Tamil Nadu · TNCDBR 2019 · Readiness check
            </p>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Know what the<br />
              <span className="italic text-parchment/70">authority</span> will say<br />
              before you file.
            </h1>
            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-parchment/60">
              RegCat scores your building permit application against Tamil Nadu's 2019 development rules —
              CMDA, Corporations, Municipalities, Panchayats, and all 38 DTCP districts. Live, in your browser,
              without an account.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/predict"
                className="group relative overflow-hidden rounded-sm bg-saffron px-6 py-3 text-[13px] font-medium text-ink transition hover:bg-saffron/90">
                <span className="relative z-10">Check a site →</span>
                <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-0" />
              </Link>
              <Link href="/rules"
                className="rounded-sm border border-parchment/15 px-6 py-3 text-[13px] text-parchment/80 transition hover:border-parchment/30 hover:bg-parchment/5">
                Read the rules
              </Link>
            </div>
          </div>

          {/* Right decorative — mini plot drawing */}
          <div className="hidden lg:block">
            <svg width="280" height="280" viewBox="0 0 280 280" className="text-parchment/20">
              <rect x="20" y="20" width="240" height="240" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="60" y="60" width="160" height="160" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
              <rect x="90" y="90" width="100" height="100" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
              <text x="140" y="145" textAnchor="middle" fontSize="8" fill="currentColor" letterSpacing="3">PLOT</text>
              <line x1="20" y1="10" x2="260" y2="10" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
              <text x="140" y="8" textAnchor="middle" fontSize="7" fill="#f59e0b" letterSpacing="3" opacity="0.7">ROAD</text>
            </svg>
          </div>
        </section>

        {/* Stats as footnotes */}
        <section className="grid gap-px overflow-hidden rounded-sm border border-parchment/10 bg-parchment/10 sm:grid-cols-3">
          {[
            { k: '150+', l: 'Authorities', d: 'CMDA · Corps · Muns · Panchayats · DTCP' },
            { k: '22', l: 'Rule checks', d: 'Setbacks · FSI · Coverage · Docs · Zones' },
            { k: '0', l: 'Signup', d: 'Runs client-side. Nothing leaves your device.' },
          ].map((s) => (
            <div key={s.l} className="bg-ink-elev/60 p-6">
              <p className="font-display text-4xl tabular text-saffron">{s.k}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-parchment/40">{s.l}</p>
              <p className="mt-3 text-[13px] text-parchment/60">{s.d}</p>
            </div>
          ))}
        </section>

        {/* How it works — numbered editorial */}
        <section className="mt-24">
          <div className="mb-10 flex items-baseline justify-between border-b border-parchment/10 pb-4">
            <h2 className="font-display text-2xl font-medium">How it works</h2>
            <span className="text-[10px] uppercase tracking-[0.25em] text-parchment/40">Three steps</span>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: '01', t: 'Describe the site', d: 'Plot dimensions, road width, setbacks, height. Toggle which documents you have.' },
              { n: '02', t: 'See the verdict', d: 'Score, plot diagram, and factor-by-factor breakdown — all update as you type.' },
              { n: '03', t: 'Fix before you file', d: 'Close the top gaps. Watch the % climb. Submit only when you\'re ready.' },
            ].map((s) => (
              <div key={s.n}>
                <p className="font-display text-3xl tabular text-saffron/60">{s.n}</p>
                <h3 className="mt-3 font-display text-lg text-parchment/90">{s.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-parchment/50">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-24 rounded-sm border border-saffron/20 bg-gradient-to-br from-saffron/[0.06] to-transparent p-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-saffron">Ready when you are</p>
          <h2 className="mt-3 font-display text-3xl font-medium">Two minutes. One site. A clear verdict.</h2>
          <Link href="/predict"
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-saffron px-6 py-3 text-[13px] font-medium text-ink transition hover:bg-saffron/90">
            Start prediction →
          </Link>
        </section>
      </div>
    </div>
  );
}
