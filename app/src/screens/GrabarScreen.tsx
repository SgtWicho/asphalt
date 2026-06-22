import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { GpsBarsIcon, PlayIcon, PauseIcon, AddPoiIcon } from '../components/Icons';
import { useRouteRecorder, TrackPoint } from '../hooks/useRouteRecorder';

function fmt(t: number) {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function pathToSvg(path: TrackPoint[]) {
  if (path.length < 2) return null;
  const lats = path.map((p) => p.latitude);
  const lons = path.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const w = 360;
  const h = 480;
  const pad = 30;
  const spanLat = maxLat - minLat || 1e-6;
  const spanLon = maxLon - minLon || 1e-6;
  const scale = Math.min((w - pad * 2) / spanLon, (h - pad * 2) / spanLat);
  const project = (p: TrackPoint) => {
    const x = pad + (p.longitude - minLon) * scale;
    const y = h - pad - (p.latitude - minLat) * scale;
    return { x, y };
  };
  const pts = path.map(project);
  const d = pts.reduce((acc, p, i) => acc + (i === 0 ? `M${p.x},${p.y}` : ` L${p.x},${p.y}`), '');
  return { d, start: pts[0], end: pts[pts.length - 1] };
}

export default function GrabarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const rec = useRouteRecorder();
  const svgPath = useMemo(() => pathToSvg(rec.path), [rec.path]);

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
        <Svg width="100%" height="100%" viewBox="0 0 360 480">
          <Path
            d="M0,60 H360 M0,140 H360 M0,220 H360 M0,300 H360 M0,380 H360 M60,0 V480 M120,0 V480 M180,0 V480 M240,0 V480 M300,0 V480"
            stroke="rgba(255,255,255,.045)"
          />
          {svgPath && (
            <>
              <Path d={svgPath.d} fill="none" stroke="rgba(249,168,37,.25)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
              <Path d={svgPath.d} fill="none" stroke={colors.amber} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={svgPath.start.x} cy={svgPath.start.y} r={9} fill="#191820" stroke="#f5f5f5" strokeWidth={3.5} />
              <Circle cx={svgPath.end.x} cy={svgPath.end.y} r={9.5} fill={colors.red} stroke="#191820" strokeWidth={3.5} />
            </>
          )}
        </Svg>

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
