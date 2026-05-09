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
  register: (data: RegisterData) => Promise<void>;
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
    await logoutUser();
    setUser(null);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await registerUser(data);
    const profile = await fetchCurrentUserProfile();
    setUser(profile);
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

    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setUser(null);
        return;
      }
      const profile = await fetchCurrentUserProfile();
      setUser(profile);
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
