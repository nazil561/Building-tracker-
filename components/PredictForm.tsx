'use client';
import { GROUPED_JURISDICTIONS } from '@/lib/tnJurisdictions';
import type { ProjectInput } from '@/lib/types';

export const DEFAULT_INPUT: ProjectInput = {
  jurisdiction: 'corp-chennai',
  permitType: 'single_family',
  plotAreaSqft: 2400, builtUpAreaSqft: 1800,
  roadWidthM: 9, stories: 1, heightFt: 12,
  frontSetbackFt: 10, rearSetbackFt: 6, sideSetbackFt: 4,
  hasPatta: false, hasChitta: false, hasEC: false, hasFMB: false,
  hasSurveySketch: false, hasParentDoc: false, hasSaleDeed: false,
  hasTaxReceipt: false, hasSitePlan: false, hasBuildingPlan: false,
  hasStructuralCalc: false, hasSoilTest: false, licensedEngineer: false,
  hasParking: true, isCRZ: false, isNearAirport: false, hasFireNOC: false,
};

interface Props {
  value: ProjectInput;
  onChange: (next: ProjectInput) => void;
}

function NumField({ label, suffix, value, onChange, step = 1 }: {
  label: string; suffix?: string; value: number; onChange: (v: number) => void; step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-parchment/40">
        <span>{label}</span>
        {suffix && <span className="text-parchment/25 normal-case tracking-normal">{suffix}</span>}
      </span>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-sm border border-parchment/10 bg-ink/60 px-3.5 py-2.5 text-sm tabular text-parchment outline-none transition focus:border-saffron/50 focus:bg-ink" />
    </label>
  );
}

