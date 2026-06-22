import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function Placeholder({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.sub}>Pantalla pendiente de construir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 8 },
  text: { color: colors.textPrimary, fontFamily: fonts.condensedBold, fontSize: 24 },
  sub: { color: colors.textSecondary, fontFamily: fonts.sairaRegular, fontSize: 14 },
});
