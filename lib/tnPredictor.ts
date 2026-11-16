import {
  requiredFrontSetback, requiredRearSetback, requiredSideSetback,
  maxFSI, maxCoverage, FIRE_NOC_HEIGHT_M, FT_TO_M,
} from './tnRules';
import { getJurisdiction } from './tnJurisdictions';
import type { ProjectInput, PredictionFactor, PredictionResult } from './types';

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const SHARPNESS = 7; // curve steepness around 50%

interface Check {
  label: string;
  weight: number;
  pass: boolean;
  detail: string;
  severity: PredictionFactor['severity'];
  applicable: boolean;
}

export function predictApproval(input: ProjectInput): PredictionResult {
  const j = getJurisdiction(input.jurisdiction);
  const jType = j?.type ?? 'DTCP';
  const jLabel = j?.label ?? 'Unknown authority';

  const heightM = input.heightFt * FT_TO_M;
  const reqFront = requiredFrontSetback(input.roadWidthM);
  const reqRear = requiredRearSetback(heightM);
  const reqSide = requiredSideSetback(heightM);
  const reqFSI = maxFSI(jType);
  const reqCoverage = maxCoverage(jType);
  const reqHeight = FIRE_NOC_HEIGHT_M;

  const fsi = input.plotAreaSqft > 0 ? input.builtUpAreaSqft / input.plotAreaSqft : 0;
  const coverage = input.plotAreaSqft > 0 ? (input.builtUpAreaSqft / input.plotAreaSqft) * 100 : 0;
  const needsFireNOC = heightM > reqHeight;
  const needsAirportNOC = input.isNearAirport;
  const needsCRZNOC = input.isCRZ;

  const actualFrontM = input.frontSetbackFt * FT_TO_M;
  const actualRearM = input.rearSetbackFt * FT_TO_M;
  const actualSideM = input.sideSetbackFt * FT_TO_M;

  const checks: Check[] = [
    { label: 'Front setback', weight: 1.5, pass: actualFrontM >= reqFront, severity: 'critical', applicable: true,
      detail: actualFrontM >= reqFront ? `≥ ${reqFront.toFixed(1)} m ✓` : `Needs ${reqFront.toFixed(1)} m (currently ${actualFrontM.toFixed(1)} m)` },
    { label: 'Rear setback', weight: 1.0, pass: actualRearM >= reqRear, severity: 'high', applicable: true,
      detail: actualRearM >= reqRear ? `≥ ${reqRear.toFixed(1)} m ✓` : `Needs ${reqRear.toFixed(1)} m (currently ${actualRearM.toFixed(1)} m)` },
    { label: 'Side setback', weight: 0.8, pass: actualSideM >= reqSide, severity: 'high', applicable: true,
      detail: actualSideM >= reqSide ? `≥ ${reqSide.toFixed(1)} m ✓` : `Needs ${reqSide.toFixed(1)} m (currently ${actualSideM.toFixed(1)} m)` },
    { label: 'FSI / FAR', weight: 1.3, pass: fsi <= reqFSI, severity: 'critical', applicable: true,
      detail: fsi <= reqFSI ? `FSI ${fsi.toFixed(2)} ≤ ${reqFSI} ✓` : `FSI ${fsi.toFixed(2)} exceeds ${reqFSI} — reduce built-up` },
    { label: 'Ground coverage', weight: 1.0, pass: coverage <= reqCoverage, severity: 'high', applicable: true,
      detail: coverage <= reqCoverage ? `${coverage.toFixed(0)}% ≤ ${reqCoverage}% ✓` : `${coverage.toFixed(0)}% > ${reqCoverage}% — reduce footprint` },
    { label: 'Building height', weight: 0.7, pass: heightM <= reqHeight, severity: 'high', applicable: true,
      detail: heightM <= reqHeight ? `${heightM.toFixed(1)} m ≤ ${reqHeight} m ✓` : `${heightM.toFixed(1)} m > ${reqHeight} m — Fire NOC mandatory` },
    { label: 'Parking provision', weight: 0.5, pass: input.hasParking, severity: 'medium', applicable: true,
      detail: input.hasParking ? 'Shown in plan ✓' : 'Not shown — 1 ECS per 100 sqm required' },

    { label: 'Patta', weight: 1.2, pass: input.hasPatta, severity: 'critical', applicable: true,
      detail: input.hasPatta ? 'On file ✓' : 'Missing — mandatory ownership proof' },
    { label: 'Chitta', weight: 0.5, pass: input.hasChitta, severity: 'medium', applicable: true,
      detail: input.hasChitta ? 'On file ✓' : 'Missing — revenue record required' },
    { label: 'EC (30 yrs)', weight: 0.8, pass: input.hasEC, severity: 'high', applicable: true,
      detail: input.hasEC ? 'On file ✓' : 'Missing — clean title chain required' },
    { label: 'FMB sketch', weight: 0.7, pass: input.hasFMB, severity: 'high', applicable: true,
      detail: input.hasFMB ? 'On file ✓' : 'Missing — Field Measurement Book' },
    { label: 'Survey sketch', weight: 0.5, pass: input.hasSurveySketch, severity: 'medium', applicable: true,
      detail: input.hasSurveySketch ? 'On file ✓' : 'Missing — licensed surveyor sketch' },
    { label: 'Parent document', weight: 0.6, pass: input.hasParentDoc, severity: 'medium', applicable: true,
      detail: input.hasParentDoc ? 'On file ✓' : 'Missing — 30-yr chain document' },
    { label: 'Registered sale deed', weight: 0.6, pass: input.hasSaleDeed, severity: 'high', applicable: true,
      detail: input.hasSaleDeed ? 'On file ✓' : 'Missing — proof of transfer' },
    { label: 'Tax receipt', weight: 0.3, pass: input.hasTaxReceipt, severity: 'low', applicable: true,
      detail: input.hasTaxReceipt ? 'On file ✓' : 'Missing — latest property tax receipt' },

    { label: 'Site plan', weight: 0.7, pass: input.hasSitePlan, severity: 'high', applicable: true,
      detail: input.hasSitePlan ? 'On file ✓' : 'Missing — scaled site plan' },
    { label: 'Building plan', weight: 1.0, pass: input.hasBuildingPlan, severity: 'critical', applicable: true,
      detail: input.hasBuildingPlan ? 'On file ✓' : 'Missing — signed plan from licensed professional' },
    { label: 'Structural certificate', weight: 1.0, pass: input.hasStructuralCalc, severity: 'high', applicable: true,
      detail: input.hasStructuralCalc ? 'On file ✓' : 'Missing — stamped by structural engineer' },
    { label: 'Soil test', weight: 0.6, pass: input.hasSoilTest, severity: 'medium', applicable: true,
      detail: input.hasSoilTest ? 'On file ✓' : 'Missing — required for foundation design' },
    { label: 'Licensed engineer', weight: 1.1, pass: input.licensedEngineer, severity: 'critical', applicable: true,
      detail: input.licensedEngineer ? 'DTCP/CMDA licensed ✓' : 'Unlicensed drawings — rejected at intake' },

    { label: 'Fire NOC', weight: 1.0, pass: input.hasFireNOC, severity: 'critical', applicable: needsFireNOC,
      detail: input.hasFireNOC ? 'Obtained ✓' : 'Required — height > 15 m' },
    { label: 'Airport (AAI) NOC', weight: 0.5, pass: false, severity: 'critical', applicable: needsAirportNOC,
      detail: 'Required — inside airport funnel' },
    { label: 'CRZ clearance', weight: 0.6, pass: false, severity: 'critical', applicable: needsCRZNOC,
      detail: 'Required — coastal regulation zone' },
  ].filter((c) => c.applicable);

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const passWeight = checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
  const ratio = totalWeight > 0 ? passWeight / totalWeight : 0;
  const z = (ratio - 0.5) * SHARPNESS;
  const probability = Math.round(sigmoid(z) * 100);

  const factors: PredictionFactor[] = checks.map((c) => {
    const flip = c.pass ? -c.weight : c.weight;
    const newRatio = (passWeight + flip) / totalWeight;
    const newZ = (newRatio - 0.5) * SHARPNESS;
    const delta = Math.round((sigmoid(newZ) - sigmoid(z)) * 100);
    return {
      label: c.label, pass: c.pass, impact: delta, detail: c.detail, severity: c.severity,
    };
  });
  factors.sort((a, b) => a.impact - b.impact);

  const verdict = probability >= 80 ? 'ready'
    : probability >= 60 ? 'likely'
    : probability >= 40 ? 'at_risk'
    : 'high_risk';

  const knownCount = checks.filter((c) => c.pass).length;
  const confidence = ratio >= 0.75 || ratio <= 0.25 ? 'high' : ratio >= 0.55 || ratio <= 0.45 ? 'medium' : 'low';

  return {
    probability, confidence, verdict, factors,
    estimatedCorrections: factors.filter((f) => !f.pass).length,
    requiredFrontSetback: reqFront,
    requiredRearSetback: reqRear,
    requiredSideSetback: reqSide,
    requiredHeightLimit: reqHeight,
    fsi, coverage,
    jurisdictionLabel: jLabel,
    needsFireNOC, needsAirportNOC, needsCRZNOC,
  };
}
