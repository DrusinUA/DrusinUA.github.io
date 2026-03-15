import { useEffect, useState, useCallback } from 'react'
import { usePublicClient } from 'wagmi'
import {
    ETHEREUM_CHAIN_ID,
    RONIN_CHAIN_ID,
    PRESALE_CONTRACT,
} from '@shared/lib/constants/constants.js'

const PRESALE_ABI = [
    {
        name: 'totalSold',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
]

export const useTotalFactoriesMinted = () => {
    const ethereumClient = usePublicClient({ chainId: ETHEREUM_CHAIN_ID })
    const roninClient = usePublicClient({ chainId: RONIN_CHAIN_ID })

    const [totals, setTotals] = useState({
        [ETHEREUM_CHAIN_ID]: 0n,
        [RONIN_CHAIN_ID]: 0n,
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchTotals = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        const results = {}

        try {
            // Ethereum
            if (ethereumClient) {
                try {
                    const ethTotal = await ethereumClient.readContract({
                        address: PRESALE_CONTRACT[ETHEREUM_CHAIN_ID],
                        abi: PRESALE_ABI,
                        functionName: 'totalSold',
                    })
                    results[ETHEREUM_CHAIN_ID] = ethTotal
                } catch (e) {
                    results[ETHEREUM_CHAIN_ID] = 0n
                }
            }

            // Ronin
            if (roninClient) {
                try {
                    const ronTotal = await roninClient.readContract({
                        address: PRESALE_CONTRACT[RONIN_CHAIN_ID],
                        abi: PRESALE_ABI,
                        functionName: 'totalSold',
                    })
                    results[RONIN_CHAIN_ID] = ronTotal
                } catch (e) {
                    results[RONIN_CHAIN_ID] = 0n
                }
            }

            // fallback 0n if failed
            if (!(ETHEREUM_CHAIN_ID in results)) results[ETHEREUM_CHAIN_ID] = 0n
            if (!(RONIN_CHAIN_ID in results)) results[RONIN_CHAIN_ID] = 0n

            setTotals(results)
        } catch (e) {
            setError(e)
        } finally {
            setIsLoading(false)
        }
    }, [ethereumClient, roninClient])

    useEffect(() => {
        let cancelled = false

        const start = async () => {
            if (!cancelled) await fetchTotals()
        }

        start()
        const interval = setInterval(start, 5000)

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [fetchTotals])

    const totalSum = totals[ETHEREUM_CHAIN_ID] + totals[RONIN_CHAIN_ID]

    return {
        totals,
        totalSum,
        isLoading,
        error,
        refetch: fetchTotals,
    }
}
