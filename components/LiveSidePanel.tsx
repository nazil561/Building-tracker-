'use client';
import Link from 'next/link';
import type { PredictionResult, ProjectInput } from '@/lib/types';
import VerdictCard from './VerdictCard';
import PlotVisualizer from './PlotVisualizer';

export default function LiveSidePanel({ input, result }: { input: ProjectInput; result: PredictionResult }) {
  const topFixes = result.factors.filter((f) => !f.pass).slice(0, 3);

  return (
    <div className="space-y-4">
      <VerdictCard result={result} />
      <PlotVisualizer input={input} result={result} />

      {topFixes.length > 0 && (
        <div className="rounded-sm border border-parchment/10 bg-ink-elev/60 p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-parchment/40 mb-3">Top 3 fixes</p>
          <ol className="space-y-2.5">
            {topFixes.map((f, i) => (
              <li key={f.label} className="flex gap-3">
                <span className="shrink-0 font-display text-lg tabular text-saffron/70 leading-none mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-parchment/90">{f.label}</p>
                  <p className="text-[11px] text-parchment/40 leading-relaxed">{f.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <Link href="/results"
        className="flex items-center justify-between rounded-sm border border-parchment/15 bg-parchment/5 px-4 py-3 text-[13px] text-parchment/80 transition hover:bg-parchment/10">
        <span>View full report</span>
        <span className="text-saffron">→</span>
      </Link>
    </div>
  );
}
