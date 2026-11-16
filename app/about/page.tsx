export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">How the prediction works</h1>
        <p className="mt-2 text-sm text-white/50">Transparent model. You can see exactly why a score changes.</p>
      </header>

      <section className="space-y-6 text-white/70">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-white">1. It's a logistic model</h2>
          <p className="text-sm">
            Each check (setback, FSI, document presence, etc.) has a weight learned from
            TNCDBR 2019 rules and typical correction-notice patterns. The sum of weighted
            passes and fails runs through a sigmoid function to produce a probability
            between 0% and 100%.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-white">2. Each factor shows its own impact</h2>
          <p className="text-sm">
            For every factor, we compute how much the probability changes if that check
            flips from fail to pass. That's why you see &quot;+12%&quot; or &quot;-15%&quot; next to
            each row — it's the honest marginal contribution to your score.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-white">3. Authority matters</h2>
          <p className="text-sm">
            CMDA, Corporations, Municipalities, Panchayats, and DTCP each apply slightly
            different limits for FSI and coverage. The predictor looks up your selected
            authority and uses the correct thresholds.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-white">4. Confidence is data coverage</h2>
          <p className="text-sm">
            &quot;Confidence: low/medium/high&quot; reflects how many fields you've filled in. More
            known facts → more reliable prediction. Fill everything for the sharpest score.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-white">5. No data leaves your browser</h2>
          <p className="text-sm">
            Everything — including the model — runs client-side in JavaScript. Nothing is
            sent to a server. No accounts, no tracking, no logs.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-sm text-white/60">
        <p className="font-medium text-yellow-300">⚠ Disclaimer</p>
        <p className="mt-2">
          This is a planning aid, not a legal opinion. The prediction reflects base TNCDBR 2019
          rules and common rejection patterns — it does not replace a licensed architect,
          engineer, or surveyor. Always verify with your local planning authority.
        </p>
      </section>
    </div>
  );
}
