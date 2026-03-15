import { useState, useEffect, useCallback, useRef } from 'react';
import { authApi } from '../../api';

const SESSION_CHECK_INTERVAL = 30000; // 30 seconds

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  // Listen for event from interceptor when refresh fails
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Check current session (refresh + me)
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      // First refresh to update tokens
      await authApi.refresh();
      // Then get user data
      const response = await authApi.me();
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch {
      // If refresh or me failed - no session
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Silent session check (without isLoading so UI doesn't flicker)
  const silentCheckAuth = useCallback(async () => {
    try {
      await authApi.refresh();
      const response = await authApi.me();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Polling: check session every 30 sec while authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(silentCheckAuth, SESSION_CHECK_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [isAuthenticated, silentCheckAuth]);

  // Reset state
  const clearAuth = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    setUser,
    setIsAuthenticated,
    clearAuth,
  };
}
