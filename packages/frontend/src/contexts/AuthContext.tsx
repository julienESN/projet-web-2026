import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, ApiError } from '../lib/api';
import { AuthResponseSchema, UserProfileSchema, type LoginDto, type RegisterDto } from 'contracts';
import type { z } from 'zod';

type AuthResponse = z.infer<typeof AuthResponseSchema>;
type UserProfile = z.infer<typeof UserProfileSchema>;

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.get('/auth/me', { 
          token, 
          schema: UserProfileSchema 
        });
        setUser(profile);
      } catch (err) {
        // Token invalid, clear it
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  const login = useCallback(async (credentials: LoginDto) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials, {
        schema: AuthResponseSchema,
      });
      
      const newToken = response.access_token;
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      
      // Fetch user profile with the new token
      const profile = await api.get('/auth/me', {
        token: newToken,
        schema: UserProfileSchema,
      });
      setUser(profile);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Erreur de connexion';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await api.post<AuthResponse>('/auth/register', data, {
        schema: AuthResponseSchema,
      });
      
      const newToken = response.access_token;
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      
      // Fetch user profile with the new token
      const profile = await api.get('/auth/me', {
        token: newToken,
        schema: UserProfileSchema,
      });
      setUser(profile);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Erreur lors de l'inscription";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
