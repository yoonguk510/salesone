'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { TOKEN_KEY, USER_KEY, AUTH_ENDPOINTS } from '@/utils/constants';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// Define the response format from the backend
interface LoginResponse {
  access_token: string;
}

interface JWTPayload {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const loadStoredAuth = () => {
      if (typeof window !== 'undefined') {
        // Try to get token from localStorage first, then from cookies as fallback
        const storedToken = localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            
            // Ensure token is in both localStorage and cookies
            localStorage.setItem(TOKEN_KEY, storedToken);
            Cookies.set(TOKEN_KEY, storedToken, { expires: 7, path: '/' });
          } catch (error) {
            console.error('Failed to parse stored user', error);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            Cookies.remove(TOKEN_KEY, { path: '/' });
          }
        }
      }
      setLoading(false);
    };

    loadStoredAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    const response = await api.post<LoginResponse>(
      '/auth/login', 
      { username, password }, 
      { isAuthenticated: false }
    );
    
    setLoading(false);
    
    if (response.data && !response.error) {
      const accessToken = response.data.access_token;
      
      // Decode the JWT to get user information
      try {
        const decodedToken = jwtDecode<JWTPayload>(accessToken);
        const userData: User = {
          id: decodedToken.id,
          username: decodedToken.username
        };
        
        setToken(accessToken);
        setUser(userData);
        
        // Store in both localStorage and cookies
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        // Add token to cookies for middleware access
        // Set path to / to ensure it's available for all routes
        Cookies.set(TOKEN_KEY, accessToken, { expires: 7, path: '/' });
        
        console.log('Login successful:', userData);
        return true;
      } catch (error) {
        console.error('Failed to decode token', error);
        return false;
      }
    }
    
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    const response = await api.post(
      '/auth/register', 
      { username, password },
      { isAuthenticated: false }
    );
    
    setLoading(false);
    console.log('Registration successful:', response.data);
    if (response.data && !response.error) {
      // After successful registration, you might want to auto-login or redirect
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    Cookies.remove(TOKEN_KEY, { path: '/' });
    router.push('/auth/login');
  };

  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;