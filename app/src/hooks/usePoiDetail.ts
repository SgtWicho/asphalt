import { poiDetail } from '../data/mock';

export function usePoiDetail(_poiId?: string) {
  return { poi: poiDetail };
}
