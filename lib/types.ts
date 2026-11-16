export type AuthorityType = 'CMDA' | 'Corporation' | 'Municipality' | 'TownPanchayat' | 'DTCP';

export interface JurisdictionOption {
  value: string;
  label: string;
  type: AuthorityType;
  district: string;
  group: string;
}

export type PermitType =
  | 'single_family' | 'adu' | 'addition' | 'commercial_ti'
  | 'layout_approval' | 'occupancy_certificate';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface ProjectInput {
  jurisdiction: string;
  permitType: PermitType;
  plotAreaSqft: number;
  builtUpAreaSqft: number;
  roadWidthM: number;
  stories: number;
  heightFt: number;
  frontSetbackFt: number;
  rearSetbackFt: number;
  sideSetbackFt: number;
  hasPatta: boolean;
  hasChitta: boolean;
  hasEC: boolean;
  hasFMB: boolean;
  hasSurveySketch: boolean;
  hasParentDoc: boolean;
  hasSaleDeed: boolean;
  hasTaxReceipt: boolean;
  hasSitePlan: boolean;
  hasBuildingPlan: boolean;
  hasStructuralCalc: boolean;
  hasSoilTest: boolean;
  licensedEngineer: boolean;
  hasParking: boolean;
  isCRZ: boolean;
  isNearAirport: boolean;
  hasFireNOC: boolean;
}

export interface PredictionFactor {
  label: string;
  pass: boolean;
  impact: number;
  detail: string;
  severity: Severity;
}

export interface PredictionResult {
  probability: number;
  confidence: 'low' | 'medium' | 'high';
  verdict: 'ready' | 'likely' | 'at_risk' | 'high_risk';
  factors: PredictionFactor[];
  estimatedCorrections: number;
  requiredFrontSetback: number;
  requiredRearSetback: number;
  requiredSideSetback: number;
  requiredHeightLimit: number;
  fsi: number;
  coverage: number;
  jurisdictionLabel: string;
  needsFireNOC: boolean;
  needsAirportNOC: boolean;
  needsCRZNOC: boolean;
}
