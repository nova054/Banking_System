import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, userService, User, AuthResponse } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await userService.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const getAuthErrorMessage = (error: any, fallback: string) => {
    if (error?.response) {
      const status = error.response.status;
      const backendMessage = error.response.data?.message;
      if (status === 400 || status === 401) {
        return backendMessage || 'Invalid email or password';
      }
      return backendMessage || 'Server error. Please try again later.';
    }

    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
      return 'Cannot reach server. Please try again later.';
    }

    return fallback;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      
      // Fetch full user data including role
      const userData = await userService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userData.fullName}`,
      });
    } catch (error: any) {
      const message = getAuthErrorMessage(error, 'Login failed. Please try again.');
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const register = async (fullName: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await authService.register(fullName, email, password, confirmPassword);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      
      // Fetch full user data including role
      const userData = await userService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Account created!",
        description: "Welcome to NovaBank",
      });
    } catch (error: any) {
      const message = getAuthErrorMessage(error, 'Registration failed. Please try again.');
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
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
