import { useState, useCallback } from 'react';
import { useSignTypedData } from 'wagmi';
import { walletApi } from '../../api';

export function useLinkWallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signTypedDataAsync } = useSignTypedData();

  const linkWallet = useCallback(async (address) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Get nonce and expiration
      const paramsResponse = await walletApi.getSigningParams('link_wallet');
      const { nonce, expirationDate } = paramsResponse.data;

      // Step 2: Sign EIP-712 message
      const domain = {
        name: 'CalamityWebApp',
        version: '1',
        verifyingContract: '0x0000000000000000000000000000000000000000',
      };

      const types = {
        CalamityWebApp: [
          { name: 'nonce', type: 'bytes32' },
          { name: 'expirationDate', type: 'uint256' },
        ],
      };

      const message = {
        nonce,
        expirationDate,
      };

      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: 'CalamityWebApp',
        message,
      });

      // Step 3: Send to server
      const response = await walletApi.link({
        address: address.toLowerCase(),
        signature,
        nonce,
        expirationDate,
      });

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to link wallet';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [signTypedDataAsync]);

  const clearError = useCallback(() => setError(null), []);

  return {
    linkWallet,
    isLoading,
    error,
    clearError,
  };
}
