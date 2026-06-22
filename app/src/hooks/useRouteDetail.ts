import { routeDetail } from '../data/mock';

export function useRouteDetail(_routeId?: string) {
  return { route: routeDetail };
}
