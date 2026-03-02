'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState, LoginCredentials } from '@/types';
import authService from '@/services/auth.service';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setState({
            user: JSON.parse(storedUser),
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        const { user, token } = await authService.login(credentials);

        // Only allow admin and super-admin to access the panel
        if (!authService.isAdmin(user)) {
          throw new Error('Танд админ эрх байхгүй байна');
        }

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success('Амжилттай нэвтэрлээ!');
        router.push('/dashboard');
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        const message =
          error instanceof Error ? error.message : 'Нэвтрэхэд алдаа гарлаа';
        toast.error(message);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success('Амжилттай гарлаа');
      router.push('/login');
    }
  }, [router]);

  const isSuperAdmin = authService.isSuperAdmin(state.user);
  const isAdmin = authService.isAdmin(state.user);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isSuperAdmin,
        isAdmin,
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

export default AuthContext;
