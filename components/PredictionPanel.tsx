'use client';
import { useEffect, useState } from 'react';
import type { PredictionResult } from '@/lib/types';

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const META = {
  ready:     { label: 'Ready to submit',   color: 'text-emerald-400', bar: 'bg-emerald-500', ring: '#22c55e' },
  likely:    { label: 'Likely to approve', color: 'text-yellow-400',  bar: 'bg-yellow-500',  ring: '#eab308' },
  at_risk:   { label: 'At risk',           color: 'text-orange-400',  bar: 'bg-orange-500',  ring: '#f97316' },
  high_risk: { label: 'High risk',         color: 'text-red-400',     bar: 'bg-red-500',     ring: '#ef4444' },
};

const SEV_COLOR: Record<string, string> = {
  critical: 'text-red-400', high: 'text-orange-400',
  medium: 'text-yellow-400', low: 'text-white/60',
};

export default function PredictionPanel({ prediction }: { prediction: PredictionResult }) {
  const display = useCountUp(prediction.probability);
  const meta = META[prediction.verdict];
  const size = 200, stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (display / 100) * circ;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">First-pass approval prediction</h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
          confidence: {prediction.confidence}
        </span>
      </div>

      <p className="mb-4 text-sm text-white/50">{prediction.jurisdictionLabel}</p>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
            <circle cx={size/2} cy={size/2} r={r} stroke={meta.ring} strokeWidth={stroke} fill="none"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold tabular-nums ${meta.color}`}>{display}%</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">Probability</span>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className={`text-lg font-semibold ${meta.color}`}>{meta.label}</p>
          <p className="mt-1 text-sm text-white/50">
            {prediction.estimatedCorrections} issue{prediction.estimatedCorrections === 1 ? '' : 's'} to resolve
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">FSI {prediction.fsi.toFixed(2)}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">Coverage {prediction.coverage.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${meta.bar}`}
          style={{ width: `${prediction.probability}%` }} />
      </div>

      <div className="mt-5 space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
        {prediction.factors.map((f) => (
          <div key={f.label} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            <div className="flex items-start gap-2 min-w-0">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${f.pass ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <div className="min-w-0">
                <p className={`text-xs font-medium ${SEV_COLOR[f.severity]}`}>{f.label}</p>
                <p className="text-[11px] text-white/40">{f.detail}</p>
              </div>
            </div>
            <span className={`shrink-0 text-xs font-semibold tabular-nums ${f.impact >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {f.impact >= 0 ? '+' : ''}{f.impact}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
