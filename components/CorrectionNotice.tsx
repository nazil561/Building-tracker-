'use client';
import type { NoticeData } from '@/lib/noticeGenerator';

const SEV_BADGE: Record<string, { label: string; cls: string }> = {
  critical: { label: 'CRITICAL', cls: 'bg-red-100 text-red-900 border-red-300' },
  high:     { label: 'MAJOR',    cls: 'bg-orange-100 text-orange-900 border-orange-300' },
  medium:   { label: 'MINOR',    cls: 'bg-amber-100 text-amber-900 border-amber-300' },
  low:      { label: 'ADVISORY', cls: 'bg-stone-100 text-stone-700 border-stone-300' },
};

export default function CorrectionNotice({ notice }: { notice: NoticeData }) {
  return (
    <div className="rounded-sm border border-parchment/15 bg-[#f5efe1] text-[#1a1410] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
      {/* Letterhead */}
      <div className="border-b-2 border-[#1a1410]/80 px-8 pt-8 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#1a1410]/60">Government of Tamil Nadu</p>
            <h2 className="mt-1 font-display text-lg font-semibold leading-tight">{notice.authority}</h2>
            <p className="mt-1 text-[11px] text-[#1a1410]/60 italic">Office of the Member Secretary / Executive Engineer</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#1a1410]/50">Ref. No.</p>
            <p className="font-mono text-[11px] tabular">{notice.referenceNumber}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#1a1410]/50">Date</p>
            <p className="font-mono text-[11px] tabular">{notice.date}</p>
          </div>
        </div>
      </div>

      {/* Subject */}
      <div className="px-8 pt-5 pb-2 border-b border-[#1a1410]/20">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a1410]/50">Sub:</p>
        <p className="mt-1 text-[13px] font-medium leading-relaxed">{notice.subject}</p>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-5">
        <p className="text-[12.5px] leading-relaxed">
          Sir / Madam,
        </p>
        <p className="text-[12.5px] leading-relaxed">
          With reference to the above application for Building Licence submitted to this office, the
          proposal has been examined under the Tamil Nadu Combined Development and Building Rules, 2019.
          The following objections are raised and require compliance before the application can be
          processed further:
        </p>

        {notice.objections.length === 0 ? (
          <div className="rounded-sm border border-green-800/30 bg-green-50 p-4 text-[12.5px] text-green-900">
            <p className="font-medium mb-1">No objections raised.</p>
            <p>The proposal is found compliant with the provisions of TNCDBR 2019. The application
            is recommended for approval and shall proceed to licence issuance.</p>
          </div>
        ) : (
          <ol className="space-y-4">
            {notice.objections.map((o) => {
              const badge = SEV_BADGE[o.severity] ?? SEV_BADGE.low;
              return (
                <li key={o.number} className="flex gap-3">
                  <span className="shrink-0 font-display text-[15px] tabular text-[#1a1410]/50 w-5 text-right">
                    {o.number}.
                  </span>
                  <div className="flex-1">
                    <span className={`inline-block rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-medium mb-1.5 ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <p className="text-[12.5px] leading-relaxed text-[#1a1410]/90">{o.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {/* Delay estimate — the killer piece */}
        <div className="mt-6 rounded-sm border border-[#1a1410]/25 bg-[#ebe1cf] p-4">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#1a1410]/60">Estimated impact</p>
          <p className="mt-2 font-display text-[15px] text-[#1a1410]">
            Total delay to licence issuance: <span className="font-semibold">{notice.estimatedDelayWeeks[0]}–{notice.estimatedDelayWeeks[1]} weeks</span>
            <span className="text-[#1a1410]/50 text-[12px] font-normal ml-1">({notice.estimatedDelayMonths[0]}–{notice.estimatedDelayMonths[1]} months)</span>
          </p>
          <p className="mt-1 text-[11px] text-[#1a1410]/60 leading-relaxed">
            Includes review cycles for {notice.totalObjections} objection{notice.totalObjections === 1 ? '' : 's'}
            {notice.criticalCount > 0 && ` (${notice.criticalCount} critical)`}.
            Actual timelines depend on completeness of resubmission and inspection scheduling.
          </p>
        </div>

        {/* Resubmission note */}
        <p className="text-[12.5px] leading-relaxed border-t border-[#1a1410]/15 pt-4">{notice.resubmissionNote}</p>

        <p className="text-[12.5px] leading-relaxed">Yours faithfully,</p>
      </div>

      {/* Signature */}
      <div className="px-8 pb-8 flex items-end justify-between">
        <div>
          <div className="w-40 border-b border-[#1a1410]/40 mb-2" />
          <p className="text-[12px] font-medium">Assistant Executive Engineer</p>
          <p className="text-[11px] text-[#1a1410]/60">{notice.authority}</p>
        </div>
        {/* Stamp */}
        <div className="relative shrink-0 -rotate-[8deg]">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-[2.5px] border-red-800/50 text-red-800/50">
            <div className="text-center">
              <p className="text-[7px] uppercase tracking-widest font-bold leading-tight">Planning</p>
              <p className="text-[10px] font-bold leading-tight">{notice.authorityCode}</p>
              <p className="text-[7px] uppercase tracking-widest font-bold leading-tight">Authority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-[#1a1410]/15 bg-[#ebe1cf] px-8 py-3 text-[10px] text-[#1a1410]/50 flex justify-between">
        <span>This is a simulated notice generated by RegCat for planning purposes.</span>
        <span>Ref. {notice.referenceNumber}</span>
      </div>
    </div>
  );
}
