import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FirebaseUser } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userName: string | null;
  isPremium: boolean;
  loading: boolean;
  tokens: number | null;
  signup: (email: string, pass: string, name: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth error');
  return context;
};

// Hardcoded user for instant access
const DUMMY_USER: any = {
    uid: "omega_user_dev",
    email: "operator@stubro.ai",
    displayName: "ASTRA OPERATOR"
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(DUMMY_USER);
  const [userName, setUserName] = useState<string | null>("ASTRA OPERATOR");
  const [isPremium, setIsPremium] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<number | null>(999999);

  const signup = async () => ({ user: DUMMY_USER });
  const login = async () => ({ user: DUMMY_USER });
  const loginWithGoogle = async () => ({ user: DUMMY_USER });
  const logout = async () => {
      // In bypass mode, logout does nothing or we could refresh
      window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ currentUser, userName, isPremium, loading, tokens, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};