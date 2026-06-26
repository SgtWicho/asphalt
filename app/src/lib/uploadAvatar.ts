import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

export async function uploadAvatar(userId: string, base64: string, ext: string, contentType: string) {
  const path = `${userId}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, decode(base64), { contentType, upsert: true });
  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
