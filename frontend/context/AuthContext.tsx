'use client';

import { useEffect, useState, createContext } from 'react';
import { api } from '@/app/hooks/api';
import { userData } from '@/types';

type AuthContextType = {
  loggedIn: boolean | null;
  isLoading: boolean;
  userData?: any;
};



export const AuthContext = createContext<AuthContextType>({
  loggedIn: null,
  isLoading: true,
  userData: undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<userData>();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await api.get('/me');
        console.log('res:', res.data);
        console.log('loggedIn:', !!res.data);
        setUserData(res.data);
        setLoggedIn(!!res.data);
      } catch (err) {
        console.log('auth error:', err);
        setLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    authCheck();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, isLoading, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
