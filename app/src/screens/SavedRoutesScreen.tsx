import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { ClockIcon, RouteOutlineIcon } from '../components/Icons';
import { useSavedRoutes } from '../hooks/useSavedRoutes';

export default function SavedRoutesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { routes } = useSavedRoutes();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mis rutas</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {routes.map((r) => (
          <Pressable key={r.id} style={styles.card} onPress={() => navigation.navigate('Detalle', { routeId: r.id })}>
            <View style={styles.cardMap} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{r.name}</Text>
              <Text style={styles.cardRegion}>{r.region}</Text>
              <View style={styles.cardStatsRow}>
                <RouteOutlineIcon size={13} color={colors.textSecondary} />
                <Text style={styles.cardStat}>{r.km} km</Text>
                <Text style={styles.cardStatDot}>·</Text>
                <Text style={styles.cardStat}>{r.desn} m</Text>
                <Text style={styles.cardStatDot}>·</Text>
                <ClockIcon size={13} color={colors.textSecondary} />
                <Text style={styles.cardStat}>{r.duration}</Text>
              </View>
              <Text style={styles.cardDate}>{r.date}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  title: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.textPrimary, paddingHorizontal: 20 },
  list: { padding: 20, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' },
  cardMap: { height: 90, backgroundColor: colors.surfaceAlt },
  cardBody: { padding: 14, gap: 4 },
  cardTitle: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary },
  cardRegion: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary },
  cardStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  cardStat: { fontFamily: fonts.sairaSemiBold, fontSize: 12, color: colors.textTertiary },
  cardStatDot: { color: colors.textQuaternary },
  cardDate: { fontFamily: fonts.sairaRegular, fontSize: 11, color: colors.textQuaternary, marginTop: 4 },
});
