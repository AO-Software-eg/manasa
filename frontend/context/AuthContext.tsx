'use client';

import { useEffect, useState, createContext } from 'react';
import { api } from '@/app/hooks/api';

type AuthContextType = {
  loggedIn: boolean | null;
  setLoggedIn: (value: boolean) => void;
  isLoading: boolean;
  userData?: any;
};

export const AuthContext = createContext<AuthContextType>({
  loggedIn: null,
  setLoggedIn: () => {},
  isLoading: true,
  userData: undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await api.get('/me');
        console.log('res:', res.data); // is sessionData there?
        console.log('loggedIn:', !!res.data.sessionData);
        setUserData(res.data.sessionData);
        setLoggedIn(!!res.data.sessionData);
      } catch (err) {
        console.log('auth error:', err);
        setLoggedIn(false);
      } finally {
        setIsLoading(false);
        console.log('isLoading set to false'); // does this run?
      }
    };
    authCheck();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, isLoading, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
