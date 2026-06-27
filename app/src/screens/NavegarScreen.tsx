import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { darkMapStyle } from '../theme/mapStyle';
import { fonts } from '../theme/typography';

const ORIGIN = { latitude: 18.4655, longitude: -66.1057 };
const DESTINATION = { latitude: 18.2013, longitude: -66.0336 };

function fmtDuration(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h} h ${rem} min`;
}

export default function NavegarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [distanceM, setDistanceM] = useState<number | null>(null);
  const [durationS, setDurationS] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const apiKey = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${ORIGIN.latitude},${ORIGIN.longitude}:${DESTINATION.latitude},${DESTINATION.longitude}/json?key=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error de red (${res.status})`);
        const data = await res.json();
        const route = data?.routes?.[0];
        if (!route) throw new Error('No se encontró una ruta');

        const points: LatLng[] = route.legs[0].points.map((p: { latitude: number; longitude: number }) => ({
          latitude: p.latitude,
          longitude: p.longitude,
        }));
        setRoutePoints(points);
        setDistanceM(route.summary.lengthInMeters);
        setDurationS(route.summary.travelTimeInSeconds);

        if (points.length > 0) {
          setTimeout(() => {
            mapRef.current?.fitToCoordinates(points, {
              edgePadding: { top: 80, right: 60, bottom: 220, left: 60 },
              animated: true,
            });
          }, 300);
        }
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : 'No se pudo calcular la ruta');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={darkMapStyle}
          showsMyLocationButton={false}
          initialRegion={{
            latitude: (ORIGIN.latitude + DESTINATION.latitude) / 2,
            longitude: (ORIGIN.longitude + DESTINATION.longitude) / 2,
            latitudeDelta: 0.6,
            longitudeDelta: 0.6,
          }}
        >
          {routePoints.length > 1 && (
            <>
              <Polyline coordinates={routePoints} strokeColor="rgba(249,168,37,.25)" strokeWidth={14} />
              <Polyline coordinates={routePoints} strokeColor={colors.amber} strokeWidth={6} />
            </>
          )}

          <Marker coordinate={ORIGIN} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.startMarker} />
          </Marker>
          <Marker coordinate={DESTINATION} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.endMarker} />
          </Marker>
        </MapView>

        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
            <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        {errorMsg && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
      </View>

      <View style={styles.panel}>
        {loading ? (
          <Text style={styles.loadingText}>Calculando ruta…</Text>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>
                {distanceM != null ? (distanceM / 1000).toFixed(1) : '--'}
                <Text style={styles.statUnit}> km</Text>
              </Text>
              <Text style={styles.statLabel}>Distancia</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{durationS != null ? fmtDuration(durationS) : '--'}</Text>
              <Text style={styles.statLabel}>Tiempo estimado</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { flex: 1, backgroundColor: '#191820' },
  map: { flex: 1 },
  startMarker: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#191820', borderWidth: 3.5, borderColor: '#f5f5f5' },
  endMarker: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#191820', borderWidth: 3.5, borderColor: colors.amber },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  errorBanner: { position: 'absolute', top: 112, left: 20, right: 20, padding: 12, borderRadius: 12, backgroundColor: 'rgba(211,47,47,.18)', borderWidth: 1, borderColor: 'rgba(211,47,47,.4)' },
  errorText: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: '#ff8a80', textAlign: 'center' },
  panel: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 22, paddingBottom: 38, paddingHorizontal: 24, gap: 22, minHeight: 110 },
  loadingText: { fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 34, backgroundColor: colors.borderSoft },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.textPrimary },
  statUnit: { fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textSecondary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 5 },
});
