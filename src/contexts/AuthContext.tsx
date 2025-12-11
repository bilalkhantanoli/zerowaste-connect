import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
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

// Mock user data for demonstration
const mockUsers: Record<UserRole, User> = {
  donor: {
    id: 'd1',
    email: 'donor@example.com',
    name: 'Green Valley Restaurant',
    role: 'donor',
    rating: 4.8,
    verified: true,
    createdAt: new Date(),
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: '123 Food Street',
      city: 'New York',
      country: 'USA',
    },
  },
  recipient: {
    id: 'r1',
    email: 'recipient@example.com',
    name: 'Hope Community Center',
    role: 'recipient',
    rating: 4.9,
    verified: true,
    createdAt: new Date(),
    location: {
      lat: 40.7282,
      lng: -73.7949,
      address: '456 Hope Avenue',
      city: 'New York',
      country: 'USA',
    },
  },
  volunteer: {
    id: 'v1',
    email: 'volunteer@example.com',
    name: 'Alex Johnson',
    role: 'volunteer',
    rating: 4.7,
    verified: true,
    createdAt: new Date(),
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '789 Delivery Lane',
      city: 'New York',
      country: 'USA',
    },
  },
  admin: {
    id: 'a1',
    email: 'admin@zerowaste.com',
    name: 'Admin User',
    role: 'admin',
    rating: 5.0,
    verified: true,
    createdAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser(mockUsers[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      rating: 0,
      verified: false,
      createdAt: new Date(),
    };
    setUser(newUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
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
