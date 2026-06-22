import { useCallback, useRef, useState } from 'react';
import * as Location from 'expo-location';

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

export function useRouteRecorder() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [poiCount, setPoiCount] = useState(0);
  const [path, setPath] = useState<TrackPoint[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPointRef = useRef<TrackPoint | null>(null);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopWatch = () => {
    subRef.current?.remove();
    subRef.current = null;
  };

  const start = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permiso de ubicación denegado');
      return false;
    }
    setErrorMsg(null);
    setElapsed(0);
    setDistanceM(0);
    setSpeedKmh(0);
    setPoiCount(0);
    setPath([]);
    lastPointRef.current = null;

    subRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
      (loc) => {
        const point: TrackPoint = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        const speed = loc.coords.speed ?? 0;
        setSpeedKmh(speed > 0 ? speed * 3.6 : 0);
        if (lastPointRef.current) {
          const d = haversine(lastPointRef.current, point);
          if (d > 1) setDistanceM((prev) => prev + d);
        }
        lastPointRef.current = point;
        setPath((prev) => [...prev, point]);
      }
    );

    timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    setRecording(true);
    setPaused(false);
    return true;
  }, []);

  const pause = useCallback(() => {
    stopTimer();
    stopWatch();
    setPaused(true);
  }, []);

  const resume = useCallback(async () => {
    subRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
      (loc) => {
        const point: TrackPoint = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        const speed = loc.coords.speed ?? 0;
        setSpeedKmh(speed > 0 ? speed * 3.6 : 0);
        if (lastPointRef.current) {
          const d = haversine(lastPointRef.current, point);
          if (d > 1) setDistanceM((prev) => prev + d);
        }
        lastPointRef.current = point;
        setPath((prev) => [...prev, point]);
      }
    );
    timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    setPaused(false);
  }, []);

  const stop = useCallback(() => {
    stopTimer();
    stopWatch();
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
    start,
    pause,
    resume,
    stop,
    addPoi,
  };
}
