import { useState } from 'react';
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { calamityBuyRouterAbi } from '@shared/lib/web3/contracts/abis/calamityBuyRouterAbi.js';
import { CALAMITY_BUY_ROUTER_CONTRACT, RONIN_CHAIN_ID } from '@shared/lib/constants/constants.js';

export const useBuyRouter = () => {
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

    // Buy with ERC20 token via swap
    const buyWithToken = async (userId, tokenIn, amountIn, swapTarget, swapCalldata, minAmountOut) => {
        if (!address) {
            setError('No wallet connected');
            return false;
        }
        setError(null);

        try {
            const callParams = {
                address: CALAMITY_BUY_ROUTER_CONTRACT,
                abi: calamityBuyRouterAbi,
                functionName: 'buy',
                args: [userId, tokenIn, amountIn, swapTarget, swapCalldata, minAmountOut],
                account: address,
            };

            await publicClient.simulateContract(callParams);

            const tx = await writeContractAsync(callParams);
            return tx;
        } catch (err) {
            console.error('Buy with token error:', err);
            setError(err.shortMessage || err.message || 'Failed to buy with token');
            return false;
        }
    };

    // Buy with native token (RON) via swap
    const buyWithNative = async (userId, swapTarget, swapCalldata, minAmountOut, value) => {
        if (!address) {
            setError('No wallet connected');
            return false;
        }
        setError(null);

        try {
            const callParams = {
                address: CALAMITY_BUY_ROUTER_CONTRACT,
                abi: calamityBuyRouterAbi,
                functionName: 'buyWithNative',
                args: [userId, swapTarget, swapCalldata, minAmountOut],
                value,
                account: address,
            };

            await publicClient.simulateContract(callParams);

            const tx = await writeContractAsync(callParams);
            return tx;
        } catch (err) {
            console.error('Buy with native error:', err);
            setError(err.shortMessage || err.message || 'Failed to buy with native token');
            return false;
        }
    };

    return {
        buyWithToken,
        buyWithNative,
        isLoading: isWriting || isConfirming,
        isSuccess,
        txHash: hash,
        error: error || writeError?.message || txError?.message,
        reset
    };
};
