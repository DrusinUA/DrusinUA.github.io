    import { useState, useEffect, useCallback } from 'react'
    import { useWalletClient, useAccount, useSwitchChain, usePublicClient } from 'wagmi'
    import { formatUnits } from 'viem'

    const ERC20_ABI = [
        { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
        { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
    ]

    export function useTokenBalanceOf(chainId, tokenAddress) {
        const { switchChain } = useSwitchChain()
        const { data: walletClient } = useWalletClient()
        const { address: userAddress } = useAccount()
        const publicClient = usePublicClient({ chainId })

        const [balance, setBalance] = useState(null)
        const [decimals, setDecimals] = useState(null)
        const [isLoading, setIsLoading] = useState(false)
        const [error, setError] = useState(null)

        const ensureChain = useCallback(async () => {
            if (walletClient && chainId && walletClient.chain?.id !== chainId) {
                try {
                    await switchChain({ chainId })
                } catch (e) {
                    setError(e)
                    throw e
                }
            }
        }, [walletClient, chainId, switchChain])

        const fetchBalance = useCallback(async () => {
            if (!publicClient || !tokenAddress || !userAddress) return
            setIsLoading(true)
            setError(null)

            try {
                await ensureChain()

                const dec = await publicClient.readContract({
                    address: tokenAddress,
                    abi: ERC20_ABI,
                    functionName: 'decimals',
                })
                setDecimals(Number(dec))

                const raw = await publicClient.readContract({
                    address: tokenAddress,
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [userAddress],
                })

                setBalance(raw)
            } catch (e) {
                setError(e)
            } finally {
                setIsLoading(false)
            }
        }, [publicClient, tokenAddress, userAddress, chainId, ensureChain])

        useEffect(() => {
            setDecimals(null)
        }, [tokenAddress])

        useEffect(() => {
            if (!publicClient || !walletClient || !tokenAddress || !userAddress) return

            let cancelled = false

            const run = async () => {
                if (!cancelled) await fetchBalance()
            }

            run()
            const id = setInterval(run, 5000)

            return () => {
                cancelled = true
                clearInterval(id)
            }
        }, [fetchBalance, publicClient, walletClient, tokenAddress, userAddress, chainId])

        return {
            balance,
            balanceFormatted: balance != null && decimals != null ? formatUnits(balance, decimals) : null,
            isLoading,
            error,
            refetch: fetchBalance,
        }
    }
