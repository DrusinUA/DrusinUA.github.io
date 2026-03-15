import { useState, useCallback, useEffect, useRef } from 'react';
import { walletApi } from '../../api';

const POLL_INTERVAL = 5000;

export function useWalletList(enabled = false) {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await walletApi.list();
      setWallets(response.data.wallets || []);
      return response.data.wallets;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch wallets';
      setError(message);
      setWallets([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Polling every 5 seconds when enabled
  useEffect(() => {
    if (!enabled) {
      clearInterval(intervalRef.current);
      return;
    }

    fetchWallets().catch(() => {});
    intervalRef.current = setInterval(() => {
      fetchWallets().catch(() => {});
    }, POLL_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [enabled, fetchWallets]);

  const clearError = useCallback(() => setError(null), []);

  return {
    wallets,
    isLoading,
    error,
    fetchWallets,
    refetch: fetchWallets,
    clearError,
  };
}
