import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { User, Session, SupabaseClient, Subscription } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef<SupabaseClient | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const supabase = await getSupabase();
      if (!mounted) return;
      
      supabaseRef.current = supabase;

      // Handle URL hash tokens from magic link
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('access_token')) {
        // Clear hash from URL
        window.history.replaceState(null, '', window.location.pathname);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      subscriptionRef.current = subscription;
    }

    init();

    return () => {
      mounted = false;
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = async (email: string) => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/partners`,
      },
    });
    return { error };
  };

  const signInWithPassword = async (email: string, password: string) => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithMagicLink, signInWithPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
