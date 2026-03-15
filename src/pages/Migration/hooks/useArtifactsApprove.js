import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import {COLLECTION_CONTRACT, MIGRATOR} from "@shared/lib/constants/constants.js";

// Minimal ABI for ERC-721
const ERC721_ABI = [
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'operator', type: 'address' }
        ],
        name: 'isApprovedForAll',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'operator', type: 'address' },
            { internalType: 'bool', name: 'approved', type: 'bool' }
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];



export const useArtifactsApprove = () => {
    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    const [isApproved, setIsApproved] = useState(false);
    const [txHash, setTxHash] = useState(null);
    const [txError, setTxError] = useState(null);
    const [isTxLoading, setIsTxLoading] = useState(false);

    // Function to check approveForAll status
    const fetchApproval = useCallback(async () => {
        if (!userAddress || !COLLECTION_CONTRACT) return;
        try {
            const approved = await publicClient.readContract({
                address: COLLECTION_CONTRACT,
                abi: ERC721_ABI,
                functionName: 'isApprovedForAll',
                args: [userAddress, MIGRATOR],
            });
            setIsApproved(approved);
        } catch (error) {
            console.error("Error checking approve:", error);
        }
    }, [publicClient, userAddress]);

    // Run check initially and every 10 seconds
    useEffect(() => {
        fetchApproval();
        const interval = setInterval(fetchApproval, 10000);
        return () => clearInterval(interval);
    }, [fetchApproval]);

    // Function to send setApprovalForAll transaction
    const approve = useCallback(async () => {
        if (!userAddress || !walletClient || !COLLECTION_CONTRACT) return;
        setTxError(null);
        setTxHash(null);
        setIsTxLoading(true);
        try {
            const hash = await walletClient.writeContract({
                address: COLLECTION_CONTRACT,
                abi: ERC721_ABI,
                functionName: 'setApprovalForAll',
                args: [MIGRATOR, true],
            });
            setTxHash(hash);
            // Wait for 1 transaction confirmation
            await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
            // Force update approve status
            await fetchApproval();
        } catch (error) {
            console.error("Error executing approve:", error);
            setTxError(error);
        } finally {
            setIsTxLoading(false);
        }
    }, [walletClient, userAddress, publicClient, fetchApproval]);

    return { isApproved, approve, txHash, txError, isTxLoading };
};
