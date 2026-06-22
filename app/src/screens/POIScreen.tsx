import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { ReactElement } from 'react';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { ClockIcon, EyeIcon, ParkIcon, CoffeeIcon, StarIcon } from '../components/Icons';
import { usePoiDetail } from '../hooks/usePoiDetail';

const INFO_ICONS: Record<string, (props: { size?: number; color?: string }) => ReactElement> = {
  clock: ClockIcon,
  view: EyeIcon,
  park: ParkIcon,
  coffee: CoffeeIcon,
};

export default function POIScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'POI'>>();
  const { poi } = usePoiDetail(route.params?.poiId);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.mapWrap}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
              <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.type}>{poi.type}</Text>
          <Text style={styles.title}>{poi.name}</Text>
          <View style={styles.ratingRow}>
            <StarIcon size={15} />
            <Text style={styles.ratingText}>{poi.rating} ({poi.ratingCount})</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.distance}>{poi.distance}</Text>
          </View>
          <Text style={styles.routeKm}>{poi.routeKm}</Text>

          <View style={styles.recommendBox}>
            <Text style={styles.recommendPct}>{poi.recommendPct}</Text>
            <Text style={styles.recommendLabel}>{poi.recommendCount} motoristas lo recomiendan</Text>
          </View>

          {poi.info.map((i) => {
            const Icon = INFO_ICONS[i.kind] ?? EyeIcon;
            return (
              <View key={i.label} style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Icon size={18} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{i.label}</Text>
                  <Text style={styles.infoValue}>{i.value}</Text>
                </View>
              </View>
            );
          })}

          <Text style={styles.sectionTitle}>Galería</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {poi.gallery.map((g) => (
              <View key={g} style={styles.galleryItem}>
                <Text style={styles.galleryLabel}>{g}</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Reseñas</Text>
          {poi.reviews.map((r) => (
            <View key={r.name} style={styles.reviewRow}>
              <View style={[styles.reviewAvatar, { backgroundColor: r.bg[0] }]}>
                <Text style={styles.reviewIni}>{r.ini}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewName}>{r.name} <Text style={styles.reviewTime}>· {r.time}</Text></Text>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { height: 200, backgroundColor: '#191820' },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20, gap: 12 },
  type: { fontFamily: fonts.sairaSemiBold, fontSize: 12, color: colors.amber, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: fonts.condensedBold, fontSize: 22, color: colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.textPrimary },
  dot: { color: colors.textQuaternary },
  distance: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
  routeKm: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary },
  recommendBox: { backgroundColor: colors.amberSoft, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  recommendPct: { fontFamily: fonts.condensedBold, fontSize: 22, color: colors.amber },
  recommendLabel: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textTertiary, flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 12 },
  infoIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.amberSoft, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.textPrimary },
  infoValue: { fontFamily: fonts.sairaRegular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary, marginTop: 6 },
  galleryItem: { width: 90, height: 90, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', padding: 6 },
  galleryLabel: { fontFamily: fonts.sairaRegular, fontSize: 10.5, color: colors.textSecondary, textAlign: 'center' },
  reviewRow: { flexDirection: 'row', gap: 12 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  reviewIni: { fontFamily: fonts.sairaSemiBold, fontSize: 12, color: '#fff' },
  reviewName: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.textPrimary },
  reviewTime: { fontFamily: fonts.sairaRegular, color: colors.textSecondary },
  reviewText: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textTertiary, marginTop: 2 },
});
