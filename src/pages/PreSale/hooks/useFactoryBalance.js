import {useCallback, useEffect, useState} from 'react'
import {useAccount, usePublicClient} from 'wagmi'
import {ETHEREUM_CHAIN_ID, PRESALE_CONTRACT, RONIN_CHAIN_ID,} from '@shared/lib/constants/constants.js'

const PRESALE_ABI = [
    {
        name: 'presaleAmounts',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
]

export const useFactoryBalance = () => {
    const { address: userAddress } = useAccount()

    const ethereumClient = usePublicClient({ chainId: ETHEREUM_CHAIN_ID })
    const roninClient = usePublicClient({ chainId: RONIN_CHAIN_ID })

    const [balances, setBalances] = useState({
        [ETHEREUM_CHAIN_ID]: 0n,
        [RONIN_CHAIN_ID]: 0n,
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchBalances = useCallback(async () => {
        if (!userAddress) return

        setIsLoading(true)
        setError(null)

        const results = {}

        try {
            // Ethereum
            if (ethereumClient) {
                try {
                    results[ETHEREUM_CHAIN_ID] = await ethereumClient.readContract({
                        address: PRESALE_CONTRACT[ETHEREUM_CHAIN_ID],
                        abi: PRESALE_ABI,
                        functionName: 'presaleAmounts',
                        args: [userAddress],
                    })
                } catch (e) {
                    results[ETHEREUM_CHAIN_ID] = 0n
                }
            }

            // Ronin
            if (roninClient) {
                try {
                    const ronAmount = await roninClient.readContract({
                        address: PRESALE_CONTRACT[RONIN_CHAIN_ID],
                        abi: PRESALE_ABI,
                        functionName: 'presaleAmounts',
                        args: [userAddress],
                    })
                    results[RONIN_CHAIN_ID] = ronAmount
                } catch (e) {
                    results[RONIN_CHAIN_ID] = 0n
                }
            }

            // Default to 0n if nothing was returned
            if (!(ETHEREUM_CHAIN_ID in results)) results[ETHEREUM_CHAIN_ID] = 0n
            if (!(RONIN_CHAIN_ID in results)) results[RONIN_CHAIN_ID] = 0n

            setBalances(results)
        } catch (e) {
            setError(e)
        } finally {
            setIsLoading(false)
        }
    }, [userAddress, ethereumClient, roninClient])

    useEffect(() => {
        if (!userAddress) return

        let cancelled = false

        const start = async () => {
            if (!cancelled) await fetchBalances()
        }

        start()
        const interval = setInterval(start, 5000)

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [fetchBalances, userAddress])

    const totalBalance = balances[ETHEREUM_CHAIN_ID] + balances[RONIN_CHAIN_ID]

    return {
        balances,
        totalBalance,
        isLoading,
        error,
        refetch: fetchBalances,
    }
}
