import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getTokens, getStoredUser, clearTokens, clearStoredUser } from '../api/client.js';
import * as authApi from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // If the API client detects an unrecoverable 401 (refresh failed), drop
  // the local session so the UI redirects to /login.
  useEffect(() => {
    function onSessionExpired() {
      setUser(null);
    }
    window.addEventListener('tm:session-expired', onSessionExpired);
    return () => window.removeEventListener('tm:session-expired', onSessionExpired);
  }, []);

  const signup = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await authApi.signup(payload);
      setUser(u);
      return u;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await authApi.login(payload);
      setUser(u);
      return u;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const { refreshToken } = getTokens();
    try {
      await authApi.logout(refreshToken);
    } catch {
      // Even if the network call fails, drop the local session.
      clearTokens();
      clearStoredUser();
    }
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
