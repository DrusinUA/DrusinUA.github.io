import { useState, useCallback } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import axios from 'axios'
import { SERVER_URL } from '@shared/lib/constants/constants.js'

const PRESALE_ABI = [
    {
        name: 'presale',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'signature', type: 'bytes' },
            { name: 'amount', type: 'uint256' },
            { name: 'refCode', type: 'string' },
        ],
        outputs: [],
    },
]

export const useFactoryBuy = ({ chainId, tokenAddress }) => {
    const { address: userAddress } = useAccount()
    const { data: walletClient } = useWalletClient()
    const publicClient = usePublicClient({ chainId })

    const [isLoading, setIsLoading] = useState(false)
    const [txHash, setTxHash] = useState(null)
    const [error, setError] = useState(null)

    const buy = useCallback(async ({ amount, refCode }) => {
        if (!userAddress || !walletClient || !tokenAddress || !chainId) return

        setIsLoading(true)
        setError(null)
        setTxHash(null)

        try {
            const response = await axios.post(`${SERVER_URL}/factory/presale/sign`, {
                chainId,
                userAddress,
            })

            const { signature } = response.data

            if (!signature) throw new Error('No signature received from server')

            const hash = await walletClient.writeContract({
                address: tokenAddress,
                abi: PRESALE_ABI,
                functionName: 'presale',
                args: [signature, BigInt(amount), refCode],
            })

            setTxHash(hash)

            await publicClient.waitForTransactionReceipt({ hash })
        } catch (err) {
            setError(err)
        } finally {
            setIsLoading(false)
        }
    }, [userAddress, walletClient, tokenAddress, chainId, publicClient])

    return {
        buy,
        isLoading,
        txHash,
        error,
    }
}
