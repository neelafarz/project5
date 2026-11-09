// Scoring rules. The one place that decides how many points a pick earns.
// Both engines use this file (see spec.md, Structure rules).

export const STEP_MS = 10000; // time allowed for each pick
export const FULL_SCORE_MS = 2000; // a pick this fast earns full points
export const MAX_STEP_POINTS = 10;

// Points for a correct pick made `elapsedMs` after the step began:
// full points in the first 2 seconds, then the whole seconds left, 0 at timeout.
export function stepPoints(elapsedMs) {
  if (elapsedMs >= STEP_MS) return 0;
  if (elapsedMs <= FULL_SCORE_MS) return MAX_STEP_POINTS;
  return Math.floor((STEP_MS - elapsedMs) / 1000);
}

// Final score out of 100, whatever the number of timed steps.
export function finalScore(pointsPerStep) {
  if (pointsPerStep.length === 0) return 0;
  const total = pointsPerStep.reduce((sum, p) => sum + p, 0);
  return Math.round((total / (MAX_STEP_POINTS * pointsPerStep.length)) * 100);
}
