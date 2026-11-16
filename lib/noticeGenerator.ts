import type { ProjectInput, PredictionResult, PredictionFactor } from './types';
import { getJurisdiction } from './tnJurisdictions';

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const AUTHORITY_CODE: Record<string, string> = {
  CMDA: 'CMDA', Corporation: 'GCC', Municipality: 'MUN',
  TownPanchayat: 'TP', DTCP: 'DTCP',
};

const PERMIT_CODE: Record<string, string> = {
  single_family: 'BP/RES', adu: 'BP/ADU', addition: 'BP/ADD',
  commercial_ti: 'BP/COM', layout_approval: 'LP', occupancy_certificate: 'OC',
};

function objectionLanguage(f: PredictionFactor, input: ProjectInput): string {
  const label = f.label.toLowerCase();
  if (label.includes('front setback'))
    return `The proposed building is set back at ${input.frontSetbackFt.toFixed(1)} ft from the front boundary line, whereas the minimum front setback required under Rule 35 of TNCDBR 2019 for the abutting road width of ${input.roadWidthM} m is greater. The plan shall be revised to comply, or relaxation under Rule 55 shall be sought with due justification.`;
  if (label.includes('rear setback'))
    return `The rear setback provided (${input.rearSetbackFt.toFixed(1)} ft) falls short of the minimum prescribed for the proposed building height under Rule 36 of TNCDBR 2019. Revised plan with compliant rear open space is required.`;
  if (label.includes('side setback'))
    return `The side setback provided (${input.sideSetbackFt.toFixed(1)} ft) does not satisfy the minimum prescribed under Rule 36 for the proposed building height. Both flanks shall be revised to comply.`;
  if (label.includes('fsi'))
    return `The Floor Space Index computed for the proposal exceeds the permissible FSI for the ${getJurisdiction(input.jurisdiction)?.type ?? 'authority'}. The total built-up area shall be reduced so that the FSI falls within limits before further processing.`;
  if (label.includes('coverage'))
    return `The proposed ground coverage exceeds the maximum permitted for this authority. The footprint shall be reduced, or the open area increased, to bring coverage within limits.`;
  if (label.includes('height'))
    return `The proposed building height exceeds 15 m. A No Objection Certificate from the Tamil Nadu Fire and Rescue Services Department is mandatory before the building licence can be issued.`;
  if (label.includes('parking'))
    return `Adequate vehicular parking has not been indicated in the submitted plan. One Equivalent Car Space (ECS) per 100 sqm of built-up area shall be shown, with access and turning radius marked.`;
  if (label.includes('patta'))
    return `The Patta / Chitta in respect of the subject property has not been furnished. The same shall be produced as proof of lawful ownership before the application is processed further.`;
  if (label.includes('chitta'))
    return `The Chitta extract (revenue record) has not been furnished. The applicant shall obtain the current Chitta from the Taluk Office and submit the same.`;
  if (label.includes('ec'))
    return `The Encumbrance Certificate covering a period of not less than thirty (30) years has not been furnished. The same shall be obtained from the Sub-Registrar's office and produced.`;
  if (label.includes('fmb'))
    return `The Field Measurement Book (FMB) sketch has not been submitted. The applicant shall obtain the FMB sketch from the Taluk Survey Office and produce the same.`;
  if (label.includes('survey'))
    return `A survey sketch certified by a licensed land surveyor has not been furnished. The applicant shall submit the survey sketch showing the plot boundaries and abutting road.`;
  if (label.includes('parent'))
    return `The parent document establishing the thirty-year title chain has not been furnished. The same shall be produced for verification.`;
  if (label.includes('sale deed'))
    return `The registered sale deed in favour of the applicant has not been produced. The same shall be submitted as proof of transfer of title.`;
  if (label.includes('tax receipt'))
    return `The latest property tax receipt for the subject property has not been furnished. The same shall be submitted along with the revised application.`;
  if (label.includes('site plan'))
    return `A scaled site plan showing the plot boundaries, abutting road width, and proposed setbacks has not been furnished. The same shall be prepared and submitted in the prescribed format.`;
  if (label.includes('building plan'))
    return `A building plan drawn to scale and signed by a licensed architect/engineer/surveyor registered with the competent authority has not been furnished. The plan shall be submitted in the prescribed form with the professional's seal and signature.`;
  if (label.includes('structural'))
    return `A structural stability certificate stamped and signed by a qualified structural engineer has not been furnished. The same shall be produced.`;
  if (label.includes('soil'))
    return `The soil test report for the site, from an approved laboratory, has not been furnished. The same shall be submitted to enable assessment of the foundation design.`;
  if (label.includes('licensed engineer'))
    return `The drawings submitted are not signed by a professional licensed by the competent authority (CMDA / DTCP). The application is liable to be rejected at intake. Revised drawings with the professional's seal and licence number shall be submitted.`;
  if (label.includes('fire noc'))
    return `The No Objection Certificate from the Tamil Nadu Fire and Rescue Services Department has not been obtained. The same is mandatory for the proposed building height and must be produced.`;
  if (label.includes('airport'))
    return `The No Objection Certificate from the Airports Authority of India is required as the site falls within the airport funnel zone. The same shall be obtained before the licence is issued.`;
  if (label.includes('crz'))
    return `The site falls within the Coastal Regulation Zone. Clearance from the Tamil Nadu Coastal Zone Management Authority is required under CRZ Notification 2019 before the application can be considered.`;
  return f.detail;
}

