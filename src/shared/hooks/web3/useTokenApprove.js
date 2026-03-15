import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWalletClient, usePublicClient, useSwitchChain } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'

const ERC20_ABI = [
    {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
    },
    {
        name: 'decimals',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint8' }],
    },
]

export function useTokenApprove({
                               chainId,
                               tokenAddress,
                               spenderAddress,
                               contractAbi = ERC20_ABI,
                           }) {
    const { address: userAddress } = useAccount()
    const { data: walletClient } = useWalletClient()
    const publicClient = usePublicClient({ chainId })
    const { switchChain } = useSwitchChain()

    const [allowance, setAllowance] = useState(null)
    const [decimals, setDecimals] = useState(null)
    const [isLoadingAllowance, setIsLoadingAllowance] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [error, setError] = useState(null)

    const [txHash, setTxHash] = useState(null)
    const [txError, setTxError] = useState(null)

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

    const fetchAllowance = useCallback(async () => {
        if (!publicClient || !userAddress || !spenderAddress || !tokenAddress) return
        setIsLoadingAllowance(true)
        setError(null);

        try {
            await ensureChain()

            const dec = await publicClient.readContract({
                address: tokenAddress,
                abi: contractAbi,
                functionName: 'decimals',
            })
            setDecimals(Number(dec))

            const raw = await publicClient.readContract({
                address: tokenAddress,
                abi: contractAbi,
                functionName: 'allowance',
                args: [userAddress, spenderAddress],
            })

            setAllowance(raw)
        } catch (e) {
            setError(e)
        } finally {
            setIsLoadingAllowance(false)
        }
    }, [publicClient, userAddress, spenderAddress, tokenAddress, ensureChain, contractAbi])

    const handleApprove = useCallback(async (amount) => {
        if (!walletClient || !tokenAddress || !spenderAddress || decimals == null) return
        setIsApproving(true)
        setError(null)
        setTxError(null)
        setTxHash(null)

        try {
            await ensureChain()

            const value = parseUnits(amount.toString(), decimals)

            const hash = await walletClient.writeContract({
                address: tokenAddress,
                abi: contractAbi,
                functionName: 'approve',
                args: [spenderAddress, value],
            })

            setTxHash(hash)

            await publicClient.waitForTransactionReceipt({ hash })
            await fetchAllowance()
        } catch (e) {
            setTxError(e)
        } finally {
            setIsApproving(false)
        }
    }, [walletClient, tokenAddress, spenderAddress, decimals, contractAbi, publicClient, fetchAllowance, ensureChain, chainId])

    useEffect(() => {
        if (!publicClient || !walletClient || !userAddress || !spenderAddress || !tokenAddress) return
        fetchAllowance()
    }, [fetchAllowance, publicClient, walletClient, tokenAddress, spenderAddress, userAddress, chainId])

    return {
        allowance,
        allowanceFormatted: allowance != null && decimals != null ? formatUnits(allowance, decimals) : null,
        decimals,
        isLoadingAllowance,
        isApproving,
        error,
        txHash,
        txError,
        handleApprove,
        refetchAllowance: fetchAllowance,
    }
}
