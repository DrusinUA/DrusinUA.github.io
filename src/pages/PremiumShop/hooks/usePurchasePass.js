import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { shopAbi } from '@shared/lib/web3/contracts/abis/shopAbi.js';
import { CALAMITY_SHOP_CONTRACT, USDC, RONIN_CHAIN_ID } from '@shared/lib/constants/constants.js';

export const usePurchasePass = () => {
    const { address } = useAccount();
    const [error, setError] = useState(null);

    const {
        data: hash,
        writeContractAsync,
        isPending: isWriting,
        error: writeError,
        reset
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess,
        error: txError
    } = useWaitForTransactionReceipt({
        hash,
    });

    const purchasePass = async (userId, signature) => {
        if (!address) {
            setError('No wallet connected');
            return false;
        }

        setError(null);

        try {
            const tx = await writeContractAsync({
                address: CALAMITY_SHOP_CONTRACT,
                abi: shopAbi,
                functionName: 'purchasePass',
                args: [
                    USDC[RONIN_CHAIN_ID],
                    userId,
                    signature
                ],
            });

            return tx;
        } catch (err) {
            console.error('Purchase pass error:', err);
            setError(err.message || 'Failed to purchase pass');
            return false;
        }
    };

    return {
        purchasePass,
        isLoading: isWriting || isConfirming,
        isSuccess,
        txHash: hash,
        error: error || writeError?.message || txError?.message,
        reset
    };
};
