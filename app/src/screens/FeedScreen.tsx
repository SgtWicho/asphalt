import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { feedPosts, FeedPost } from '../data/mock';
import { SearchIcon, BellIcon, DotsIcon, HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, ArrowRightIcon, CameraIcon, RouteOutlineIcon, ExpandIcon } from '../components/Icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const likeColor = liked ? colors.amber : colors.textSecondary;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.ini}</Text>
          </View>
          <View style={styles.avatarDotWrap}>
            <View style={styles.avatarDot} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.authorMeta}>{post.moto} · {post.time}</Text>
        </View>
        <DotsIcon />
      </View>

      <View style={styles.photo}>
        <View style={styles.photoOverlay} />
        <View style={styles.photoKmBadge}>
          <View style={styles.photoKmDot} />
          <Text style={styles.photoKmText}>{post.km} km</Text>
        </View>
        <View style={styles.photoCaption}>
          <CameraIcon />
          <Text style={styles.photoCaptionText}>Foto · {post.loc}</Text>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <Svg viewBox="0 0 360 200" width="100%" height="100%">
          <Rect width="360" height="200" fill="#191820" />
          <Path
            d="M0,40 H360 M0,80 H360 M0,120 H360 M0,160 H360 M60,0 V200 M120,0 V200 M180,0 V200 M240,0 V200 M300,0 V200"
            stroke="rgba(255,255,255,.045)"
          />
          <Path d="M-10,158 C90,148 130,64 232,78 C300,87 330,46 372,30" stroke="rgba(255,255,255,.05)" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M-20,96 C60,108 120,150 210,138 C280,128 320,150 380,150" stroke="rgba(255,255,255,.04)" strokeWidth={7} fill="none" strokeLinecap="round" />
          <Path d={post.routeGlow} fill="none" stroke="rgba(249,168,37,.25)" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
          <Path d={post.routeGlow} fill="none" stroke={colors.amber} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          {post.poiBig.map((p, i) => (
            <Circle key={i} cx={p.x} cy={p.y} r={6.5} fill={colors.amber} stroke="#191820" strokeWidth={3} />
          ))}
          <Circle cx={post.gsx} cy={post.gsy} r={9} fill="#191820" stroke="#f5f5f5" strokeWidth={3.5} />
          <Circle cx={post.gsx} cy={post.gsy} r={3.5} fill="#f5f5f5" />
          <Circle cx={post.gex} cy={post.gey} r={9.5} fill={colors.red} stroke="#191820" strokeWidth={3.5} />
        </Svg>
        <View style={styles.mapLabelTop}>
          <RouteOutlineIcon />
          <Text style={styles.mapLabelText}>Recorrido</Text>
        </View>
        <Pressable
          style={styles.mapFullBtn}
          onPress={() => navigation.navigate('Detalle', { routeId: post.id })}
        >
          <Text style={styles.mapFullBtnText}>Mapa completo</Text>
          <ExpandIcon />
        </Pressable>
        <View style={styles.mapLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f5f5f5' }]} />
            <Text style={styles.legendText}>Salida</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.red }]} />
            <Text style={styles.legendText}>Meta</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.subRow}>
          <Svg width={13} height={13} viewBox="0 0 24 24" fill={colors.amber}>
            <Path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
            <Circle cx="12" cy="9" r="2.4" fill={colors.surface} />
          </Svg>
          <Text style={styles.subText}>{post.loc} · {post.poiCount} puntos de interés</Text>
        </View>

        <View style={styles.statsRow}>
          {post.stats.map((st, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>
                {st.n}
                {st.u ? <Text style={styles.statUnit}> {st.u}</Text> : null}
              </Text>
              <Text style={styles.statLabel}>{st.l}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn} onPress={() => setLiked((v) => !v)}>
            <HeartIcon color={likeColor} fill={liked ? colors.amber : 'none'} />
            <Text style={[styles.actionText, { color: likeColor }]}>{post.likes + (liked ? 1 : 0)}</Text>
          </Pressable>
          <View style={styles.actionBtn}>
            <CommentIcon />
            <Text style={styles.actionText}>{post.comments}</Text>
          </View>
          <ShareIcon />
          <View style={{ flex: 1 }} />
          <Pressable onPress={() => setSaved((v) => !v)}>
            <BookmarkIcon color={saved ? colors.amber : colors.textSecondary} fill={saved ? colors.amber : 'none'} />
          </Pressable>
        </View>

        <Pressable style={styles.cta} onPress={() => navigation.navigate('Detalle', { routeId: post.id })}>
          <Text style={styles.ctaText}>Hacer esta ruta</Text>
          <ArrowRightIcon />
        </Pressable>
      </View>
    </View>
  );
}

