import { useState } from 'react';
import { plannerDefs, RouteStyleKey } from '../data/mock';

export function usePlanner() {
  const [style, setStyle] = useState<RouteStyleKey>('curvas');
  return { style, setStyle, plan: plannerDefs[style], styles: plannerDefs };
}
