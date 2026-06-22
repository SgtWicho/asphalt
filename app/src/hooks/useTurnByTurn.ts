import { navSteps, navSummary } from '../data/mock';

export function useTurnByTurn() {
  return { steps: navSteps, summary: navSummary };
}
