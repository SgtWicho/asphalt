import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { AsphaltMark } from '../components/Logo';
import { useAuth } from '../auth/AuthProvider';

export default function OtpScreen({ email, onBack }: { email: string; onBack: () => void }) {
  const { verifyOtp, resendOtp } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onVerify = async () => {
    setError(null);
    setInfo(null);
    if (code.length !== 6) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }
    setLoading(true);
    const { error } = await verifyOtp(email, code);
    setLoading(false);
    if (error) setError('Código incorrecto o expirado. Intenta de nuevo.');
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    setResending(true);
    const { error } = await resendOtp(email);
    setResending(false);
    if (error) setError(error);
    else setInfo('Te enviamos un nuevo código.');
  };

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>

      <View style={styles.header}>
        <AsphaltMark size={56} />
        <Text style={styles.title}>Verifica tu correo</Text>
        <Text style={styles.subtitle}>Ingresa el código de 6 dígitos que enviamos a {email}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.codeInput}
          placeholder="••••••"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={(t) => setCode(t.replace(/[^0-9]/g, ''))}
        />

        {error && <Text style={styles.error}>{error}</Text>}
        {info && <Text style={styles.info}>{info}</Text>}

        <Pressable style={styles.primaryBtn} onPress={onVerify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verificar</Text>}
        </Pressable>

        <Pressable onPress={onResend} disabled={resending}>
          <Text style={styles.switchText}>{resending ? 'Reenviando...' : 'Reenviar código'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', paddingHorizontal: 26 },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22, color: colors.textPrimary, marginTop: -2 },
  header: { alignItems: 'center', gap: 14, marginBottom: 40 },
  title: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  form: { gap: 12 },
  codeInput: {
    height: 60,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    fontFamily: fonts.sairaSemiBold,
    fontSize: 26,
    letterSpacing: 12,
    color: colors.amber,
  },
  error: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.red, textAlign: 'center' },
  info: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.amber, textAlign: 'center' },
  primaryBtn: { height: 54, borderRadius: 15, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 16, color: '#fff' },
  switchText: { textAlign: 'center', fontFamily: fonts.sairaSemiBold, fontSize: 14, color: colors.amber, marginTop: 14 },
});
