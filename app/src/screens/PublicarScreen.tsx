import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { usePublish } from '../hooks/usePublish';

const ALL_TAGS = ['Curvas', 'Montaña', 'Costa', 'Rápida', 'Paisaje'];

export default function PublicarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { draft, title, setTitle, tags, toggleTag, publish } = usePublish();

  const onPublish = () => {
    publish();
    navigation.navigate('Main');
  };

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
          <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <Text style={styles.title}>Publicar ruta</Text>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{draft.distance}<Text style={styles.statUnit}> km</Text></Text>
            <Text style={styles.statLabel}>Distancia</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{draft.duration}</Text>
            <Text style={styles.statLabel}>Duración</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{draft.desnivel}<Text style={styles.statUnit}> m</Text></Text>
            <Text style={styles.statLabel}>Desnivel</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {draft.photos.map((p) => (
            <View key={p.label} style={styles.photo}>
              <Text style={styles.photoLabel}>{p.label}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.fieldLabel}>Título</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholderTextColor={colors.textSecondary} />

        <Text style={styles.fieldLabel}>Etiquetas</Text>
        <View style={styles.tagsRow}>
          {ALL_TAGS.map((t) => (
            <Pressable key={t} style={[styles.chip, tags.includes(t) && styles.chipActive]} onPress={() => toggleTag(t)}>
              <Text style={[styles.chipText, tags.includes(t) && styles.chipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.poiNote}>{draft.poiCount} puntos de interés se incluirán en la ruta</Text>

        <Pressable style={styles.publishBtn} onPress={onPublish}>
          <Text style={styles.publishBtnText}>Publicar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  title: { marginTop: 68, textAlign: 'center', fontFamily: fonts.condensedBold, fontSize: 18, color: colors.textPrimary },
  body: { padding: 20, gap: 18, paddingBottom: 50 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.textPrimary },
  statUnit: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 4 },
  photo: { width: 120, height: 80, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', padding: 8 },
  photoLabel: { fontFamily: fonts.sairaRegular, fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  fieldLabel: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.textSecondary },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textPrimary },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.amber },
  chipText: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.textSecondary },
  chipTextActive: { color: colors.bg },
  poiNote: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.amber, textAlign: 'center' },
  publishBtn: { backgroundColor: colors.amber, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  publishBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 15, color: colors.bg },
});
