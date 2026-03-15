export const calamityShopAbi = [
    {
        inputs: [
            { name: 'userId', type: 'bytes32' },
            { name: 'amount', type: 'uint256' },
            { name: 'buyer', type: 'address' },
        ],
        name: 'buy',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
