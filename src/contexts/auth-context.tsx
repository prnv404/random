
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

interface AuthContextType {
  authToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  authToken: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const fetchToken = async () => {
        try {
          const token = await getToken({ template: 'backend' });
          setAuthToken(token);
        } catch (error) {
          console.error("Error fetching auth token:", error);
          setAuthToken(null);
        }
      };
      fetchToken();
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <AuthContext.Provider value={{ authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
