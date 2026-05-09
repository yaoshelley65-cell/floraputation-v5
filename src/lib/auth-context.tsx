"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase, getUserProfile, type User } from "./supabase";

interface AuthContextValue {
  user: SupabaseUser | null;
  profile: User | null;
  session: Session | null;
  loading: boolean;
  hasInvitationCode: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  hasInvitationCode: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await getUserProfile(user.id);
    setProfile(p);
  }, [user]);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load profile whenever user changes
  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then(setProfile);
    } else {
      setProfile(null);
    }
  }, [user]);

  const hasInvitationCode = !!profile?.invitation_code;

  return (
    <AuthContext.Provider
      value={{ user, profile, session, loading, hasInvitationCode, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
