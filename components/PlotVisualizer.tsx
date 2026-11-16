'use client';
import type { PredictionResult, ProjectInput } from '@/lib/types';
import { FT_TO_M } from '@/lib/tnRules';

interface Props {
  input: ProjectInput;
  result: PredictionResult;
}

const SIZE = 440;
const MARGIN = 60;
const PLOT = SIZE - 2 * MARGIN;

export default function PlotVisualizer({ input, result }: Props) {
  const frontageFt = Math.max(20, Math.sqrt(input.plotAreaSqft || 1));
  const pxPerFt = PLOT / frontageFt;

  const fs = Math.min(input.frontSetbackFt * pxPerFt, PLOT * 0.35);
  const rs = Math.min(input.rearSetbackFt * pxPerFt, PLOT * 0.35);
  const ssL = Math.min(input.sideSetbackFt * pxPerFt, PLOT * 0.35);
  const ssR = Math.min(input.sideSetbackFt * pxPerFt, PLOT * 0.35);

  const bldgX = MARGIN + ssL;
  const bldgY = MARGIN + fs;
  const bldgW = Math.max(10, PLOT - ssL - ssR);
  const bldgH = Math.max(10, PLOT - fs - rs);

  // compliance checks (ft vs ft)
  const req = (r: number) => r / FT_TO_M;
  const frontOk = input.frontSetbackFt >= req(result.requiredFrontSetback);
  const rearOk = input.rearSetbackFt >= req(result.requiredRearSetback);
  const sideOk = input.sideSetbackFt >= req(result.requiredSideSetback);

  const zoneFill = (ok: boolean) =>
    ok ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.14)';
  const zoneStroke = (ok: boolean) =>
    ok ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.7)';

  return (
    <div className="rounded-sm border border-parchment/10 bg-ink-elev/60 p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-parchment/40">Site plan preview</p>
          <p className="mt-1 font-display text-sm text-parchment/80">
            Assumes {(frontageFt).toFixed(0)} ft frontage · plot {input.plotAreaSqft.toLocaleString()} sqft
          </p>
        </div>
        <div className="flex gap-3 text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-parchment/40"><span className="h-2 w-2 rounded-sm bg-jade/30 border border-jade/60" />ok</span>
          <span className="flex items-center gap-1.5 text-parchment/40"><span className="h-2 w-2 rounded-sm bg-crimson/20 border border-crimson/70" />fail</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Site plan">
        <defs>
          <pattern id="hatch-red" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(239,68,68,0.35)" strokeWidth="1" />
          </pattern>
          <pattern id="hatch-green" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Road strip */}
        <rect x={MARGIN} y={MARGIN - 28} width={PLOT} height={20} fill="rgba(244,237,226,0.06)" />
        <line x1={MARGIN} y1={MARGIN - 8} x2={MARGIN + PLOT} y2={MARGIN - 8} stroke="rgba(244,237,226,0.25)" strokeWidth="0.8" strokeDasharray="3 4" />
        <text x={MARGIN + PLOT / 2} y={MARGIN - 14} textAnchor="middle" fontSize="9" fill="rgba(244,237,226,0.5)" letterSpacing="2">
          ROAD · {input.roadWidthM} m
        </text>

        {/* Plot outline */}
        <rect x={MARGIN} y={MARGIN} width={PLOT} height={PLOT}
          fill="none" stroke="rgba(244,237,226,0.55)" strokeWidth="1.2" />
        {/* Corner ticks */}
        {[
          [MARGIN, MARGIN, 8, 0], [MARGIN, MARGIN, 0, 8],
          [MARGIN + PLOT, MARGIN, -8, 0], [MARGIN + PLOT, MARGIN, 0, 8],
          [MARGIN, MARGIN + PLOT, 8, 0], [MARGIN, MARGIN + PLOT, 0, -8],
          [MARGIN + PLOT, MARGIN + PLOT, -8, 0], [MARGIN + PLOT, MARGIN + PLOT, 0, -8],
        ].map(([x, y, dx, dy], i) => (
          <line key={i} x1={x} y1={y} x2={x + dx} y2={y + dy} stroke="rgba(244,237,226,0.9)" strokeWidth="1.5" />
        ))}

        {/* Setback zones */}
        {/* Front */}
        <rect x={MARGIN} y={MARGIN} width={PLOT} height={fs}
          fill={frontOk ? 'url(#hatch-green)' : 'url(#hatch-red)'} />
        <rect x={MARGIN} y={MARGIN} width={PLOT} height={fs}
          fill={zoneFill(frontOk)} stroke={zoneStroke(frontOk)} strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Rear */}
        <rect x={MARGIN} y={MARGIN + PLOT - rs} width={PLOT} height={rs}
          fill={rearOk ? 'url(#hatch-green)' : 'url(#hatch-red)'} />
        <rect x={MARGIN} y={MARGIN + PLOT - rs} width={PLOT} height={rs}
          fill={zoneFill(rearOk)} stroke={zoneStroke(rearOk)} strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Left (only beside building) */}
        <rect x={MARGIN} y={bldgY} width={ssL} height={bldgH}
          fill={sideOk ? 'url(#hatch-green)' : 'url(#hatch-red)'} />
        <rect x={MARGIN} y={bldgY} width={ssL} height={bldgH}
          fill={zoneFill(sideOk)} stroke={zoneStroke(sideOk)} strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Right */}
        <rect x={MARGIN + PLOT - ssR} y={bldgY} width={ssR} height={bldgH}
          fill={sideOk ? 'url(#hatch-green)' : 'url(#hatch-red)'} />
        <rect x={MARGIN + PLOT - ssR} y={bldgY} width={ssR} height={bldgH}
          fill={zoneFill(sideOk)} stroke={zoneStroke(sideOk)} strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Building footprint */}
        <rect x={bldgX} y={bldgY} width={bldgW} height={bldgH}
          fill="rgba(244,237,226,0.92)" stroke="rgba(10,8,6,0.9)" strokeWidth="1" />
        <text x={bldgX + bldgW / 2} y={bldgY + bldgH / 2}
          textAnchor="middle" fontSize="11" fill="#0a0806" letterSpacing="3" fontWeight="600">
          BUILDING
        </text>
        <text x={bldgX + bldgW / 2} y={bldgY + bldgH / 2 + 16}
          textAnchor="middle" fontSize="9" fill="rgba(10,8,6,0.6)">
          {input.builtUpAreaSqft.toLocaleString()} sqft · {result.fsi.toFixed(2)} FSI
        </text>

        {/* Labels: front setback */}
        <text x={MARGIN + PLOT + 6} y={MARGIN + fs / 2 + 3} fontSize="9" fill={frontOk ? '#10b981' : '#ef4444'} fontWeight="600">
          {input.frontSetbackFt.toFixed(1)} ft
        </text>
        <text x={MARGIN + PLOT + 6} y={MARGIN + fs / 2 + 14} fontSize="7" fill="rgba(244,237,226,0.4)">
          req {req(result.requiredFrontSetback).toFixed(1)}
        </text>

        {/* Rear */}
        <text x={MARGIN + PLOT + 6} y={MARGIN + PLOT - rs / 2 + 3} fontSize="9" fill={rearOk ? '#10b981' : '#ef4444'} fontWeight="600">
          {input.rearSetbackFt.toFixed(1)} ft
        </text>
        <text x={MARGIN + PLOT + 6} y={MARGIN + PLOT - rs / 2 + 14} fontSize="7" fill="rgba(244,237,226,0.4)">
          req {req(result.requiredRearSetback).toFixed(1)}
        </text>

        {/* Side */}
        <text x={MARGIN + ssL / 2} y={MARGIN + PLOT + 20} textAnchor="middle" fontSize="9" fill={sideOk ? '#10b981' : '#ef4444'} fontWeight="600">
          {input.sideSetbackFt.toFixed(1)} ft
        </text>
        <text x={MARGIN + ssL / 2} y={MARGIN + PLOT + 30} textAnchor="middle" fontSize="7" fill="rgba(244,237,226,0.4)">
          req {req(result.requiredSideSetback).toFixed(1)}
        </text>

        {/* North arrow */}
        <g transform={`translate(${SIZE - 24} ${SIZE - 24})`}>
          <circle r="10" fill="none" stroke="rgba(244,237,226,0.15)" strokeWidth="0.8" />
          <path d="M0,-7 L2.5,3 L0,1 L-2.5,3 Z" fill="rgba(244,237,226,0.5)" />
          <text y="-12" textAnchor="middle" fontSize="7" fill="rgba(244,237,226,0.4)">N</text>
        </g>
      </svg>
    </div>
  );
}
