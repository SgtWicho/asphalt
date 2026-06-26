import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { useProfile } from '../hooks/useProfile';

export default function EditarPerfilScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { session } = useAuth();
  const { profile, refresh } = useProfile();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickAvatar = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Necesitamos permiso para acceder a tus fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !session?.user.id) return;

    setUploading(true);
    try {
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();
      const ext = asset.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${session.user.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, { contentType: asset.mimeType ?? 'image/jpeg', upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    setError(null);
    if (!username.trim()) {
      setError('El username no puede estar vacío.');
      return;
    }
    if (!session?.user.id) return;
    setSaving(true);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl,
      })
      .eq('id', session.user.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await refresh();
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Editar perfil</Text>
      </View>

      <View style={styles.avatarSection}>
        <Pressable onPress={pickAvatar} style={styles.avatarWrap} disabled={uploading}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{(fullName || username || '?').charAt(0).toUpperCase()}</Text>
            </View>
          )}
          {uploading && (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </Pressable>
        <Pressable onPress={pickAvatar} disabled={uploading}>
          <Text style={styles.changePhotoText}>Cambiar foto</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre completo"
          placeholderTextColor={colors.textSecondary}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="tu-username"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Cuéntanos algo sobre ti"
          placeholderTextColor={colors.textSecondary}
          multiline
          value={bio}
          onChangeText={setBio}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.saveBtn} onPress={onSave} disabled={saving || uploading}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Guardar cambios</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 60, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22, color: colors.textPrimary, marginTop: -2 },
  title: { fontFamily: fonts.condensedBold, fontSize: 22, color: colors.textPrimary },
  avatarSection: { alignItems: 'center', gap: 10, marginTop: 28 },
  avatarWrap: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surface },
  avatarFallback: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' },
  avatarFallbackText: { fontFamily: fonts.condensedBold, fontSize: 32, color: colors.bg },
  avatarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  changePhotoText: { fontFamily: fonts.sairaSemiBold, fontSize: 13.5, color: colors.amber },
  form: { paddingHorizontal: 24, marginTop: 28, gap: 8 },
  label: { fontFamily: fonts.sairaSemiBold, fontSize: 12.5, color: colors.textSecondary, marginTop: 12 },
  input: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontFamily: fonts.sairaRegular,
    fontSize: 14.5,
    color: colors.textPrimary,
  },
  bioInput: { height: 90, paddingTop: 12, textAlignVertical: 'top' },
  error: { fontFamily: fonts.sairaRegular, fontSize: 13, color: colors.red, marginTop: 8 },
  saveBtn: { height: 52, borderRadius: 15, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  saveBtnText: { fontFamily: fonts.sairaSemiBold, fontSize: 15.5, color: '#fff' },
});
