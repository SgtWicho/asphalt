import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import MapView, { Marker, Polyline, LatLng, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { darkMapStyle } from '../theme/mapStyle';
import { fonts } from '../theme/typography';

type Suggestion = {
  id: string;
  name: string;
  municipality: string;
  coordinate: LatLng;
};

function fmtDuration(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h} h ${rem} min`;
}

function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={colors.textSecondary} strokeWidth={2} />
      <Path d="M20 20l-4.35-4.35" stroke={colors.textSecondary} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function NavegarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [distanceM, setDistanceM] = useState<number | null>(null);
  const [durationS, setDurationS] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Se necesita permiso de ubicación para navegar');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setOrigin({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch {
        setErrorMsg('No se pudo obtener tu ubicación actual');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (origin && destination) {
      calculateRoute(origin, destination);
    }
  }, [origin, destination]);

  const calculateRoute = async (from: LatLng, to: LatLng) => {
    try {
      setLoadingRoute(true);
      setErrorMsg(null);
      setRoutePoints([]);
      const apiKey = process.env.EXPO_PUBLIC_TOMTOM_API_KEY;
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${from.latitude},${from.longitude}:${to.latitude},${to.longitude}/json?key=${apiKey}`;
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
            edgePadding: { top: 80, right: 60, bottom: 280, left: 60 },
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

  const onChangeQuery = (text: string) => {
    setQuery(text);
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
        const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?key=${apiKey}&countrySet=PR&limit=5`;
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
    }, 400);
  };

  const onSelectSuggestion = (s: Suggestion) => {
    setQuery(s.name);
    setSuggestions([]);
    setDestination(s.coordinate);
  };

  const onMapPress = (e: MapPressEvent) => {
    setQuery('');
    setSuggestions([]);
    setDestination(e.nativeEvent.coordinate);
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
            latitude: origin?.latitude ?? 18.2208,
            longitude: origin?.longitude ?? -66.5901,
            latitudeDelta: origin ? 0.05 : 1.2,
            longitudeDelta: origin ? 0.05 : 1.2,
          }}
        >
          {routePoints.length > 1 && (
            <>
              <Polyline coordinates={routePoints} strokeColor="rgba(249,168,37,.25)" strokeWidth={14} />
              <Polyline coordinates={routePoints} strokeColor={colors.amber} strokeWidth={6} />
            </>
          )}

          {origin && (
            <Marker coordinate={origin} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.startMarker} />
            </Marker>
          )}
          {destination && (
            <Marker coordinate={destination} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.endMarker} />
            </Marker>
          )}
        </MapView>

        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
            <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <SearchIcon />
            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              placeholder="Buscar destino en Puerto Rico"
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
            />
            {searching && <ActivityIndicator size="small" color={colors.amber} />}
          </View>

          {suggestions.length > 0 && (
            <FlatList
              style={styles.suggestionsList}
              data={suggestions}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable style={styles.suggestionItem} onPress={() => onSelectSuggestion(item)}>
                  <Text style={styles.suggestionName}>{item.name}</Text>
                  {!!item.municipality && <Text style={styles.suggestionMunicipality}>{item.municipality}</Text>}
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
        {loadingLocation ? (
          <Text style={styles.loadingText}>Obteniendo tu ubicación…</Text>
        ) : !destination ? (
          <Text style={styles.loadingText}>Busca un destino o toca el mapa</Text>
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
  endMarker: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#191820', borderWidth: 3.5, borderColor: colors.amber },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { position: 'absolute', top: 60, left: 72, right: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 16, height: 40 },
  searchInput: { flex: 1, fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textPrimary },
  suggestionsList: { marginTop: 8, backgroundColor: colors.surface, borderRadius: 16, maxHeight: 220 },
  suggestionItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  suggestionName: { fontFamily: fonts.sairaSemiBold, fontSize: 13.5, color: colors.textPrimary },
  suggestionMunicipality: { fontFamily: fonts.sairaRegular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
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
