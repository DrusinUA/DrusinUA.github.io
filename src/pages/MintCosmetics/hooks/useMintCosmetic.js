import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { COSMETIC_CONTRACT } from '@shared/lib/constants/constants.js';

const COSMETIC_ABI = [
    {
        inputs: [
            { internalType: 'uint256[]', name: 'nftIds',   type: 'uint256[]' },
            { internalType: 'bytes[]',   name: 'signature', type: 'bytes[]'  }
        ],
        name: 'batchMint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

const BATCH_SIZE = 50;

export const useMintCosmetic = () => {
    const { address: userAddress } = useAccount();
    const { data: walletClient }   = useWalletClient();

    const [txHash,      setTxHash]      = useState(null);
    const [txError,     setTxError]     = useState(null);
    const [isTxLoading, setIsTxLoading] = useState(false);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [totalBatches, setTotalBatches] = useState(0);

    /**
     * @param {BigInt[]|number[]}                         nftIds      — IDs from backend/oracle
     * @param {(`0x${string}`)[]}                        signatures  — same length and order as nftIds
     * @param {{ nftId:number, nftTypeId:number }[]}     nftMeta     — metadata (id + type)
     */
    const mintCosmetics = useCallback(
        async (nftIds, signatures, nftMeta) => {
            if (!userAddress || !walletClient) return;

            // 0. Validate array lengths
            if (nftIds.length !== signatures.length) {
                setTxError(new Error('nftIds.length !== signatures.length'));
                return;
            }

            // 1. Create map for fast metadata lookup
            const metaMap = new Map(
                nftMeta.map(({ nftId, nftTypeId }) => [Number(nftId), Number(nftTypeId)])
            );

            // 2. Filter id+sig pairs, keeping only those present in meta
            const selected = [];
            for (let i = 0; i < nftIds.length; i++) {
                const id      = Number(nftIds[i]);
                const typeId  = metaMap.get(id);
                if (typeId !== undefined) {
                    selected.push({ id: nftIds[i], sig: signatures[i], typeId });
                }
            }

            if (!selected.length) {
                setTxError(new Error('Nothing to mint: meta filter removed all ids'));
                return;
            }

            // 3. Sort first by typeId, then by id
            selected.sort((a, b) =>
                a.typeId === b.typeId ? Number(a.id) - Number(b.id) : a.typeId - b.typeId
            );

            // 4. Split into batches and send transactions sequentially
            const batches = [];
            for (let i = 0; i < selected.length; i += BATCH_SIZE) {
                batches.push(selected.slice(i, i + BATCH_SIZE));
            }

            setTxError(null);
            setTxHash(null);
            setIsTxLoading(true);
            setTotalBatches(batches.length);

            try {
                for (let b = 0; b < batches.length; b++) {
                    const batch = batches[b];
                    const batchIds  = batch.map(o => o.id);
                    const batchSigs = batch.map(o => o.sig);

                    setCurrentBatch(b + 1);
                    setTxHash(null);

                    const hash = await walletClient.writeContract({
                        address:      COSMETIC_CONTRACT,
                        abi:          COSMETIC_ABI,
                        functionName: 'batchMint',
                        args:         [batchIds, batchSigs],
                    });

                    setTxHash(hash);
                }
            } catch (err) {
                setTxError(err);
            } finally {
                setIsTxLoading(false);
            }
        },
        [userAddress, walletClient],
    );

    return { mintCosmetics, txHash, txError, isTxLoading, currentBatch, totalBatches };
};
