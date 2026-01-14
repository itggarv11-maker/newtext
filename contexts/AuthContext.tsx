import React, { createContext, useContext, useState, ReactNode } from 'react';
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

// Hardcoded user for instant access across the entire app
const DUMMY_USER: any = {
    uid: "omega_user_dev_bypass",
    email: "operator@stubro.ai",
    displayName: "ASTRA OPERATOR"
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always authenticated, never loading
  const [currentUser] = useState<FirebaseUser | null>(DUMMY_USER);
  const [userName] = useState<string | null>("ASTRA OPERATOR");
  const [isPremium] = useState<boolean>(true);
  const [loading] = useState(false);
  const [tokens] = useState<number | null>(999999);

  const signup = async () => ({ user: DUMMY_USER });
  const login = async () => ({ user: DUMMY_USER });
  const loginWithGoogle = async () => ({ user: DUMMY_USER });
  const logout = async () => {
      console.log("Logout bypassed in dev mode");
      window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ currentUser, userName, isPremium, loading, tokens, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};