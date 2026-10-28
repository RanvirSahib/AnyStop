import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  signInWithSupabase,
  signUpWithSupabase,
  signOutFromSupabase,
  updateSupabaseProfile,
  saveProfileAvatar,
  removeProfileAvatar,
  signInWithGoogleOAuth,
  sendOtpToIdentifier,
  verifyOtpWithSupabase,
  signUpWithOtp as signUpWithOtpService,
  AuthResult,
} from '../services/authService';

export interface UserSession {
  id?: string;
  name: string;
  isGuest?: boolean;
  ticketNo?: string;
  boardedAt?: number;
  phoneOrEmail?: string;
  homeStop?: string;
  preferredClass?: string;
  totalSearches?: number;
  avatarUrl?: string;
}

interface AuthContextType {
  currentUser: UserSession | null;
  login: (user: UserSession) => void;
  updateUser: (updates: Partial<UserSession>) => Promise<boolean>;
  uploadAvatarImage: (dataUrlOrBlob: string | Blob) => Promise<{ success: boolean; avatarUrl?: string; error?: string }>;
  removeAvatarImage: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isSupabaseActive: boolean;
  isLoadingAuth: boolean;
  signInWithCredentials: (identifier: string, password: string) => Promise<AuthResult>;
  signUpWithCredentials: (name: string, identifier: string, password: string, ticketNo?: string, phone?: string) => Promise<AuthResult>;
  sendOtpCode: (identifier: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  signInWithOtp: (identifier: string, token: string) => Promise<AuthResult>;
  signUpWithOtp: (name: string, identifier: string, token: string, ticketNo?: string, phone?: string) => Promise<AuthResult>;
  signInWithGoogleAuth: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSupabaseActive = isSupabaseConfigured();
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('anystop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync session with Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (!isSupabaseActive || !supabase) {
        setIsLoadingAuth(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          // Fetch corresponding profile from Postgres
          let dbName: string | undefined;
          let dbHomeStop: string | undefined;
          let dbTicketNo: string | undefined;
          let dbPrefClass: string | undefined;
          let dbAvatar: string | undefined;
          let dbSearches = 0;

          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              dbName = profile.name;
              dbHomeStop = profile.home_stop;
              dbTicketNo = profile.ticket_no;
              dbPrefClass = profile.preferred_class;
              dbAvatar = profile.avatar_url;
              dbSearches = profile.total_searches || 0;
            }
          } catch (profileErr) {
            console.warn('Profile fetch note:', profileErr);
          }

          const meta = session.user.user_metadata || {};
          const displayName =
            dbName ||
            meta.name ||
            (session.user.email ? session.user.email.split('@')[0] : 'Passenger');

          const userObj: UserSession = {
            id: session.user.id,
            name: displayName,
            phoneOrEmail: meta.phone || session.user.email || '',
            ticketNo: dbTicketNo || meta.ticketNo || `NO. ${Math.floor(Math.random() * 8999 + 1000)}`,
            boardedAt: Date.now(),
            homeStop: dbHomeStop || meta.homeStop || 'Chandigarh ISBT-43',
            preferredClass: dbPrefClass || meta.preferredClass || 'All Types',
            totalSearches: dbSearches,
            avatarUrl: dbAvatar || meta.avatarUrl || undefined,
          };

          setCurrentUser(userObj);
          localStorage.setItem('anystop_user', JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn('Error reading Supabase session on startup:', err);
      } finally {
        if (isMounted) setIsLoadingAuth(false);
      }
    }

    initSession();

