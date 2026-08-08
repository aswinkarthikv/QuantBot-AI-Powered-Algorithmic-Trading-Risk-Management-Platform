import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('quantbot_token');
      if (token) {
        try {
          const userData = await apiService.getMe();
          setUser(userData);
        } catch (e) {
          localStorage.removeItem('quantbot_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    await apiService.login(credentials);
    const userData = await apiService.getMe();
    setUser(userData);
  };

  const register = async (data: any) => {
    await apiService.register(data);
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem('quantbot_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
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