function Toggle({ label, value, onChange, hint }: {
  label: string; value: boolean; onChange: (v: boolean) => void; hint?: string;
}) {
  return (
    <button type="button" onClick={() => onChange(!value)} data-on={value}
      className={`stamp-toggle group flex items-center justify-between gap-2 rounded-sm border px-3 py-2.5 text-left transition ${
        value ? 'border-jade/40 bg-jade/8' : 'border-parchment/10 bg-ink/40 hover:border-parchment/20'
      }`}>
      <div className="min-w-0">
        <p className={`text-[12px] ${value ? 'text-parchment/95' : 'text-parchment/65'}`}>{label}</p>
        {hint && <p className="text-[10px] text-parchment/30 mt-0.5 truncate">{hint}</p>}
      </div>
      <span className={`relative h-4 w-7 shrink-0 rounded-full transition ${value ? 'bg-jade' : 'bg-parchment/15'}`}>
        <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-parchment transition-all ${value ? 'left-3.5' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-parchment/10 py-8 first:border-t-0 first:pt-0">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-display text-xs tabular text-saffron/70">{index}</span>
        <h2 className="font-display text-lg text-parchment/90">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function PredictForm({ value, onChange }: Props) {
  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="rounded-sm border border-parchment/10 bg-ink-elev/40 p-6 sm:p-8">
      <Section index="01" title="Authority & permit">
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-parchment/40">Local authority</span>
            <select value={value.jurisdiction} onChange={(e) => set('jurisdiction', e.target.value)}
              className="w-full rounded-sm border border-parchment/10 bg-ink/60 px-3.5 py-2.5 text-sm text-parchment outline-none transition focus:border-saffron/50">
              {Object.entries(GROUPED_JURISDICTIONS).map(([group, list]) => (
                <optgroup key={group} label={group} className="bg-ink">
                  {list.map((j) => (<option key={j.value} value={j.value} className="bg-ink">{j.label}</option>))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.18em] text-parchment/40">Permit type</span>
            <select value={value.permitType} onChange={(e) => set('permitType', e.target.value as ProjectInput['permitType'])}
              className="w-full rounded-sm border border-parchment/10 bg-ink/60 px-3.5 py-2.5 text-sm text-parchment outline-none transition focus:border-saffron/50">
              <option value="single_family">Single Family House</option>
              <option value="adu">ADU / Annex</option>
              <option value="addition">Addition / Remodel</option>
              <option value="commercial_ti">Commercial TI</option>
              <option value="layout_approval">Layout Approval</option>
              <option value="occupancy_certificate">Occupancy Certificate</option>
            </select>
          </label>
        </div>
      </Section>

      <Section index="02" title="Site & massing">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <NumField label="Plot area" suffix="sqft" value={value.plotAreaSqft} onChange={(v) => set('plotAreaSqft', v)} step={50} />
          <NumField label="Built-up" suffix="sqft" value={value.builtUpAreaSqft} onChange={(v) => set('builtUpAreaSqft', v)} step={50} />
          <NumField label="Road width" suffix="m" value={value.roadWidthM} onChange={(v) => set('roadWidthM', v)} step={0.5} />
          <NumField label="Stories" value={value.stories} onChange={(v) => set('stories', v)} step={0.5} />
          <NumField label="Height" suffix="ft" value={value.heightFt} onChange={(v) => set('heightFt', v)} />
          <NumField label="Front setback" suffix="ft" value={value.frontSetbackFt} onChange={(v) => set('frontSetbackFt', v)} step={0.5} />
          <NumField label="Rear setback" suffix="ft" value={value.rearSetbackFt} onChange={(v) => set('rearSetbackFt', v)} step={0.5} />
          <NumField label="Side setback" suffix="ft" value={value.sideSetbackFt} onChange={(v) => set('sideSetbackFt', v)} step={0.5} />
        </div>
      </Section>

      <Section index="03" title="Land documents">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          <Toggle label="Patta" hint="ownership record" value={value.hasPatta} onChange={(v) => set('hasPatta', v)} />
          <Toggle label="Chitta" hint="revenue record" value={value.hasChitta} onChange={(v) => set('hasChitta', v)} />
          <Toggle label="EC (30 yrs)" hint="encumbrance" value={value.hasEC} onChange={(v) => set('hasEC', v)} />
          <Toggle label="FMB sketch" hint="field measurement" value={value.hasFMB} onChange={(v) => set('hasFMB', v)} />
          <Toggle label="Survey sketch" value={value.hasSurveySketch} onChange={(v) => set('hasSurveySketch', v)} />
          <Toggle label="Parent document" value={value.hasParentDoc} onChange={(v) => set('hasParentDoc', v)} />
          <Toggle label="Sale deed" value={value.hasSaleDeed} onChange={(v) => set('hasSaleDeed', v)} />
          <Toggle label="Tax receipt" value={value.hasTaxReceipt} onChange={(v) => set('hasTaxReceipt', v)} />
        </div>
      </Section>

      <Section index="04" title="Technical documents">
        <div className="grid grid-cols-2 gap-2">
          <Toggle label="Site plan" value={value.hasSitePlan} onChange={(v) => set('hasSitePlan', v)} />
          <Toggle label="Building plan" hint="signed plan" value={value.hasBuildingPlan} onChange={(v) => set('hasBuildingPlan', v)} />
          <Toggle label="Structural calcs" value={value.hasStructuralCalc} onChange={(v) => set('hasStructuralCalc', v)} />
          <Toggle label="Soil test" value={value.hasSoilTest} onChange={(v) => set('hasSoilTest', v)} />
          <Toggle label="Licensed engineer" hint="DTCP/CMDA" value={value.licensedEngineer} onChange={(v) => set('licensedEngineer', v)} />
          <Toggle label="Parking shown" value={value.hasParking} onChange={(v) => set('hasParking', v)} />
        </div>
      </Section>

      <Section index="05" title="Special zones">
        <div className="grid grid-cols-2 gap-2">
          <Toggle label="CRZ zone" value={value.isCRZ} onChange={(v) => set('isCRZ', v)} />
          <Toggle label="Airport funnel" value={value.isNearAirport} onChange={(v) => set('isNearAirport', v)} />
          <Toggle label="Fire NOC obtained" value={value.hasFireNOC} onChange={(v) => set('hasFireNOC', v)} />
        </div>
      </Section>
    </div>
  );
}