    // Listen to live auth changes (e.g., token refreshes, logouts)
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (isSupabaseActive && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem('anystop_user');
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Handled during login/signup calls
        }
      });
      authListener = data;
    }

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [isSupabaseActive]);

  const login = useCallback((user: UserSession) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('anystop_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserSession>): Promise<boolean> => {
    let success = true;
    let userId = currentUser?.id;
    if (!userId && isSupabaseActive && supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        userId = data.user?.id;
      } catch (e) {
        console.warn('Could not read user id:', e);
      }
    }

    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates, id: userId || prev.id };
      try {
        localStorage.setItem('anystop_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (userId && isSupabaseActive) {
      try {
        success = await updateSupabaseProfile(userId, updates);
      } catch (err) {
        console.error('Failed to sync profile update to Supabase:', err);
        success = false;
      }
    }

    return success;
  }, [currentUser, isSupabaseActive]);

  const uploadAvatarImage = useCallback(async (dataUrlOrBlob: string | Blob) => {
    let userId = currentUser?.id;
    if (!userId && isSupabaseActive && supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        userId = data.user?.id;
      } catch (e) {
        console.warn('Could not read user id:', e);
      }
    }

    let finalAvatarUrl: string | undefined = typeof dataUrlOrBlob === 'string' ? dataUrlOrBlob : undefined;

    if (userId && isSupabaseActive) {
      const res = await saveProfileAvatar(userId, dataUrlOrBlob);
      if (res.success && res.avatarUrl) {
        finalAvatarUrl = res.avatarUrl;
      }
    }

    if (finalAvatarUrl) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, id: userId || prev.id, avatarUrl: finalAvatarUrl };
        try {
          localStorage.setItem('anystop_user', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }

    return { success: true, avatarUrl: finalAvatarUrl };
  }, [currentUser, isSupabaseActive]);

  const removeAvatarImage = useCallback(async (): Promise<boolean> => {
    let userId = currentUser?.id;
    if (!userId && isSupabaseActive && supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        userId = data.user?.id;
      } catch (e) {
        console.warn('Could not read user id:', e);
      }
    }

    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, avatarUrl: undefined };
      try {
        localStorage.setItem('anystop_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (userId && isSupabaseActive) {
      await removeProfileAvatar(userId);
    }
    return true;
  }, [currentUser, isSupabaseActive]);

  const logout = useCallback(async () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('anystop_user');
    } catch {
      // ignore
    }
    if (isSupabaseActive) {
      await signOutFromSupabase();
    }
  }, [isSupabaseActive]);

  const signInWithCredentials = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
    if (isSupabaseActive) {
      const res = await signInWithSupabase(identifier, password);
      if (res.success && res.user) {
        login(res.user);
      }
      return res;
    }

    // Local / Demo mode fallback when Supabase credentials are not yet configured
    const who = identifier.includes('@') ? identifier.split('@')[0] : 'Passenger';
    const fallbackUser: UserSession = {
      name: who,
      phoneOrEmail: identifier,
      ticketNo: `NO. ${Math.floor(Math.random() * 4000) + 1000}`,
      boardedAt: Date.now(),
      homeStop: 'Chandigarh ISBT-43',
      preferredClass: 'All Types',
      totalSearches: 0,
    };
    login(fallbackUser);
    return { success: true, user: fallbackUser };
  }, [isSupabaseActive, login]);

  const signUpWithCredentials = useCallback(async (
    name: string,
    identifier: string,
    password: string,
    ticketNo?: string,
    phone?: string
  ): Promise<AuthResult> => {
    if (isSupabaseActive) {
      const res = await signUpWithSupabase(name, identifier, password, ticketNo, phone);
      if (res.success && res.user) {
        login(res.user);
      }
      return res;
    }

    // Local / Demo mode fallback when Supabase credentials are not yet configured
    const fallbackUser: UserSession = {
      name,
      phoneOrEmail: identifier,
      ticketNo: ticketNo || `NO. ${Math.floor(Math.random() * 4000) + 5000}`,
      boardedAt: Date.now(),
      homeStop: 'Chandigarh ISBT-43',
      preferredClass: 'All Types',
      totalSearches: 0,
    };
    login(fallbackUser);
    return { success: true, user: fallbackUser };
  }, [isSupabaseActive, login]);

  const sendOtpCode = useCallback(async (identifier: string) => {
    return await sendOtpToIdentifier(identifier);
  }, []);

  const signInWithOtp = useCallback(async (identifier: string, token: string): Promise<AuthResult> => {
    if (isSupabaseActive) {
      const res = await verifyOtpWithSupabase(identifier, token);
      if (res.success && res.user) {
        login(res.user);
      }
      return res;
    }

    const who = identifier.includes('@') ? identifier.split('@')[0] : 'Passenger';
    const fallbackUser: UserSession = {
      name: who,
      phoneOrEmail: identifier,
      ticketNo: `NO. ${Math.floor(Math.random() * 4000) + 1000}`,
      boardedAt: Date.now(),
      homeStop: 'Chandigarh ISBT-43',
      preferredClass: 'All Types',
      totalSearches: 0,
    };
    login(fallbackUser);
    return { success: true, user: fallbackUser };
  }, [isSupabaseActive, login]);

  const signUpWithOtp = useCallback(async (
    name: string,
    identifier: string,
    token: string,
    ticketNo?: string,
    phone?: string
  ): Promise<AuthResult> => {
    if (isSupabaseActive) {
      const res = await signUpWithOtpService(name, identifier, token, ticketNo, phone);
      if (res.success && res.user) {
        login(res.user);
      }
      return res;
    }

    const fallbackUser: UserSession = {
      name,
      phoneOrEmail: identifier,
      ticketNo: ticketNo || `NO. ${Math.floor(Math.random() * 4000) + 5000}`,
      boardedAt: Date.now(),
      homeStop: 'Chandigarh ISBT-43',
      preferredClass: 'All Types',
      totalSearches: 0,
    };
    login(fallbackUser);
    return { success: true, user: fallbackUser };
  }, [isSupabaseActive, login]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        updateUser,
        uploadAvatarImage,
        removeAvatarImage,
        logout,
        isAuthenticated: Boolean(currentUser),
        isSupabaseActive,
        isLoadingAuth,
        signInWithCredentials,
        signUpWithCredentials,
        sendOtpCode,
        signInWithOtp,
        signUpWithOtp,
        signInWithGoogleAuth: signInWithGoogleOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
