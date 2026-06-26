import { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useProfile } from '../hooks/useProfile';
import { useMotorcycles } from '../hooks/useMotorcycles';

const STATS = [
  { l: 'Publicaciones', n: 0 },
  { l: 'Seguidores', n: 0 },
  { l: 'Seguidos', n: 0 },
];

function AddMotorcycleForm({ onAdd, onCancel }: { onAdd: (brand: string, model: string, year: number) => Promise<{ error: string | null }>; onCancel: () => void }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    const yearNum = parseInt(year, 10);
    if (!brand.trim() || !model.trim() || !yearNum) {
      setError('Completa marca, modelo y año.');
      return;
    }
    setSaving(true);
    const { error: addError } = await onAdd(brand.trim(), model.trim(), yearNum);
    setSaving(false);
    if (addError) setError(addError);
    else onCancel();
  };

  return (
    <View style={styles.motoForm}>
      <TextInput style={styles.motoInput} placeholder="Marca" placeholderTextColor={colors.textSecondary} value={brand} onChangeText={setBrand} />
      <TextInput style={styles.motoInput} placeholder="Modelo" placeholderTextColor={colors.textSecondary} value={model} onChangeText={setModel} />
      <TextInput style={styles.motoInput} placeholder="Año" placeholderTextColor={colors.textSecondary} keyboardType="number-pad" value={year} onChangeText={setYear} />
      {error && <Text style={styles.motoError}>{error}</Text>}
      <View style={styles.motoFormActions}>
        <Pressable style={styles.motoCancelBtn} onPress={onCancel}>
          <Text style={styles.motoCancelText}>Cancelar</Text>
        </Pressable>
        <Pressable style={styles.motoSaveBtn} onPress={onSubmit} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.motoSaveText}>Guardar</Text>}
        </Pressable>
      </View>
    </View>
  );
}

export default function PerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, loading, refresh: refreshProfile } = useProfile();
  const { motorcycles, addMotorcycle, removeMotorcycle, refresh: refreshMotorcycles } = useMotorcycles();
  const [showAddMoto, setShowAddMoto] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
      refreshMotorcycles();
    }, [refreshProfile, refreshMotorcycles])
  );

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
        <Text style={styles.bio}>{profile?.bio || 'Sin biografía todavía.'}</Text>
      </View>

      <Pressable style={styles.editBtn} onPress={() => navigation.navigate('EditarPerfil')}>
        <Text style={styles.editBtnText}>Editar perfil</Text>
      </Pressable>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis motos</Text>
          <Pressable onPress={() => setShowAddMoto((v) => !v)}>
            <Text style={styles.addMotoText}>{showAddMoto ? 'Cerrar' : 'Añadir moto'}</Text>
          </Pressable>
        </View>

        {showAddMoto && <AddMotorcycleForm onAdd={addMotorcycle} onCancel={() => setShowAddMoto(false)} />}

        {motorcycles.length === 0 && !showAddMoto && (
          <Text style={styles.emptyText}>Aún no agregaste motos.</Text>
        )}

        {motorcycles.map((m) => (
          <View key={m.id} style={styles.motoCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.motoName}>{m.brand} {m.model}</Text>
              <Text style={styles.motoYear}>{m.year}</Text>
            </View>
            <Pressable onPress={() => removeMotorcycle(m.id)}>
              <Text style={styles.deleteText}>Borrar</Text>
            </Pressable>
          </View>
        ))}
      </View>

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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: fonts.semiCondensedBold, fontSize: 16, color: colors.textPrimary },
  addMotoText: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.amber },
  emptyText: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
  motoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, padding: 14 },
  motoName: { fontFamily: fonts.sairaSemiBold, fontSize: 13.5, color: colors.textPrimary },
  motoYear: { fontFamily: fonts.sairaRegular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  deleteText: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.red },
  motoForm: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, gap: 10 },
  motoInput: {
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontFamily: fonts.sairaRegular,
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  motoError: { fontFamily: fonts.sairaRegular, fontSize: 12, color: colors.red },
  motoFormActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  motoCancelBtn: { paddingHorizontal: 14, height: 38, alignItems: 'center', justifyContent: 'center' },
  motoCancelText: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: colors.textSecondary },
  motoSaveBtn: { paddingHorizontal: 18, height: 38, borderRadius: 10, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  motoSaveText: { fontFamily: fonts.sairaSemiBold, fontSize: 13, color: '#fff' },
  gridPlaceholder: { height: 160, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSoft, alignItems: 'center', justifyContent: 'center' },
  gridPlaceholderText: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.textSecondary },
});
