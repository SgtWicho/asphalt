import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { SearchIcon, RouteOutlineIcon, StarIcon } from '../components/Icons';
import { useExploreRoutes } from '../hooks/useExploreRoutes';

export default function ExplorarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { routes, filters } = useExploreRoutes();
  const [active, setActive] = useState(filters[0]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Pressable style={styles.planBtn} onPress={() => navigation.navigate('Planificador')}>
          <RouteOutlineIcon size={18} color={colors.amber} />
          <Text style={styles.planBtnText}>Planificar ruta</Text>
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <SearchIcon size={18} color={colors.textSecondary} />
        <Text style={styles.searchPlaceholder}>Buscar rutas, regiones...</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((f) => (
          <Pressable key={f} style={[styles.chip, active === f && styles.chipActive]} onPress={() => setActive(f)}>
            <Text style={[styles.chipText, active === f && styles.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {routes.map((r) => (
          <Pressable key={r.id} style={styles.card} onPress={() => navigation.navigate('Detalle', { routeId: r.id })}>
            <View style={styles.cardMap} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{r.name}</Text>
              <Text style={styles.cardRegion}>{r.region}</Text>
              <View style={styles.cardStatsRow}>
                <Text style={styles.cardStat}>{r.dist} km</Text>
                <Text style={styles.cardStatDot}>·</Text>
                <Text style={styles.cardStat}>{r.desn} m</Text>
                <View style={styles.cardRating}>
                  <StarIcon size={13} />
                  <Text style={styles.cardRatingText}>{r.rating}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  title: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.textPrimary },
  planBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.amberSoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: colors.amberBorder },
  planBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.amber },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 16, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: colors.surface },
  searchPlaceholder: { fontFamily: fonts.sairaRegular, fontSize: 13.5, color: colors.textSecondary },
  filters: { flexGrow: 0, marginTop: 16 },
  filtersContent: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 },
  chip: { flexShrink: 0, flexGrow: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 16, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.amber },
  chipText: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.textSecondary, flexShrink: 0, flexWrap: 'nowrap' },
  chipTextActive: { color: colors.bg },
  list: { padding: 20, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' },
  cardMap: { height: 110, backgroundColor: colors.surfaceAlt },
  cardBody: { padding: 14, gap: 4 },
  cardTitle: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary },
  cardRegion: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary },
  cardStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardStat: { fontFamily: fonts.sairaSemiBold, fontSize: 12, color: colors.textTertiary },
  cardStatDot: { color: colors.textQuaternary },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  cardRatingText: { fontFamily: fonts.sairaSemiBold, fontSize: 12, color: colors.amber },
});
