import { useState, useCallback } from 'react';
import { walletApi } from '../../api';

export function useWalletActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const unlinkWallet = useCallback(async (address) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await walletApi.unlink(address);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to unlink wallet';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setPrimary = useCallback(async (address) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await walletApi.setPrimary(address);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to set primary wallet';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLabel = useCallback(async (address, label) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await walletApi.setLabel(address, label);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to set label';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    unlinkWallet,
    setPrimary,
    setLabel,
    isLoading,
    error,
    clearError,
  };
}
