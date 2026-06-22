import { useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { AsphaltMark } from '../components/Logo';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    headline: 'Graba y guarda tus rutas',
    body: 'Cada ruta se convierte en un recorrido completo con su trazado, distancia y desnivel.',
  },
  {
    headline: 'Descubre rutas de otros moteros',
    body: 'Explora un mapa hecho por la comunidad: curvas, costa, montaña y los mejores puntos de interés.',
  },
  {
    headline: 'Una comunidad para compartir',
    body: 'Comparte tus rutas, sigue a otros moteros y haz crecer tu comunidad sobre dos ruedas.',
  },
];

function SlideArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 402 480">
        <Path d="M0,40 H402 M0,120 H402 M0,200 H402 M0,280 H402 M0,360 H402" stroke="rgba(255,255,255,.05)" />
        <Path d="M40,470 C90,420 60,320 130,260 C190,210 170,140 220,110" fill="none" stroke="rgba(249,168,37,.25)" strokeWidth={16} strokeLinecap="round" />
        <Path d="M40,470 C90,420 60,320 130,260 C190,210 170,140 220,110" fill="none" stroke={colors.amber} strokeWidth={7} strokeLinecap="round" />
        <Circle cx={40} cy={470} r={10} fill="#191820" stroke="#fff" strokeWidth={4} />
        <Circle cx={220} cy={110} r={11} fill={colors.red} stroke="#191820" strokeWidth={4} />
      </Svg>
    );
  }
  if (index === 1) {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 402 480">
        <Path d="M0,60 H402 M0,160 H402 M0,260 H402 M0,360 H402" stroke="rgba(255,255,255,.05)" />
        <Path d="M30,420 C100,380 90,300 170,270" fill="none" stroke={colors.amber} strokeWidth={6} strokeLinecap="round" opacity={0.9} />
        <Path d="M210,420 C260,360 230,260 300,180" fill="none" stroke={colors.amber} strokeWidth={6} strokeLinecap="round" opacity={0.55} />
        <Path d="M120,150 C170,120 220,140 260,100" fill="none" stroke={colors.amber} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
        {[{ x: 170, y: 270 }, { x: 300, y: 180 }, { x: 120, y: 150 }].map((p, i) => (
          <Path key={i} d={`M${p.x},${p.y - 26} C${p.x - 12},${p.y - 26} ${p.x - 18},${p.y - 17} ${p.x - 18},${p.y - 9} C${p.x - 18},${p.y + 3} ${p.x},${p.y + 12} ${p.x},${p.y + 12} C${p.x},${p.y + 12} ${p.x + 18},${p.y + 3} ${p.x + 18},${p.y - 9} C${p.x + 18},${p.y - 17} ${p.x + 12},${p.y - 26} ${p.x},${p.y - 26} Z`} fill={colors.amber} />
        ))}
      </Svg>
    );
  }
  return (
    <Svg width="100%" height="100%" viewBox="0 0 402 480">
      <Circle cx={201} cy={240} r={92} stroke="rgba(249,168,37,.25)" strokeWidth={1.5} fill="none" />
      <Circle cx={201} cy={240} r={58} stroke="rgba(249,168,37,.4)" strokeWidth={1.5} fill="none" />
      <Circle cx={201} cy={240} r={42} fill={colors.surface} stroke={colors.amber} strokeWidth={2} />
      <Circle cx={130} cy={210} r={28} fill="#2a6fdb" />
      <Circle cx={272} cy={210} r={26} fill="#1f8a5b" />
      <Circle cx={150} cy={310} r={24} fill="#6a3fd1" />
      <Circle cx={252} cy={314} r={30} fill={colors.red} />
    </Svg>
  );
}

