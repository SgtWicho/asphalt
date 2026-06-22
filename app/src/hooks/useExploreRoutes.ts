import { exploreRoutes, exploreFilters } from '../data/mock';

export function useExploreRoutes() {
  return { routes: exploreRoutes, filters: exploreFilters };
}
