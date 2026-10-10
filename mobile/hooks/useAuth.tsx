import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiRequest, getTokens, clearTokens, saveTokens, Tokens } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
  profilePhoto?: string;
}

export interface Family {
  id: string;
  name: string;
  slug: string;
}

export interface AuthState {
  user: User | null;
  family: Family | null;
  role: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  relationship?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    family: null,
    role: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshUser = async () => {
    try {
      const data = await apiRequest<any>('/users/me');
      setState(prev => ({ ...prev, user: data.user }));
    } catch {
      // Ignore
    }
  };

  const loadSession = async () => {
    try {
      const tokens = await getTokens();
      if (!tokens) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      const data = await apiRequest<any>('/users/me');
      setState({
        user: data.user,
        family: data.family || null,
        role: data.role || null,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      await clearTokens();
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setState({
      user: data.user,
      family: data.family,
      role: data.role || null,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const register = async (data: RegisterData) => {
    const result = await apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    await saveTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    setState({
      user: result.user,
      family: result.family,
      role: 'ADMIN',
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    await clearTokens();
    setState({
      user: null,
      family: null,
      role: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}