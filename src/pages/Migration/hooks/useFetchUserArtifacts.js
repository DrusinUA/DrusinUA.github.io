import {useEffect, useState, useRef} from 'react';
import {useAccount} from 'wagmi';
import {multicall} from '@wagmi/core';
import {config} from '@shared/lib/constants/config.js';
import {COLLECTION_CONTRACT, SERVER_URL, API_BASE_URL} from "@shared/lib/constants/constants.js";
import axios from "axios";

const ABI = [{
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{name: 'tokenId', type: 'uint256'}],
    outputs: [{name: 'owner', type: 'address'}],
}];

export function useFetchUserArtifacts() {
    const {address, isConnected} = useAccount();
    const [artifacts, setArtifacts] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isConnected || !address) {
            setArtifacts([]);
            setIsLoading(true);
            return;
        }

        const fetchArtifacts = async () => {
            if (isLoading || isUpdating) {
                setIsUpdating(true);

                const calls = Array.from({length: 1972}, (_, i) => ({
                    address: COLLECTION_CONTRACT,
                    abi: ABI,
                    functionName: 'ownerOf',
                    args: [BigInt(i)],
                }));

                try {
                    const results = await multicall(config, {
                        allowFailure: true,
                        contracts: calls,
                    });

                    const owned = results
                        .map((res, idx) =>
                            res.result?.toLowerCase() === address.toLowerCase()
                                ? idx
                                : null
                        )
                        .filter(Boolean);

                    const data = await axios.post(`${API_BASE_URL}/api/artifacts`, {ids: owned});
                    const enriched = data.data.artifacts;

                    setTotalBalance(enriched.length);
                    setArtifacts(enriched);
                } catch (error) {
                    console.error('Error fetching artifacts via multicall:', error);
                } finally {
                    setIsUpdating(false);
                    setIsLoading(false);
                }
            }
        };


        // Initial load + polling
        fetchArtifacts();
        intervalRef.current = setInterval(fetchArtifacts, 10_000);

        return () => clearInterval(intervalRef.current);
    }, [address, isConnected]);

    return [artifacts, totalBalance, isLoading];
}
