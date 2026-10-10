'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'founder' | 'investor' | 'admin';
  avatar?: string;
}

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    if (password !== 'family') throw new Error('Invalid credentials');
    setIsLoading(true);
    try {
      setUser({
        id: 'user-1',
        email,
        name: email.split('@')[0],
        role: 'founder',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
