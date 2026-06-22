import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { ArrowUpIcon, FlagIcon } from '../components/Icons';
import { useTurnByTurn } from '../hooks/useTurnByTurn';

export default function NavegacionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { steps, summary } = useTurnByTurn();
  const current = steps.find((s) => !s.done) ?? steps[steps.length - 1];

  return (
    <View style={styles.screen}>
      <View style={styles.mapWrap} />

      <View style={styles.topCard}>
        <View style={[styles.arrowCircle, { transform: [{ rotate: `${current.bearing}deg` }] }]}>
          {current.instruction === 'Llegada a destino' ? <FlagIcon /> : <ArrowUpIcon />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.instruction}>{current.instruction}</Text>
          <Text style={styles.street}>{current.street}</Text>
        </View>
        <Text style={styles.distance}>{current.distance}</Text>
      </View>

      <View style={styles.bottomPanel}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{summary.eta}</Text>
            <Text style={styles.summaryLabel}>Llegada</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{summary.remainingKm} km</Text>
            <Text style={styles.summaryLabel}>Restante</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{summary.remainingTime}</Text>
            <Text style={styles.summaryLabel}>Tiempo</Text>
          </View>
        </View>

        <Pressable style={styles.endBtn} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.endBtnText}>Finalizar navegación</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  mapWrap: { flex: 1, backgroundColor: '#191820' },
  topCard: { position: 'absolute', top: 60, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 18, padding: 16 },
  arrowCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' },
  instruction: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary },
  street: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary, marginTop: 2 },
  distance: { fontFamily: fonts.condensedBold, fontSize: 18, color: colors.amber },
  bottomPanel: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, gap: 18 },
  summaryRow: { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.textPrimary },
  summaryLabel: { fontFamily: fonts.sairaRegular, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 4 },
  endBtn: { backgroundColor: colors.red, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  endBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 15, color: '#fff' },
});
