'use client';
import { useEffect, useState } from 'react';
import type { PredictionResult } from '@/lib/types';

const VERDICT = {
  ready:     { label: 'APPROVAL LIKELY',    tone: 'jade',   headline: 'Ready to submit',           sub: 'Base-rule compliance is complete. Correction risk is low.' },
  likely:    { label: 'LIKELY',             tone: 'jade',   headline: 'Likely to pass',            sub: 'A few gaps to close but the application is strong.' },
  at_risk:   { label: 'AT RISK',            tone: 'saffron', headline: 'Corrections probable',      sub: 'Reviewer will almost certainly raise objections.' },
  high_risk: { label: 'HIGH RISK',          tone: 'crimson', headline: 'Do not submit yet',         sub: 'Critical gaps. Rework the file before filing.' },
};

const TONE: Record<string, { text: string; bar: string; glow: string; stamp: string; ring: string }> = {
  jade:    { text: 'text-jade',    bar: 'bg-jade',    glow: 'shadow-[0_0_80px_-20px_rgba(16,185,129,0.5)]', stamp: 'border-jade/60 text-jade',       ring: 'stroke-jade' },
  saffron: { text: 'text-saffron', bar: 'bg-saffron', glow: 'shadow-[0_0_80px_-20px_rgba(245,158,11,0.5)]', stamp: 'border-saffron/60 text-saffron', ring: 'stroke-saffron' },
  crimson: { text: 'text-crimson', bar: 'bg-crimson', glow: 'shadow-[0_0_80px_-20px_rgba(239,68,68,0.5)]',  stamp: 'border-crimson/60 text-crimson', ring: 'stroke-crimson' },
};

function useCountUp(target: number, duration = 800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export default function VerdictCard({ result }: { result: PredictionResult }) {
  const display = useCountUp(result.probability);
  const v = VERDICT[result.verdict];
  const t = TONE[v.tone];

  return (
    <div className={`relative overflow-hidden rounded-sm border border-parchment/15 bg-ink-elev ${t.glow}`}>
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-parchment/10 px-5 py-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-parchment/40">Readiness Report</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-parchment/30">
          {result.jurisdictionLabel}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-parchment/40">First-pass probability</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`font-display text-7xl font-medium tabular leading-none ${t.text}`}>{display}</span>
              <span className={`font-display text-2xl ${t.text} opacity-60`}>%</span>
            </div>
            <p className={`mt-2 font-display text-lg ${t.text}`}>{v.headline}</p>
            <p className="mt-1 text-[13px] text-parchment/50 leading-relaxed max-w-xs">{v.sub}</p>
          </div>

          {/* Stamp */}
          <div className={`shrink-0 rotate-[-6deg] rounded-sm border-2 border-dashed px-3 py-2 ${t.stamp}`}>
            <p className="font-display text-[11px] font-semibold tracking-[0.2em] leading-tight">{v.label}</p>
            <p className="text-[8px] uppercase tracking-widest opacity-60 mt-0.5">TNCDBR 2019</p>
          </div>
        </div>

        {/* Meter */}
        <div className="mt-6">
          <div className="mb-1.5 flex justify-between text-[10px] uppercase tracking-widest text-parchment/30">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-parchment/10">
            <div className={`h-full rounded-full ${t.bar} transition-all duration-700 ease-out`}
              style={{ width: `${result.probability}%` }} />
            {/* Threshold marks at 40 and 60 */}
            <div className="absolute left-[40%] top-0 h-full w-px bg-parchment/20" />
            <div className="absolute left-[60%] top-0 h-full w-px bg-parchment/20" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-parchment/10 rounded-sm border border-parchment/10">
          <Stat label="Issues" value={String(result.estimatedCorrections)} />
          <Stat label="Confidence" value={result.confidence.toUpperCase()} small />
          <Stat label="Authority" value={result.jurisdictionLabel.split('–')[0].trim().split(' ').slice(0, 2).join(' ')} small />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="px-3 py-3">
      <p className="text-[9px] uppercase tracking-[0.2em] text-parchment/40">{label}</p>
      <p className={`mt-1 font-display tabular text-parchment ${small ? 'text-sm' : 'text-lg'}`}>{value}</p>
    </div>
  );
}
