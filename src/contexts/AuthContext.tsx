import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { fetchCurrentUserProfile, loginUser, logoutUser, registerUser } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<User | null>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const profile = await fetchCurrentUserProfile();
        if (mounted) setUser(profile);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setUser(null);
        return;
      }

      // Avoid async deadlocks inside Supabase auth callback.
      setTimeout(async () => {
        if (!mounted) return;
        try {
          const profile = await fetchCurrentUserProfile();
          if (mounted) setUser(profile);
        } catch {
          if (mounted) setUser(null);
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
