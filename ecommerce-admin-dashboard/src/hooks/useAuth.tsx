"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import { useRouter } from 'next/navigation';
import * as auth from '../lib/auth';

type User = {
  id?: string;
  email?: string;
  role?: string;
} | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ INIT AUTH
  useEffect(() => {
    const token = auth.getLocalToken();

    if (auth.isTokenValid(token)) {
      const parsed = auth.parseJwt(token);
      setUser({
        id: parsed.sub,
        email: parsed.email,
        role: parsed.role,
      });
    } else {
      auth.logout();
      setUser(null);
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    const res = await auth.login({ email, password });

    const token = res?.accessToken || auth.getLocalToken();

    if (!auth.isTokenValid(token)) {
      throw new Error('Invalid token');
    }

    const parsed = auth.parseJwt(token);

    // ✅ ADMIN CHECK
    if (parsed?.role !== 'admin') {
      throw new Error('Access denied: not admin');
    }

    setUser({
      id: parsed.sub,
      email: parsed.email,
      role: parsed.role,
    });

    router.push('/dashboard');

    return res;
  };

  // ✅ LOGOUT
  const logout = async () => {
    await auth.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}