export interface NoticeData {
  referenceNumber: string;
  date: string;
  authority: string;
  authorityCode: string;
  subject: string;
  objections: { number: number; severity: PredictionFactor['severity']; body: string }[];
  estimatedDelayWeeks: [number, number];
  estimatedDelayMonths: [number, number];
  totalObjections: number;
  criticalCount: number;
  resubmissionNote: string;
}

export function generateNotice(input: ProjectInput, result: PredictionResult): NoticeData {
  const j = getJurisdiction(input.jurisdiction);
  const authCode = AUTHORITY_CODE[j?.type ?? 'DTCP'] ?? 'TN';
  const permitCode = PERMIT_CODE[input.permitType] ?? 'BP';
  const seed = hash(
    `${input.plotAreaSqft}-${input.builtUpAreaSqft}-${input.roadWidthM}-${input.frontSetbackFt}-${input.rearSetbackFt}-${input.sideSetbackFt}`
  );
  const refSuffix = String(seed % 999999).padStart(6, '0');
  const referenceNumber = `${authCode}/${permitCode}/${new Date().getFullYear()}/${refSuffix}`;

  const today = new Date();
  const date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  const failing = result.factors.filter((f) => !f.pass);
  const objections = failing.map((f, i) => ({
    number: i + 1,
    severity: f.severity,
    body: objectionLanguage(f, input),
  }));

  // Delay estimate
  const base = result.verdict === 'ready' ? 4 : result.verdict === 'likely' ? 6 : result.verdict === 'at_risk' ? 10 : 14;
  const criticals = failing.filter((f) => f.severity === 'critical').length;
  const highs = failing.filter((f) => f.severity === 'high').length;
  const nocs = (result.needsFireNOC ? 4 : 0) + (result.needsAirportNOC ? 3 : 0) + (result.needsCRZNOC ? 8 : 0);
  const minWeeks = base + criticals * 2 + highs * 1 + nocs;
  const maxWeeks = Math.round(minWeeks * 1.6);
  const estimatedDelayWeeks: [number, number] = [minWeeks, maxWeeks];
  const estimatedDelayMonths: [number, number] = [
    Math.round((minWeeks / 4.3) * 10) / 10,
    Math.round((maxWeeks / 4.3) * 10) / 10,
  ];

  const subject = `Objections to Building Licence Application — ${j?.label ?? 'TN Local Body'} — Ref. ${referenceNumber}`;

  const resubmissionNote = objections.length === 0
    ? 'No objections raised. The application is recommended for approval and shall proceed to licence issuance.'
    : `The applicant is directed to submit a revised application addressing the above ${objections.length} objection${objections.length === 1 ? '' : 's'} within thirty (30) days from the date of this notice, failing which the application shall be deemed closed and a fresh application shall be required.`;

  return {
    referenceNumber, date,
    authority: j?.label ?? 'Local Planning Authority',
    authorityCode: authCode,
    subject, objections,
    estimatedDelayWeeks, estimatedDelayMonths,
    totalObjections: objections.length,
    criticalCount: criticals,
    resubmissionNote,
  };
}
