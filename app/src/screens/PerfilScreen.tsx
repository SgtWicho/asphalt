import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useProfile } from '../hooks/useProfile';

const STATS = [
  { l: 'Publicaciones', n: 0 },
  { l: 'Seguidores', n: 0 },
  { l: 'Seguidos', n: 0 },
];

export default function PerfilScreen() {
  const { profile, loading } = useProfile();

  const displayName = profile?.full_name || 'Sin nombre';
  const username = profile?.username ? `@${profile.username}` : '@sin-username';
  const initial = (profile?.full_name || profile?.username || '?').charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.topRow}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.l} style={styles.statItem}>
              <Text style={styles.statNum}>{s.n}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.name}>{loading ? 'Cargando...' : displayName}</Text>
        <Text style={styles.handle}>{username}</Text>
        <Text style={styles.bio}>Sin biografía todavía.</Text>
      </View>

      <Pressable style={styles.editBtn} onPress={() => {}}>
        <Text style={styles.editBtnText}>Próximamente</Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Publicaciones</Text>
        <View style={styles.gridPlaceholder}>
          <Text style={styles.gridPlaceholderText}>Aún no hay publicaciones</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 70, paddingHorizontal: 24, gap: 20 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.surface },
  avatarFallback: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.condensedBold, fontSize: 28, color: colors.bg },
  statsRow: { flex: 1, flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.textPrimary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 4 },
  infoBlock: { paddingHorizontal: 24, marginTop: 18, gap: 4 },
  name: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.textPrimary },
  handle: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
  bio: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textTertiary, marginTop: 6 },
  editBtn: { marginTop: 18, marginHorizontal: 24, height: 40, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  editBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 13.5, color: colors.textPrimary },
  section: { paddingHorizontal: 24, marginTop: 32, gap: 12 },
  sectionTitle: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary },
  gridPlaceholder: { height: 160, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSoft, alignItems: 'center', justifyContent: 'center' },
  gridPlaceholderText: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
});
