import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'asphalt-background-location';

type LocationListener = (locations: Location.LocationObject[]) => void;

let listener: LocationListener | null = null;

export function setLocationTaskListener(cb: LocationListener | null) {
  listener = cb;
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return;
  const { locations } = (data ?? {}) as { locations?: Location.LocationObject[] };
  if (locations && listener) listener(locations);
});
