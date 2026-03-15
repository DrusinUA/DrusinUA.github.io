import { useState, useCallback } from 'react';
import { authApi } from '../../api';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch {
      // Ignore errors, clear state anyway
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new Event('auth:logout'));
    }
  }, []);

  const logoutAll = useCallback(async () => {
    setIsLoading(true);

    try {
      await authApi.logoutAll();
    } catch {
      // Ignore errors, clear state anyway
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new Event('auth:logout'));
    }
  }, []);

  return {
    logout,
    logoutAll,
    isLoading,
  };
}
