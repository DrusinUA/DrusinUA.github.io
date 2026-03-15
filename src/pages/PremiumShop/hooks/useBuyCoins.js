import { useState } from 'react';
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { calamityShopAbi } from '@shared/lib/web3/contracts/abis/calamityShopAbi.js';
import { CALAMITY_COIN_SHOP_CONTRACT, RONIN_CHAIN_ID } from '@shared/lib/constants/constants.js';
import { parseUnits } from 'viem';

export const useBuyCoins = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient({ chainId: RONIN_CHAIN_ID });
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
    } = useWaitForTransactionReceipt({ hash });

    const buyCoins = async (userId, amount) => {
        if (!address) {
            setError('No wallet connected');
            return false;
        }

        setError(null);

        try {
            const amountInWei = parseUnits(amount.toString(), 6); // USDC 6 decimals
            const callParams = {
                address: CALAMITY_COIN_SHOP_CONTRACT,
                abi: calamityShopAbi,
                functionName: 'buy',
                args: [userId, amountInWei, address],
                account: address,
            };

            // Static call to check tx won't revert
            await publicClient.simulateContract(callParams);

            const tx = await writeContractAsync(callParams);
            return tx;
        } catch (err) {
            console.error('Buy coins error:', err);
            setError(err.shortMessage || err.message || 'Failed to buy coins');
            return false;
        }
    };

    return {
        buyCoins,
        isLoading: isWriting || isConfirming,
        isSuccess,
        txHash: hash,
        error: error || writeError?.message || txError?.message,
        reset
    };
};
