import { useState } from 'react';
import { shopApi } from '../../Link/api';

export function useCoinbasePurchase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const purchase = async (amount) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await shopApi.buyCoins({
        amount,
        method: 'coinbase',
      });

      if (response.data) {
        const { hostedUrl } = response.data;
        window.open(hostedUrl, '_blank');
        return response.data;
      }
    } catch (err) {
      const message =
        err.response?.status === 400
          ? 'Already bought - you have already purchased this item'
          : err.response?.data?.message || 'Purchase failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return { purchase, isLoading, error, clearError };
}
