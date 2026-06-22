import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { ReactElement } from 'react';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { TrophyIcon, SunriseIcon, MountainIcon, WaveIcon } from '../components/Icons';
import { useProfile } from '../hooks/useProfile';

const BADGE_ICONS: Record<string, (props: { size?: number; color?: string }) => ReactElement> = {
  trophy: TrophyIcon,
  dawn: SunriseIcon,
  peak: MountainIcon,
  wave: WaveIcon,
};

export default function PerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile } = useProfile();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.ini}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.handle}>{profile.handle}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <View style={styles.statsRow}>
        {profile.stats.map((s) => (
          <View key={s.l} style={styles.statItem}>
            <Text style={styles.statNum}>{s.n}</Text>
            <Text style={styles.statLabel}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Motos</Text>
        {profile.bikes.map((b) => (
          <View key={b.model} style={styles.bikeRow}>
            <Text style={styles.bikeName}>{b.brand} {b.model}</Text>
            <Text style={styles.bikeSpec}>{b.spec}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insignias</Text>
        <View style={styles.badgesGrid}>
          {profile.badges.map((b) => {
            const Icon = BADGE_ICONS[b.kind] ?? TrophyIcon;
            return (
              <View key={b.label} style={[styles.badge, b.locked && styles.badgeLocked]}>
                <Icon size={26} color={b.locked ? colors.textQuaternary : colors.amber} />
                <Text style={[styles.badgeLabel, b.locked && styles.badgeLabelLocked]}>{b.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis rutas</Text>
        {profile.routes.map((r) => (
          <Pressable key={r.name} style={styles.routeRow} onPress={() => navigation.navigate('Detalle', { routeId: r.name })}>
            <View style={styles.routeMini}>
              <Svg width="100%" height="100%" viewBox="0 0 200 110">
                <Path d={r.route} stroke={colors.amber} strokeWidth={2.5} fill="none" strokeLinecap="round" />
              </Svg>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeName}>{r.name}</Text>
              <Text style={styles.routeStats}>{r.km} km · {r.desn} m</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 24, gap: 6 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { fontFamily: fonts.condensedBold, fontSize: 28, color: colors.bg },
  name: { fontFamily: fonts.condensedBold, fontSize: 22, color: colors.textPrimary },
  handle: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary },
  bio: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textTertiary, textAlign: 'center', marginTop: 6 },
  statsRow: { flexDirection: 'row', marginTop: 22, paddingHorizontal: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.textPrimary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 4 },
  section: { paddingHorizontal: 24, marginTop: 28, gap: 12 },
  sectionTitle: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary },
  bikeRow: { backgroundColor: colors.surface, borderRadius: 14, padding: 14 },
  bikeName: { fontFamily: fonts.sairaSemiBold, fontSize: 13.5, color: colors.textPrimary },
  bikeSpec: { fontFamily: fonts.sairaRegular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: { width: '30%', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 16 },
  badgeLocked: { opacity: 0.45 },
  badgeLabel: { fontFamily: fonts.sairaRegular, fontSize: 10.5, color: colors.textTertiary, textAlign: 'center' },
  badgeLabelLocked: { color: colors.textQuaternary },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 10 },
  routeMini: { width: 70, height: 50, backgroundColor: colors.surfaceAlt, borderRadius: 10, overflow: 'hidden' },
  routeName: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.textPrimary },
  routeStats: { fontFamily: fonts.sairaRegular, fontSize: 11.5, color: colors.textSecondary, marginTop: 2 },
});
