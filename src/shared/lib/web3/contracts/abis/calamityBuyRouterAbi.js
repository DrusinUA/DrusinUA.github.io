export const calamityBuyRouterAbi = [
    {
        inputs: [
            { name: 'userId', type: 'bytes32' },
            { name: 'tokenIn', type: 'address' },
            { name: 'amountIn', type: 'uint256' },
            { name: 'swapTarget', type: 'address' },
            { name: 'swapCalldata', type: 'bytes' },
            { name: 'minAmountOut', type: 'uint256' },
        ],
        name: 'buy',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'userId', type: 'bytes32' },
            { name: 'swapTarget', type: 'address' },
            { name: 'swapCalldata', type: 'bytes' },
            { name: 'minAmountOut', type: 'uint256' },
        ],
        name: 'buyWithNative',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
];
