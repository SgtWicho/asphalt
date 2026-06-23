import { useCallback, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { LOCATION_TASK_NAME, setLocationTaskListener } from '../tasks/locationTask';

export type TrackPoint = { latitude: number; longitude: number };

function haversine(a: TrackPoint, b: TrackPoint) {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const locationTaskOptions: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.High,
  timeInterval: 1000,
  distanceInterval: 5,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: 'Grabando ruta',
    notificationBody: 'AsphaltApp está registrando tu ruta en segundo plano',
  },
};

export function useRouteRecorder() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [poiCount, setPoiCount] = useState(0);
  const [path, setPath] = useState<TrackPoint[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [heading, setHeading] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPointRef = useRef<TrackPoint | null>(null);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
  };

  const processLocations = useCallback((locations: Location.LocationObject[]) => {
    for (const loc of locations) {
      const point: TrackPoint = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      const speed = loc.coords.speed ?? 0;
      setSpeedKmh(speed > 0 ? speed * 3.6 : 0);
      if (loc.coords.heading != null && loc.coords.heading >= 0) setHeading(loc.coords.heading);
      if (lastPointRef.current) {
        const d = haversine(lastPointRef.current, point);
        if (d > 1) setDistanceM((prev) => prev + d);
      }
      lastPointRef.current = point;
      setPath((prev) => [...prev, point]);
    }
  }, []);

  const stopLocationTask = async () => {
    setLocationTaskListener(null);
    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  };

  const start = useCallback(async () => {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== 'granted') {
      setErrorMsg('Permiso de ubicación denegado');
      return false;
    }
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    setErrorMsg(
      bgStatus !== 'granted' ? 'Activa "Permitir siempre" en ajustes para grabar con la pantalla apagada' : null
    );

    setElapsed(0);
    setDistanceM(0);
    setSpeedKmh(0);
    setPoiCount(0);
    setPath([]);
    lastPointRef.current = null;

    setLocationTaskListener(processLocations);
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, locationTaskOptions);

    startTimer();
    setRecording(true);
    setPaused(false);
    return true;
  }, [processLocations]);

  const pause = useCallback(async () => {
    stopTimer();
    await stopLocationTask();
    setPaused(true);
  }, []);

  const resume = useCallback(async () => {
    setLocationTaskListener(processLocations);
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, locationTaskOptions);
    startTimer();
    setPaused(false);
  }, [processLocations]);

  const stop = useCallback(async () => {
    stopTimer();
    await stopLocationTask();
    setRecording(false);
    setPaused(false);
  }, []);

  const addPoi = useCallback(() => setPoiCount((c) => c + 1), []);

  return {
    recording,
    paused,
    elapsed,
    distanceKm: distanceM / 1000,
    speedKmh,
    poiCount,
    path,
    errorMsg,
    heading,
    start,
    pause,
    resume,
    stop,
    addPoi,
  };
}
