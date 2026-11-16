'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import VerdictCard from '@/components/VerdictCard';
import WaterfallFactors from '@/components/WaterfallFactors';
import CorrectionNotice from '@/components/CorrectionNotice';
import { generateNotice } from '@/lib/noticeGenerator';
import { loadResult, loadInput } from '@/lib/storage';
import type { PredictionResult, ProjectInput } from '@/lib/types';

export default function ResultsPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [input, setInput] = useState<ProjectInput | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResult(loadResult());
    setInput(loadInput());
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="mx-auto max-w-4xl px-6 py-16 text-parchment/40">Loading…</div>;
  if (!result || !input) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-parchment/40">No report</p>
        <h1 className="mt-3 font-display text-3xl">Nothing to show yet</h1>
        <Link href="/predict" className="mt-6 inline-flex items-center gap-2 rounded-sm bg-saffron px-5 py-2.5 text-[13px] font-medium text-ink">
          Start prediction →
        </Link>
      </div>
    );
  }

  const notice = generateNotice(input, result);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/predict" className="text-[12px] text-parchment/50 hover:text-parchment">← Back to predictor</Link>
        <button onClick={() => window.print()}
          className="rounded-sm border border-parchment/15 px-3 py-1.5 text-[11px] uppercase tracking-wider text-parchment/70 hover:bg-parchment/5">
          Print / PDF
        </button>
      </div>

      {/* Row 1 — verdict + factors */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <VerdictCard result={result} />
        <WaterfallFactors factors={result.factors} />
      </div>

      {/* Row 2 — the notice */}
      <div className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-saffron">Preview</p>
            <h2 className="mt-1 font-display text-2xl font-medium">The correction notice you will receive</h2>
            <p className="mt-1 text-[13px] text-parchment/50 max-w-2xl">
              If you file this application today, this is the notice your local authority will issue.
              Each objection below maps to a failing check in your file.
            </p>
          </div>
        </div>
        <CorrectionNotice notice={notice} />
      </div>

      <div className="mt-8 rounded-sm border border-saffron/20 bg-saffron/[0.04] p-5 text-[13px] text-parchment/60 leading-relaxed">
        <p className="font-display text-sm text-saffron mb-1">A note on this notice</p>
        This is a simulated preview based on base TNCDBR 2019 rules and typical correction-notice patterns.
        It is not a legal document. Real notices vary by local body and file completeness. Always confirm
        with a licensed architect, engineer, or surveyor before filing.
      </div>
    </div>
  );
}
