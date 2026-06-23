import { View, Text, Image, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useAds } from '../hooks/useAds';
import type { Ad } from '../data/mock';

function AdVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return <VideoView style={styles.media} player={player} contentFit="cover" nativeControls={false} />;
}

function AdCard({ ad }: { ad: Ad }) {
  const openLink = () => Linking.openURL(ad.url);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{ad.brandIni}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.brand}>{ad.brand}</Text>
          {ad.sponsored && <Text style={styles.sponsored}>Patrocinado</Text>}
        </View>
      </View>

      <Text style={styles.text}>{ad.text}</Text>

      {ad.media.type === 'video' ? (
        <AdVideo uri={ad.media.uri} />
      ) : (
        <Image source={{ uri: ad.media.uri }} style={styles.media} resizeMode="cover" />
      )}

      <Pressable style={styles.ctaBtn} onPress={openLink}>
        <Text style={styles.ctaText}>{ad.ctaLabel}</Text>
      </Pressable>
    </View>
  );
}

export default function AnunciosScreen() {
  const { ads } = useAds();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Anuncios</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  title: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.textPrimary, paddingHorizontal: 20 },
  list: { padding: 20, gap: 18, paddingBottom: 40 },
  card: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', paddingBottom: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.amberSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.semiCondensedBold, fontSize: 13, color: colors.amber },
  headerText: { gap: 1 },
  brand: { fontFamily: fonts.semiCondensedBold, fontSize: 15, color: colors.textPrimary },
  sponsored: { fontFamily: fonts.sairaRegular, fontSize: 11.5, color: colors.textQuaternary },
  text: { fontFamily: fonts.sairaRegular, fontSize: 13.5, color: colors.textTertiary, paddingHorizontal: 14, paddingBottom: 12, lineHeight: 19 },
  media: { width: '100%', height: 200, backgroundColor: colors.surfaceAlt },
  ctaBtn: { marginTop: 14, marginHorizontal: 14, backgroundColor: colors.amber, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  ctaText: { fontFamily: fonts.semiCondensedBold, fontSize: 14, color: '#18171c' },
});
