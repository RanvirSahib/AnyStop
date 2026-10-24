import React, { createContext, useContext, useState } from 'react';

export interface UserSession {
  name: string;
  isGuest?: boolean;
  ticketNo?: string;
  boardedAt?: number;
}

interface AuthContextType {
  currentUser: UserSession | null;
  login: (user: UserSession) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('anystop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (user: UserSession) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('anystop_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('anystop_user');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: Boolean(currentUser) }}>
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