export default function FeedScreen() {
  return (
    <View style={styles.screen}>
      <BlurView intensity={40} tint="dark" style={styles.appBar}>
        <Image source={require('../../assets/asphaltapp-logo.png')} style={styles.headerLogo} resizeMode="contain" />
        <View style={styles.appBarIcons}>
          <View style={styles.iconCircle}>
            <SearchIcon />
          </View>
          <View style={styles.iconCircle}>
            <BellIcon />
            <View style={styles.iconBadge} />
          </View>
        </View>
      </BlurView>
      <ScrollView contentContainerStyle={styles.feedList}>
        {feedPosts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  appBar: {
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  headerLogo: { height: 26, width: 130 },
  appBarIcons: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  iconBadge: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red, borderWidth: 2, borderColor: colors.bg },
  feedList: { padding: 16, gap: 18 },
  card: { backgroundColor: colors.surface, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,.05)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, paddingBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.condensedBold, fontSize: 18, color: '#fff' },
  avatarDotWrap: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  avatarDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.amber },
  authorName: { fontFamily: fonts.sairaSemiBold, fontSize: 15, color: colors.textPrimary },
  authorMeta: { fontFamily: fonts.sairaRegular, fontSize: 12.5, color: colors.textSecondary, marginTop: 1 },
  photo: { width: '100%', height: 178, backgroundColor: '#2b2a34' },
  photoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(24,23,28,.25)' },
  photoKmBadge: { position: 'absolute', left: 12, top: 12, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9, backgroundColor: 'rgba(24,23,28,.6)' },
  photoKmDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.red },
  photoKmText: { fontFamily: fonts.semiCondensedBold, fontSize: 13, color: '#fff' },
  photoCaption: { position: 'absolute', left: 13, bottom: 11, flexDirection: 'row', alignItems: 'center', gap: 6 },
  photoCaptionText: { fontFamily: fonts.sairaRegular, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(245,245,245,.62)' },
  mapWrap: { position: 'relative', width: '100%', height: 184, backgroundColor: '#191820', borderTopWidth: 1, borderTopColor: colors.borderSoft },
  mapLabelTop: { position: 'absolute', left: 13, top: 12, flexDirection: 'row', alignItems: 'center', gap: 7 },
  mapLabelText: { fontFamily: fonts.sairaRegular, fontSize: 10.5, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.textSecondary },
  mapFullBtn: { position: 'absolute', right: 12, top: 11, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 9, backgroundColor: colors.amberSoft, borderWidth: 1, borderColor: colors.amberBorder },
  mapFullBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 12, color: colors.amber },
  mapLegend: { position: 'absolute', left: '50%', bottom: 12, transform: [{ translateX: -55 }], flexDirection: 'row', gap: 14, paddingHorizontal: 13, paddingVertical: 5, borderRadius: 9, backgroundColor: 'rgba(24,23,28,.72)' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendText: { fontFamily: fonts.sairaSemiBold, fontSize: 11, color: colors.textPrimary },
  body: { padding: 15, paddingTop: 14 },
  title: { fontFamily: fonts.condensedBold, fontSize: 21, color: colors.textPrimary },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  subText: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14, padding: 12, backgroundColor: colors.surfaceAlt, borderRadius: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: fonts.condensedBold, fontSize: 22, color: colors.amber },
  statUnit: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
  statLabel: { fontFamily: fonts.sairaRegular, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSecondary, marginTop: 4 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 14 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  actionText: { fontFamily: fonts.sairaSemiBold, fontSize: 14, color: colors.textSecondary },
  cta: { marginTop: 14, width: '100%', height: 46, borderRadius: 13, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  ctaText: { fontFamily: fonts.sairaSemiBold, fontSize: 15, color: '#fff' },
});
