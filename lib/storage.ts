import type { ProjectInput, PredictionResult } from './types';

const INPUT_KEY = 'tn-permit-input-v1';
const RESULT_KEY = 'tn-permit-result-v1';

export function saveInput(input: ProjectInput) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(INPUT_KEY, JSON.stringify(input));
}

export function loadInput(): ProjectInput | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(INPUT_KEY);
  return raw ? (JSON.parse(raw) as ProjectInput) : null;
}

export function saveResult(result: PredictionResult) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function loadResult(): PredictionResult | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(RESULT_KEY);
  return raw ? (JSON.parse(raw) as PredictionResult) : null;
}

export function clearAll() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(INPUT_KEY);
  sessionStorage.removeItem(RESULT_KEY);
}
