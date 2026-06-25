import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { AsphaltMark } from '../components/Logo';
import { useAuth } from '../auth/AuthProvider';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    const result = mode === 'signIn' ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (mode === 'signUp') setInfo('Cuenta creada. Revisa tu correo para confirmar.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <AsphaltMark size={56} />
        <Text style={styles.title}>{mode === 'signIn' ? 'Inicia sesión' : 'Crea tu cuenta'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'signIn' ? 'Bienvenido de nuevo a AsphaltApp' : 'Únete a la comunidad de AsphaltApp'}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}
        {info && <Text style={styles.info}>{info}</Text>}

        <Pressable style={styles.primaryBtn} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>{mode === 'signIn' ? 'Iniciar sesión' : 'Registrarme'}</Text>
          )}
        </Pressable>

        <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
          <Text style={styles.switchText}>
            {mode === 'signIn' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', paddingHorizontal: 26 },
  header: { alignItems: 'center', gap: 14, marginBottom: 40 },
  title: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  form: { gap: 12 },
  input: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    fontFamily: fonts.sairaRegular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  error: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.red },
  info: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.amber },
  primaryBtn: { height: 54, borderRadius: 15, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  primaryBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 16, color: '#fff' },
  switchText: { textAlign: 'center', fontFamily: fonts.sairaSemiBold, fontSize: 14, color: colors.amber, marginTop: 14 },
});
