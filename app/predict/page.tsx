'use client';
import { useMemo, useState, useEffect } from 'react';
import PredictForm, { DEFAULT_INPUT } from '@/components/PredictForm';
import LiveSidePanel from '@/components/LiveSidePanel';
import { predictApproval } from '@/lib/tnPredictor';
import { saveInput, saveResult } from '@/lib/storage';
import type { ProjectInput } from '@/lib/types';

const VERDICT_HUE = {
  ready: '16,185,129', likely: '16,185,129',
  at_risk: '245,158,11', high_risk: '239,68,68',
};

export default function PredictPage() {
  const [input, setInput] = useState<ProjectInput>(DEFAULT_INPUT);
  const result = useMemo(() => predictApproval(input), [input]);

  useEffect(() => {
    saveInput(input);
    saveResult(result);
  }, [input, result]);

  const hue = VERDICT_HUE[result.verdict];

  return (
    <div className="relative">
      <div
        className="ambient-glow"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${hue},0.09), transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-parchment/40">Live · updates as you type</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Describe the site. Watch the verdict.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-parchment/50">
            Every change is scored in real time against TNCDBR 2019 for your selected authority. No submit button — just edit and observe.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">
          <div>
            <PredictForm value={input} onChange={setInput} />
          </div>
          <aside className="lg:sticky lg:top-24 h-fit">
            <LiveSidePanel input={input} result={result} />
          </aside>
        </div>
      </div>
    </div>
  );
}
