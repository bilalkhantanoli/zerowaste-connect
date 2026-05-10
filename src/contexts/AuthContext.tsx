import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/types';
import {
  fetchCurrentUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentUserProfile,
} from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<User | null>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}

interface UpdateProfileData {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserFromSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await fetchCurrentUserProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    const profile = await loginUser(email, password, role);
    setUser(profile);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    return registerUser(data);
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    const profile = await updateCurrentUserProfile(data);
    setUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await syncUserFromSession();
      } finally {
        if (!mounted) return;
      }
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Avoid async deadlocks inside Supabase auth callback.
      setTimeout(async () => {
        if (!mounted) return;
        try {
          const profile = await fetchCurrentUserProfile();
          if (mounted) setUser(profile);
        } catch {
          // Keep the current session user in place if profile refresh fails transiently.
        } finally {
          if (mounted) setIsLoading(false);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
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
