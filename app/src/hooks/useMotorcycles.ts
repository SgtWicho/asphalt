import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';

export type Motorcycle = {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number;
};

export function useMotorcycles() {
  const { session } = useAuth();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!session?.user.id) {
      setMotorcycles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    return supabase
      .from('motorcycles')
      .select('id, user_id, brand, model, year')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMotorcycles(data ?? []);
        setLoading(false);
      });
  }, [session?.user.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addMotorcycle = async (brand: string, model: string, year: number) => {
    if (!session?.user.id) return { error: 'No autenticado' };
    const { error } = await supabase
      .from('motorcycles')
      .insert({ user_id: session.user.id, brand, model, year });
    if (!error) await refresh();
    return { error: error?.message ?? null };
  };

  const removeMotorcycle = async (id: string) => {
    const { error } = await supabase.from('motorcycles').delete().eq('id', id);
    if (!error) await refresh();
    return { error: error?.message ?? null };
  };

  return { motorcycles, loading, addMotorcycle, removeMotorcycle, refresh };
}
