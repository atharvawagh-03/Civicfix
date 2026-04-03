import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { setAuthToken, login as apiLogin, register as apiRegister } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('civicfix_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('civicfix_user', JSON.stringify(user));
    else localStorage.removeItem('civicfix_user');
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      async login(email, password) {
        const data = await apiLogin({ email, password });
        setAuthToken(data.token);
        setUser(data.user);
        return data;
      },
      async register(payload) {
        const data = await apiRegister(payload);
        setAuthToken(data.token);
        setUser(data.user);
        return data;
      },
      logout() {
        setAuthToken(null);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
