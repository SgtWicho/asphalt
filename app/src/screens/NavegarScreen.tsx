import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, FlatList, ActivityIndicator, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MapView, { Marker, Polyline, LatLng, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { darkMapStyle } from '../theme/mapStyle';
import { fonts } from '../theme/typography';
import { PinFillIcon, SearchIcon } from '../components/Icons';

type Point = {
  label: string;
  coordinate: LatLng;
};

type Suggestion = {
  id: string;
  name: string;
  municipality: string;
  coordinate: LatLng;
};

type FieldKey = 'from' | 'to';

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
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [from, setFrom] = useState<Point | null>(null);
  const [to, setTo] = useState<Point | null>(null);
  const [activeField, setActiveField] = useState<FieldKey | null>(null);

  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');

  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [distanceM, setDistanceM] = useState<number | null>(null);
  const [durationS, setDurationS] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (from && to) {
      calculateRoute(from.coordinate, to.coordinate);
    } else {
      setRoutePoints([]);
      setDistanceM(null);
      setDurationS(null);
    }
  }, [from, to]);

  const calculateRoute = async (fromCoord: LatLng, toCoord: LatLng) => {
    try {
      setLoadingRoute(true);
      setErrorMsg(null);
      setRoutePoints([]);
      const apiKey = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${fromCoord.latitude},${fromCoord.longitude}:${toCoord.latitude},${toCoord.longitude}/json?key=${apiKey}`;
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
            edgePadding: { top: 220, right: 60, bottom: 220, left: 60 },
            animated: true,
          });
        }, 300);
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'No se pudo calcular la ruta');
    } finally {
      setLoadingRoute(false);
    }
  };

  const runSearch = (text: string) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (text.trim().length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const apiKey = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;
        const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?key=${apiKey}&limit=5`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error de red (${res.status})`);
        const data = await res.json();
        const results: Suggestion[] = (data?.results ?? []).map((r: any, idx: number) => ({
          id: r.id ?? String(idx),
          name: r.poi?.name ?? r.address?.freeformAddress ?? 'Lugar sin nombre',
          municipality: r.address?.municipality ?? r.address?.countrySubdivision ?? '',
          coordinate: { latitude: r.position.lat, longitude: r.position.lon },
        }));
        setSuggestions(results);
      } catch {
        setErrorMsg('No se pudo buscar el lugar');
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const onChangeFieldText = (field: FieldKey, text: string) => {
    if (field === 'from') setFromText(text);
    else setToText(text);
    setActiveField(field);
    runSearch(text);
  };

  const onFocusField = (field: FieldKey) => {
    setActiveField(field);
    setSuggestions([]);
  };

  const assignPoint = (field: FieldKey, point: Point) => {
    if (field === 'from') {
      setFrom(point);
      setFromText(point.label);
    } else {
      setTo(point);
      setToText(point.label);
    }
    setSuggestions([]);
  };

  const onSelectSuggestion = (s: Suggestion) => {
    if (!activeField) return;
    assignPoint(activeField, { label: s.name, coordinate: s.coordinate });
  };

  const onUseMyLocation = async (field: FieldKey) => {
    try {
      setLoadingLocation(true);
      setErrorMsg(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se necesita permiso de ubicación');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      assignPoint(field, {
        label: 'Mi ubicación actual',
        coordinate: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
      });
    } catch {
      setErrorMsg('No se pudo obtener tu ubicación actual');
    } finally {
      setLoadingLocation(false);
    }
  };

  const onMapPress = (e: MapPressEvent) => {
    if (!activeField) return;
    const coordinate = e.nativeEvent.coordinate;
    assignPoint(activeField, { label: 'Punto en el mapa', coordinate });
  };

  const onSwap = () => {
    const prevFrom = from;
    const prevFromText = fromText;
    setFrom(to);
    setFromText(toText);
    setTo(prevFrom);
    setToText(prevFromText);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={darkMapStyle}
          showsMyLocationButton={false}
          showsUserLocation
          onPress={onMapPress}
          initialRegion={{
            latitude: 18.2208,
            longitude: -66.5901,
            latitudeDelta: 1.2,
            longitudeDelta: 1.2,
          }}
        >
          {routePoints.length > 1 && (
            <>
              <Polyline coordinates={routePoints} strokeColor="rgba(249,168,37,.25)" strokeWidth={14} />
              <Polyline coordinates={routePoints} strokeColor={colors.amber} strokeWidth={6} />
            </>
          )}

          {from && (
            <Marker coordinate={from.coordinate} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.startMarker} />
            </Marker>
          )}
          {to && (
            <Marker coordinate={to.coordinate} anchor={{ x: 0.5, y: 1 }}>
              <Image source={require('../../assets/destino_pin.png')} style={styles.destinoPin} resizeMode="contain" />
            </Marker>
          )}
        </MapView>

        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
            <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        <View style={styles.panelTop}>
          <View style={styles.fieldsRow}>
            <View style={styles.connectorCol}>
              <View style={styles.connectorDot} />
              <View style={styles.connectorLine} />
              <PinFillIcon size={14} color={colors.amber} />
            </View>

            <View style={styles.fieldsCol}>
              <View style={[styles.fieldBox, activeField === 'from' && styles.fieldBoxActive]}>
                <TextInput
                  value={fromText}
                  onChangeText={(t) => onChangeFieldText('from', t)}
                  onFocus={() => onFocusField('from')}
                  placeholder="Desde"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.fieldInput}
                />
                <Pressable onPress={() => onUseMyLocation('from')} style={styles.locationBtn}>
                  {loadingLocation && activeField === 'from' ? (
                    <ActivityIndicator size="small" color={colors.amber} />
                  ) : (
                    <Ionicons name="locate" size={16} color={colors.amber} />
                  )}
                </Pressable>
              </View>

              <View style={styles.fieldDivider} />

              <View style={[styles.fieldBox, activeField === 'to' && styles.fieldBoxActive]}>
                <TextInput
                  value={toText}
                  onChangeText={(t) => onChangeFieldText('to', t)}
                  onFocus={() => onFocusField('to')}
                  placeholder="Hasta"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.fieldInput}
                />
                <Pressable onPress={() => onUseMyLocation('to')} style={styles.locationBtn}>
                  {loadingLocation && activeField === 'to' ? (
                    <ActivityIndicator size="small" color={colors.amber} />
                  ) : (
                    <Ionicons name="locate" size={16} color={colors.amber} />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.swapBtn} onPress={onSwap}>
              <Ionicons name="swap-vertical" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>

          {activeField && (
            <Text style={styles.hintText}>
              {searching ? 'Buscando…' : `Escribe, toca "usar mi ubicación" o toca el mapa para "${activeField === 'from' ? 'Desde' : 'Hasta'}"`}
            </Text>
          )}

          {suggestions.length > 0 && (
            <FlatList
              style={styles.suggestionsList}
              data={suggestions}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable style={styles.suggestionItem} onPress={() => onSelectSuggestion(item)}>
                  <SearchIcon size={14} />
                  <View style={styles.suggestionTextWrap}>
                    <Text style={styles.suggestionName}>{item.name}</Text>
                    {!!item.municipality && <Text style={styles.suggestionMunicipality}>{item.municipality}</Text>}
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>

        {errorMsg && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
      </View>

      <View style={styles.panel}>
        {!from || !to ? (
          <Text style={styles.loadingText}>Elige el punto Desde y Hasta para trazar la ruta</Text>
        ) : loadingRoute ? (
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
  destinoPin: { width: 42, height: 54 },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  panelTop: { position: 'absolute', top: 112, left: 20, right: 20 },
  fieldsRow: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: colors.surface, borderRadius: 18, padding: 12, gap: 10 },
  connectorCol: { width: 16, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  connectorDot: { width: 9, height: 9, borderRadius: 4.5, borderWidth: 2, borderColor: '#f5f5f5', backgroundColor: 'transparent' },
  connectorLine: { width: 1.5, flex: 1, backgroundColor: colors.borderSoft, marginVertical: 3 },
  fieldsCol: { flex: 1 },
  fieldBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: 12, paddingHorizontal: 12, height: 40, borderWidth: 1, borderColor: 'transparent' },
  fieldBoxActive: { borderColor: colors.amberBorder },
  fieldInput: { flex: 1, fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textPrimary },
  fieldDivider: { height: 8 },
  locationBtn: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  swapBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  hintText: { fontFamily: fonts.sairaRegular, fontSize: 11.5, color: colors.textSecondary, marginTop: 8, marginLeft: 6 },
  suggestionsList: { marginTop: 8, backgroundColor: colors.surface, borderRadius: 16, maxHeight: 220 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  suggestionTextWrap: { flex: 1 },
  suggestionName: { fontFamily: fonts.sairaSemiBold, fontSize: 13.5, color: colors.textPrimary },
  suggestionMunicipality: { fontFamily: fonts.sairaRegular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  errorBanner: { position: 'absolute', top: 60, left: 72, right: 20, padding: 12, borderRadius: 12, backgroundColor: 'rgba(211,47,47,.18)', borderWidth: 1, borderColor: 'rgba(211,47,47,.4)' },
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
