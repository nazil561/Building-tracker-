'use client';
import { useState } from 'react';
import type { PredictionFactor } from '@/lib/types';

const SEV: Record<string, { label: string; text: string }> = {
  critical: { label: 'Critical', text: 'text-crimson' },
  high:     { label: 'High',     text: 'text-saffron' },
  medium:   { label: 'Medium',   text: 'text-saffron/70' },
  low:      { label: 'Low',      text: 'text-parchment/50' },
};

export default function WaterfallFactors({ factors }: { factors: PredictionFactor[] }) {
  const [filter, setFilter] = useState<'all' | 'failing' | 'passing'>('failing');
  const visible = factors.filter((f) =>
    filter === 'all' ? true : filter === 'failing' ? !f.pass : f.pass
  );
  const failing = factors.filter((f) => !f.pass).length;
  const passing = factors.filter((f) => f.pass).length;

  const maxImpact = Math.max(...factors.map((f) => Math.abs(f.impact)), 1);

  return (
    <div className="rounded-sm border border-parchment/10 bg-ink-elev/60">
      <div className="flex items-center justify-between border-b border-parchment/10 px-5 py-3">
        <h3 className="font-display text-sm text-parchment/90">Factor contribution</h3>
        <div className="flex gap-1 rounded-sm border border-parchment/10 p-0.5">
          {([
            ['all', `All ${factors.length}`],
            ['failing', `Failing ${failing}`],
            ['passing', `Passing ${passing}`],
          ] as const).map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`rounded-sm px-2.5 py-1 text-[10px] uppercase tracking-wider transition ${
                filter === k ? 'bg-parchment/15 text-parchment' : 'text-parchment/40 hover:text-parchment/70'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-parchment/5 max-h-[600px] overflow-y-auto">
        {visible.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-parchment/40">
            Nothing {filter === 'failing' ? 'to fix' : filter === 'passing' ? 'passing yet' : ''} here.
          </p>
        )}
        {visible.map((f) => {
          const sev = SEV[f.severity];
          const pct = Math.min(100, (Math.abs(f.impact) / maxImpact) * 100);
          const negative = f.impact < 0;
          return (
            <div key={f.label} className="group px-5 py-3.5 transition hover:bg-parchment/[0.02]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${f.pass ? 'bg-jade' : 'bg-crimson'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-[13px] font-medium text-parchment/90">{f.label}</p>
                      <p className={`shrink-0 font-display tabular text-[13px] ${f.pass ? 'text-jade' : 'text-crimson'}`}>
                        {f.impact >= 0 ? '+' : ''}{f.impact}%
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-parchment/40">{f.detail}</p>
                    {/* Contribution bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-parchment/5">
                        <div
                          className={`absolute top-0 h-full rounded-full transition-all duration-500 ${
                            negative ? 'right-1/2 bg-crimson/70' : 'left-1/2 bg-jade/70'
                          }`}
                          style={{ width: `${pct / 2}%` }}
                        />
                        <div className="absolute left-1/2 top-0 h-full w-px bg-parchment/20" />
                      </div>
                      <span className={`shrink-0 text-[9px] uppercase tracking-wider ${sev.text}`}>{sev.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
