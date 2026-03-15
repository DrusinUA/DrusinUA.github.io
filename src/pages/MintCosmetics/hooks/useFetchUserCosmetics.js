// hooks/useUserCosmetics.js
import {useState, useEffect, useRef, useCallback} from 'react';
import {useChainId, usePublicClient} from 'wagmi';
import axios from 'axios';

import {
    COSMETIC_CHAIN_ID,
    COSMETIC_CONTRACT,            // ⬅️  new constant
    SERVER_URL,
} from '@shared/lib/constants/constants.js';

// polling interval (ms) and the maximum consecutive retry count
const POLL_INTERVAL = 5_000;
const MAX_RETRIES = 6;

// minimal ERC-721 ABI for ownerOf
const ERC721_ABI = [
    {
        name: 'ownerOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{name: 'tokenId', type: 'uint256'}],
        outputs: [{name: 'owner', type: 'address'}],
    },
];

export function useFetchUserCosmetics(userAddress) {
    const chainId = useChainId();
    const publicClient = usePublicClient({chainId: COSMETIC_CHAIN_ID});

    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [nftIds, setNftIds] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [nftMeta, setNftMeta] = useState([]);
    const [error, setError] = useState(null);

    const intervalRef = useRef(null);
    const retryRef = useRef(0);

    /** Check on-chain if a tokenId already exists (ownerOf does **not** revert). */
    const tokenExists = useCallback(
        async (tokenId) => {
            try {
                await publicClient.readContract({
                    address: COSMETIC_CONTRACT,
                    abi: ERC721_ABI,
                    functionName: 'ownerOf',
                    args: [BigInt(tokenId)],
                });
                // call succeeded → token already minted
                return true;
            } catch {
                // ownerOf reverted → token not minted
                return false;
            }
        },
        [publicClient],
    );

    /** Single API + on-chain fetch cycle. */
    const fetchOnce = useCallback(async () => {
        if (!userAddress) return;

        setIsLoading(true);
        try {
            const {data} = await axios.post(
                `${SERVER_URL}/cosmetics/check_mint`,
                {walletAddress: userAddress},
            );

            const rawIds = data.nftIds ?? [];
            const rawSignatures = data.signatures ?? [];
            const rawMeta = data.nftMeta ?? [];

            /* Filter-out already-minted NFTs ------------------------------------ */
            const keepIndexes = await Promise.all(
                rawIds.map(async (id, idx) => {
                    const exists = await tokenExists(id);
                    return exists ? null : idx;   // keep only non-existent tokens
                }),
            );

            const filteredIndexes = keepIndexes.filter((i) => i !== null);

            setNftIds(rawIds);
            setSignatures(rawSignatures);
            setNftMeta(filteredIndexes.map((i) => rawMeta[i]));

            retryRef.current = 0;
            setError(null);
        } catch (err) {
            console.error(err);
            retryRef.current += 1;
            setError(err);

            if (retryRef.current >= MAX_RETRIES && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } finally {
            setIsChecked(true);
            setIsLoading(false);
        }
    }, [userAddress, tokenExists]);

    /* ---------------------------------------------------------------------- */
    /*                        Effect: start / stop polling                    */
    /* ---------------------------------------------------------------------- */
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const canPoll =
            userAddress &&
            chainId === COSMETIC_CHAIN_ID &&
            COSMETIC_CONTRACT &&
            publicClient; // ensures the RPC client is available

        if (canPoll) {
            fetchOnce();                                 // immediate call
            intervalRef.current = setInterval(fetchOnce, POLL_INTERVAL);
        } else {
            // reset state when the user disconnects or switches chain
            setNftIds([]);
            setSignatures([]);
            setNftMeta([]);
            setIsChecked(false);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [userAddress, chainId, fetchOnce, publicClient]);

    return {
        isLoading,
        isChecked,
        error,
        nftIds,
        signatures,
        nftMeta,
    };
}
