import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';

export type Profile = {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!session?.user.id) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    return supabase
      .from('profiles')
      .select('username, full_name, avatar_url, bio')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data ?? null);
        setLoading(false);
      });
  }, [session?.user.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, refresh };
}
