import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import {MIGRATOR} from "@shared/lib/constants/constants.js";

// Minimal ABI for burn function
const MIGRATE_ABI = [
    {
        inputs: [
            { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' }
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];


export const useMigrateArtifacts = () => {
    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const [txHash, setTxHash] = useState(null);
    const [txError, setTxError] = useState(null);
    const [isTxLoading, setIsTxLoading] = useState(false);

    // Function to execute burn transaction (artifact migration)
    // ids - array of NFT ids to burn
    const migrateArtifacts = useCallback(async (ids) => {
        if (!userAddress || !walletClient) return;
        setTxError(null);
        setTxHash(null);
        setIsTxLoading(true);
        try {
            // Call burn function on contract, passing NFT parameter (fixed address)
            const hash = await walletClient.writeContract({
                address: MIGRATOR,
                abi: MIGRATE_ABI,
                functionName: 'burn',
                args: [ids]
            });
            setTxHash(hash);
        } catch (error) {
            setTxError(error);
        } finally {
            setIsTxLoading(false);
        }
    }, [walletClient, userAddress, publicClient]);

    return { migrateArtifacts, txHash, txError, isTxLoading };
};
