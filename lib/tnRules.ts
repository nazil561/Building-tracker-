// Tamil Nadu Combined Development & Building Rules, 2019
export const FT_TO_M = 0.3048;
export const SQM_TO_SQFT = 10.7639;
export const SQFT_TO_SQM = 0.092903;

/** Front setback by abutting road width — TNCDBR 2019 Rule 35 */
export function requiredFrontSetback(roadWidthM: number): number {
  if (roadWidthM <= 9) return 1.5;
  if (roadWidthM <= 18) return 3.0;
  if (roadWidthM <= 30.5) return 4.5;
  return 6.0;
}

/** Rear setback by building height — TNCDBR 2019 Rule 36 */
export function requiredRearSetback(heightM: number): number {
  if (heightM <= 7) return 1.5;
  if (heightM <= 12) return 2.0;
  if (heightM <= 15) return 3.0;
  return 4.0;
}

/** Side setback by building height — TNCDBR 2019 Rule 36 */
export function requiredSideSetback(heightM: number): number {
  if (heightM <= 7) return 1.0;
  if (heightM <= 12) return 1.5;
  if (heightM <= 15) return 2.0;
  return 2.5;
}

/** Max Floor Space Index for residential — varies by city, TNCDBR 2019 base */
export function maxFSI(jurisdictionType: string): number {
  if (jurisdictionType === 'CMDA') return 2.0;
  if (jurisdictionType === 'Corporation') return 2.0;
  if (jurisdictionType === 'Municipality') return 1.75;
  if (jurisdictionType === 'TownPanchayat') return 1.5;
  return 1.5;
}

/** Max ground coverage — TNCDBR 2019 */
export function maxCoverage(jurisdictionType: string): number {
  if (jurisdictionType === 'CMDA') return 65;
  if (jurisdictionType === 'Corporation') return 70;
  if (jurisdictionType === 'Municipality') return 70;
  return 75;
}

/** Height limit before Fire NOC required — TNCDBR 2019 */
export const FIRE_NOC_HEIGHT_M = 15;

/** Basement allowed only if plot area > 300 sqm */
export const BASEMENT_MIN_PLOT_SQM = 300;

/** Required parking: 1 ECS per 100 sqm built-up (residential) */
export function requiredParkingECs(builtUpSqm: number): number {
  return Math.ceil(builtUpSqm / 100);
}
