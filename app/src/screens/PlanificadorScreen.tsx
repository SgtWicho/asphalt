import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { usePlanner } from '../hooks/usePlanner';
import type { RouteStyleKey } from '../data/mock';

const STYLE_KEYS: RouteStyleKey[] = ['curvas', 'paisaje', 'rapida'];

export default function PlanificadorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { style, setStyle, plan, styles: defs } = usePlanner();

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
          <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <Text style={styles.title}>Planificador</Text>

      <View style={styles.mapWrap}>
        <Svg width="100%" height="100%" viewBox="0 0 370 600" preserveAspectRatio="none">
          <Path d={plan.path} stroke={colors.amber} strokeWidth={4} fill="none" strokeLinecap="round" />
        </Svg>
      </View>

      <View style={styles.panel}>
        <View style={styles.tabsRow}>
          {STYLE_KEYS.map((k) => (
            <Pressable key={k} style={[styles.tab, style === k && styles.tabActive]} onPress={() => setStyle(k)}>
              <Text style={[styles.tabText, style === k && styles.tabTextActive]}>{defs[k].label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{plan.distance}<Text style={styles.statUnit}> km</Text></Text>
            <Text style={styles.statLabel}>Distancia</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{plan.duration}</Text>
            <Text style={styles.statLabel}>Duración</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{plan.metricValue}</Text>
            <Text style={styles.statLabel}>{plan.metricLabel}</Text>
          </View>
        </View>

        <View style={styles.indexBox}>
          <View style={styles.indexHeader}>
            <Text style={styles.indexLabel}>{plan.indexLabel}</Text>
            <View style={styles.indexTag}>
              <Text style={styles.indexTagText}>{plan.indexTag}</Text>
            </View>
          </View>
          <View style={styles.indexBarBg}>
            <View style={[styles.indexBarFill, { width: plan.indexPct as `${number}%` }]} />
          </View>
        </View>

        <Pressable style={styles.startBtn} onPress={() => navigation.navigate('Navegacion')}>
          <Text style={styles.startBtnText}>Iniciar navegación</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  title: { position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.condensedBold, fontSize: 18, color: colors.textPrimary, zIndex: 1 },
  mapWrap: { flex: 1, backgroundColor: '#191820' },
  panel: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, gap: 18 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center' },
  tabActive: { backgroundColor: colors.amber },
  tabText: { fontFamily: fonts.sairaSemiBold, fontSize: 11.5, color: colors.textSecondary },
  tabTextActive: { color: colors.bg },
  statsRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 22, color: colors.textPrimary },
  statUnit: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 4 },
  indexBox: { gap: 8 },
  indexHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  indexLabel: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.textPrimary },
  indexTag: { backgroundColor: colors.amberSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  indexTagText: { fontFamily: fonts.sairaSemiBold, fontSize: 11, color: colors.amber },
  indexBarBg: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt },
  indexBarFill: { height: 8, borderRadius: 4, backgroundColor: colors.amber },
  startBtn: { backgroundColor: colors.amber, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  startBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 15, color: colors.bg },
});
