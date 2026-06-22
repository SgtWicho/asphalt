import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { darkMapStyle } from '../theme/mapStyle';
import { fonts } from '../theme/typography';
import { GpsBarsIcon, PlayIcon, PauseIcon, AddPoiIcon, MotoIcon } from '../components/Icons';
import { useRouteRecorder } from '../hooks/useRouteRecorder';

function fmt(t: number) {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export default function GrabarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const rec = useRouteRecorder();
  const mapRef = useRef<MapView>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  useEffect(() => {
    const last = rec.path[rec.path.length - 1];
    if (last) mapRef.current?.animateCamera({ center: last }, { duration: 500 });
  }, [rec.path]);

  const onRecordPress = async () => {
    if (!rec.recording) {
      await rec.start();
    } else {
      rec.stop();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.mapWrap}>
        {initialRegion && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            customMapStyle={darkMapStyle}
            showsMyLocationButton={false}
          >
            {rec.path.length > 1 && (
              <>
                <Polyline coordinates={rec.path} strokeColor="rgba(249,168,37,.25)" strokeWidth={14} />
                <Polyline coordinates={rec.path} strokeColor={colors.amber} strokeWidth={6} />
              </>
            )}
            {rec.path.length > 0 && (
              <Marker coordinate={rec.path[0]} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.startMarker} />
              </Marker>
            )}
            {initialRegion && (
              <Marker
                coordinate={rec.path[rec.path.length - 1] ?? { latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
                anchor={{ x: 0.5, y: 0.5 }}
                flat
              >
                <View style={[styles.motoMarker, { transform: [{ rotate: `${rec.heading}deg` }] }]}>
                  <MotoIcon size={26} color={colors.amber} />
                </View>
              </Marker>
            )}
          </MapView>
        )}

        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
            <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        <View style={styles.gpsBadge}>
          <GpsBarsIcon />
          <Text style={styles.gpsText}>{rec.recording && !rec.paused ? 'GPS activo' : 'GPS en espera'}</Text>
        </View>

        {rec.errorMsg && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{rec.errorMsg}</Text>
          </View>
        )}
      </View>

      <View style={styles.panel}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{fmt(rec.elapsed)}</Text>
            <Text style={styles.statLabel}>Tiempo</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>
              {rec.distanceKm.toFixed(1)}
              <Text style={styles.statUnit}> km</Text>
            </Text>
            <Text style={styles.statLabel}>Distancia</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>
              {Math.round(rec.speedKmh)}
              <Text style={styles.statUnit}> km/h</Text>
            </Text>
            <Text style={styles.statLabel}>Velocidad</Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <Pressable
            style={[styles.sideBtn, !rec.recording && styles.sideBtnDisabled]}
            disabled={!rec.recording}
            onPress={() => (rec.paused ? rec.resume() : rec.pause())}
          >
            {rec.paused ? <PlayIcon /> : <PauseIcon />}
          </Pressable>

          <Pressable style={styles.recordBtn} onPress={onRecordPress}>
            {rec.recording && (
              <View style={styles.recordPulse} />
            )}
            {rec.recording ? <View style={styles.stopSquare} /> : <View style={styles.recordDot} />}
          </Pressable>

          <Pressable
            style={[styles.sideBtn, styles.poiBtn, !rec.recording && styles.sideBtnDisabled]}
            disabled={!rec.recording}
            onPress={rec.addPoi}
          >
            <AddPoiIcon />
          </Pressable>
        </View>
        {rec.poiCount > 0 && <Text style={styles.poiCount}>{rec.poiCount} puntos de interés añadidos</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { flex: 1, backgroundColor: '#191820' },
  map: { flex: 1 },
  startMarker: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#191820', borderWidth: 3.5, borderColor: '#f5f5f5' },
  motoMarker: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(24,23,28,.85)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.amber },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  gpsBadge: { position: 'absolute', top: 60, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20, backgroundColor: 'rgba(24,23,28,.7)' },
  gpsText: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.textPrimary },
  errorBanner: { position: 'absolute', top: 112, left: 20, right: 20, padding: 12, borderRadius: 12, backgroundColor: 'rgba(211,47,47,.18)', borderWidth: 1, borderColor: 'rgba(211,47,47,.4)' },
  errorText: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: '#ff8a80', textAlign: 'center' },
  panel: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 22, paddingBottom: 38, paddingHorizontal: 24, gap: 22 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 34, backgroundColor: colors.borderSoft },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.textPrimary },
  statUnit: { fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textSecondary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 5 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22 },
  sideBtn: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  sideBtnDisabled: { opacity: 0.4 },
  poiBtn: { backgroundColor: colors.amberSoft },
  recordBtn: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.red, borderWidth: 5, borderColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  recordDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff' },
  stopSquare: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#fff' },
  recordPulse: { position: 'absolute', width: 104, height: 104, borderRadius: 52, borderWidth: 2, borderColor: colors.red },
  poiCount: { textAlign: 'center', fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.amber },
});
