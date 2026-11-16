export default function RulesPage() {
  const roadTable = [
    ['Up to 9 m', '1.5 m'],
    ['9 – 18 m', '3.0 m'],
    ['18 – 30.5 m', '4.5 m'],
    ['Above 30.5 m', '6.0 m'],
  ];
  const heightTable = [
    ['Up to 7 m', '1.5 m', '1.0 m'],
    ['7 – 12 m', '2.0 m', '1.5 m'],
    ['12 – 15 m', '3.0 m', '2.0 m'],
    ['Above 15 m', '4.0 m', '2.5 m'],
  ];
  const docs = [
    'Patta / Chitta (ownership records)', 'Encumbrance Certificate (30 years)',
    'FMB sketch (Field Measurement Book)', 'Survey sketch from licensed surveyor',
    'Registered sale deed', 'Parent document (30-yr chain)',
    'Current property tax receipt', 'Soil test report',
    'Structural stability certificate', 'Site plan (to scale)',
    'Building plan (signed by DTCP/CMDA-licensed professional)',
    'Ownership affidavit', 'Fire NOC (if height > 15 m)',
    'AAI NOC (if near airport)', 'CRZ clearance (if coastal)',
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">TNCDBR 2019 Rules Reference</h1>
        <p className="mt-2 text-sm text-white/50">
          Tamil Nadu Combined Development and Building Rules, 2019 — the base rules used by the predictor.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Front setback (by road width)</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr><th className="px-4 py-3 text-left font-medium text-white/70">Road width</th><th className="px-4 py-3 text-left font-medium text-white/70">Min front setback</th></tr>
            </thead>
            <tbody>
              {roadTable.map((r, i) => (
                <tr key={r[0]} className={i % 2 ? 'bg-white/[0.02]' : ''}>
                  <td className="px-4 py-3 text-white/80">{r[0]}</td>
                  <td className="px-4 py-3 text-white/60">{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Rear &amp; side setback (by building height)</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/70">Building height</th>
                <th className="px-4 py-3 text-left font-medium text-white/70">Rear</th>
                <th className="px-4 py-3 text-left font-medium text-white/70">Side</th>
              </tr>
            </thead>
            <tbody>
              {heightTable.map((r, i) => (
                <tr key={r[0]} className={i % 2 ? 'bg-white/[0.02]' : ''}>
                  <td className="px-4 py-3 text-white/80">{r[0]}</td>
                  <td className="px-4 py-3 text-white/60">{r[1]}</td>
                  <td className="px-4 py-3 text-white/60">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">FSI &amp; coverage by authority type</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/70">Authority</th>
                <th className="px-4 py-3 text-left font-medium text-white/70">Max FSI (residential)</th>
                <th className="px-4 py-3 text-left font-medium text-white/70">Max coverage</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['CMDA (Chennai Metro)', '2.0', '65%'],
                ['Municipal Corporation', '2.0', '70%'],
                ['Municipality', '1.75', '70%'],
                ['Town Panchayat', '1.5', '75%'],
                ['DTCP district', '1.5', '75%'],
              ].map((r, i) => (
                <tr key={r[0]} className={i % 2 ? 'bg-white/[0.02]' : ''}>
                  <td className="px-4 py-3 text-white/80">{r[0]}</td>
                  <td className="px-4 py-3 text-white/60">{r[1]}</td>
                  <td className="px-4 py-3 text-white/60">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Required documents checklist</h2>
        <ul className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/70">
          {docs.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-400 shrink-0" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-sm text-white/60">
        <p className="font-medium text-yellow-300">⚠ Note</p>
        <p className="mt-2">
          Rules vary slightly by local body. Some corporations (e.g., Coimbatore) have city-specific rules under
          separate notifications. Always verify with your local planning authority before submitting.
        </p>
      </section>
    </div>
  );
}
