import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import { TOKEN_KEY } from '../api/apiClient';

export const AuthContext = createContext(null);

/**
 * Holds { user, token, authStatus }.
 * authStatus: "loading" (checking stored token) | "authenticated" | "guest"
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authStatus, setAuthStatus] = useState(() =>
    localStorage.getItem(TOKEN_KEY) ? 'loading' : 'guest'
  );

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthStatus('guest');
  }, []);

  const saveSession = useCallback(({ token: newToken, user: newUser }) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setAuthStatus('authenticated');
  }, []);

  // On startup: validate any stored token with GET /auth/me.
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setAuthStatus('guest');
      return undefined;
    }

    let cancelled = false;
    authApi
      .getCurrentUser()
      .then((data) => {
        if (cancelled) return;
        setToken(storedToken);
        setUser(data.user);
        setAuthStatus('authenticated');
      })
      .catch(() => {
        if (!cancelled) clearSession();
      });

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      saveSession(data);
      return data;
    },
    [saveSession]
  );

  const register = useCallback(
    async (details) => {
      const data = await authApi.register(details);
      saveSession(data);
      return data;
    },
    [saveSession]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the request fails (e.g. expired token) we still sign out locally.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, token, authStatus, login, register, logout, setUser }),
    [user, token, authStatus, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
