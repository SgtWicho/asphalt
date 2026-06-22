import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { ReactElement } from 'react';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { HeartIcon, CommentIcon, ShareIcon, EyeIcon, FuelIcon, FoodIcon } from '../components/Icons';
import { useRouteDetail } from '../hooks/useRouteDetail';

const POI_ICONS: Record<string, (props: { size?: number; color?: string }) => ReactElement> = {
  view: EyeIcon,
  fuel: FuelIcon,
  food: FoodIcon,
};

export default function DetalleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Detalle'>>();
  const { route: detail } = useRouteDetail(route.params?.routeId);

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
          <View style={styles.tagsRow}>
            {detail.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.title}>{detail.title}</Text>
          <Text style={styles.author}>{detail.author} · {detail.moto} · {detail.date}</Text>

          <View style={styles.statsRow}>
            {detail.stats.map((s) => (
              <View key={s.l} style={styles.statItem}>
                <Text style={styles.statNum}>{s.n}<Text style={styles.statUnit}> {s.u}</Text></Text>
                <Text style={styles.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <View style={styles.actionItem}>
              <HeartIcon size={20} color={colors.textSecondary} />
              <Text style={styles.actionText}>{detail.likes}</Text>
            </View>
            <View style={styles.actionItem}>
              <CommentIcon size={20} color={colors.textSecondary} />
              <Text style={styles.actionText}>{detail.comments_count}</Text>
            </View>
            <View style={styles.actionItem}>
              <ShareIcon size={20} color={colors.textSecondary} />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {detail.photos.map((p) => (
              <View key={p.label} style={styles.photo}>
                <Text style={styles.photoLabel}>{p.label}</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Puntos de interés</Text>
          {detail.pois.map((p) => {
            const Icon = POI_ICONS[p.kind] ?? EyeIcon;
            return (
              <Pressable key={p.name} style={styles.poiRow} onPress={() => navigation.navigate('POI', { poiId: p.name })}>
                <View style={styles.poiIconWrap}>
                  <Icon size={18} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.poiName}>{p.name}</Text>
                  <Text style={styles.poiType}>{p.type} · {p.km}</Text>
                </View>
              </Pressable>
            );
          })}

          <Text style={styles.sectionTitle}>Comentarios</Text>
          {detail.comments.map((c) => (
            <View key={c.name} style={styles.commentRow}>
              <View style={[styles.commentAvatar, { backgroundColor: c.bg[0] }]}>
                <Text style={styles.commentIni}>{c.ini}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.commentName}>{c.name} <Text style={styles.commentTime}>· {c.time}</Text></Text>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            </View>
          ))}

          <Pressable style={styles.ctaBtn} onPress={() => navigation.navigate('Navegacion')}>
            <Text style={styles.ctaBtnText}>Hacer esta ruta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { height: 220, backgroundColor: '#191820' },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20, gap: 14 },
  tagsRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: colors.amberSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tagText: { fontFamily: fonts.sairaSemiBold, fontSize: 11, color: colors.amber },
  title: { fontFamily: fonts.condensedBold, fontSize: 24, color: colors.textPrimary },
  author: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 18, color: colors.textPrimary },
  statUnit: { fontFamily: fonts.sairaRegular, fontSize: 11.5, color: colors.textSecondary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: 22 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.textSecondary },
  photo: { width: 120, height: 80, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', padding: 8 },
  photoLabel: { fontFamily: fonts.sairaRegular, fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary, marginTop: 6 },
  poiRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 12 },
  poiIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.amberSoft, alignItems: 'center', justifyContent: 'center' },
  poiName: { fontFamily: fonts.sairaSemiBold, fontSize: 13.5, color: colors.textPrimary },
  poiType: { fontFamily: fonts.sairaRegular, fontSize: 11.5, color: colors.textSecondary, marginTop: 2 },
  commentRow: { flexDirection: 'row', gap: 12 },
  commentAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  commentIni: { fontFamily: fonts.sairaSemiBold, fontSize: 12, color: '#fff' },
  commentName: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.textPrimary },
  commentTime: { fontFamily: fonts.sairaRegular, color: colors.textSecondary },
  commentText: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textTertiary, marginTop: 2 },
  ctaBtn: { backgroundColor: colors.amber, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 6 },
  ctaBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 15, color: colors.bg },
});