function WelcomeView({
  idx,
  onScroll,
  onPrimary,
  onSkip,
  scrollRef,
}: {
  idx: number;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onPrimary: () => void;
  onSkip: () => void;
  scrollRef: React.RefObject<ScrollView | null>;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Pressable style={styles.skipBtn} onPress={onSkip}>
        <Text style={styles.skipText}>Saltar</Text>
      </Pressable>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={{ width: SCREEN_W }}>
            <View style={styles.slideArt}>
              <SlideArt index={i} />
            </View>
            <View style={styles.slideText}>
              <Text style={styles.headline}>{s.headline}</Text>
              <Text style={styles.body}>{s.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />
          ))}
        </View>
        <Pressable style={styles.primaryBtn} onPress={onPrimary}>
          <Text style={styles.primaryBtnText}>{idx < SLIDES.length - 1 ? 'Siguiente' : 'Crear cuenta'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function RegisterView({ onBack }: { onBack: () => void }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <LinearGradient colors={['rgba(211,47,47,.28)', colors.bg]} style={styles.registerWrap}>
      <Pressable style={styles.backBtn} onPress={onBack}>
        <Svg width={14} height={20} viewBox="0 0 12 20" fill="none">
          <Path d="M10 2L2 10l8 8" stroke="#f5f5f5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <View style={styles.registerHeader}>
        <AsphaltMark size={56} />
        <Text style={styles.registerTitle}>Únete a AsphaltApp</Text>
      </View>
      <View style={styles.registerButtons}>
        <Pressable style={styles.emailBtn} onPress={() => navigation.replace('Main')}>
          <Text style={styles.emailBtnText}>Continuar con correo</Text>
        </Pressable>
        <Pressable style={styles.oauthBtn} onPress={() => navigation.replace('Main')}>
          <Text style={styles.oauthBtnText}>Continuar con Apple</Text>
        </Pressable>
        <Pressable style={styles.oauthBtn} onPress={() => navigation.replace('Main')}>
          <Text style={styles.oauthBtnText}>Continuar con Google</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => navigation.replace('Main')}>
        <Text style={styles.loginLink}>¿Ya tienes cuenta? Inicia sesión</Text>
      </Pressable>
    </LinearGradient>
  );
}

export default function OnboardingScreen() {
  const [view, setView] = useState<'welcome' | 'register'>('welcome');
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * SCREEN_W, animated: true });
    setIdx(i);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (i !== idx) setIdx(i);
  };

  const onPrimary = () => {
    if (idx < SLIDES.length - 1) goTo(idx + 1);
    else setView('register');
  };

  if (view === 'register') {
    return (
      <View style={styles.screen}>
        <RegisterView onBack={() => setView('welcome')} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <WelcomeView idx={idx} onScroll={onScroll} onPrimary={onPrimary} onSkip={() => navigation.replace('Main')} scrollRef={scrollRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  skipBtn: { position: 'absolute', top: 60, right: 20, zIndex: 10 },
  skipText: { fontFamily: fonts.sairaRegular, fontSize: 14, color: colors.textTertiary },
  slideArt: { height: '58%', paddingTop: 60 },
  slideText: { paddingHorizontal: 30, marginTop: 20 },
  headline: { fontFamily: fonts.condensedBold, fontSize: 28, color: colors.textPrimary, lineHeight: 32 },
  body: { fontFamily: fonts.sairaRegular, fontSize: 14.5, color: colors.textSecondary, marginTop: 10, lineHeight: 20 },
  bottomBar: { paddingHorizontal: 26, paddingBottom: 40, gap: 18 },
  dots: { flexDirection: 'row', gap: 7, justifyContent: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,.2)' },
  dotActive: { width: 24, backgroundColor: colors.amber },
  primaryBtn: { width: '100%', height: 54, borderRadius: 15, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 16.5, color: '#fff' },
  registerWrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 26, paddingBottom: 38 },
  backBtn: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  registerHeader: { alignItems: 'center', gap: 14, marginBottom: 50 },
  registerTitle: { fontFamily: fonts.condensedBold, fontSize: 24, color: colors.textPrimary },
  registerButtons: { gap: 12 },
  emailBtn: { height: 54, borderRadius: 15, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  emailBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 16, color: '#fff' },
  oauthBtn: { height: 54, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  oauthBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 16, color: colors.textPrimary },
  loginLink: { textAlign: 'center', fontFamily: fonts.sairaSemiBold, fontSize: 14, color: colors.amber, marginTop: 20 },
});
