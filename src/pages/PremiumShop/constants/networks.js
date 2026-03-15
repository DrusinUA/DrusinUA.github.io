import { ronin } from 'viem/chains';
import roninTokenList from './roninTokens.json';

// Native token address used by KyberSwap Aggregator API
const NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

const RONIN_NETWORK = {
    id: 'ronin',
    name: 'Ronin',
    chainId: ronin.id,
    kyberswapChainName: 'ronin',

    nativeToken: {
        address: NATIVE_TOKEN_ADDRESS,
        symbol: 'RON',
        name: 'Ronin',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/20009/thumb/photo_2024-04-06_22-52-24.jpg?1712415367',
        isNative: true,
    },

    wrappedNativeToken: {
        address: '0xe514d9deb7966c8be0ca922de8a064264ea6bcd4',
        symbol: 'WRON',
        name: 'Wrapped RON',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/20009/thumb/photo_2024-04-06_22-52-24.jpg?1712415367',
    },

    paymentToken: {
        address: '0x0b7007c13325c48911f73a2dad5fa5dcbf808adc',
        symbol: 'USDC',
        name: 'CCIP Bridged USDC',
        decimals: 6,
    },

    tokenList: [
        // Native RON first
        {
            chainId: ronin.id,
            address: NATIVE_TOKEN_ADDRESS,
            name: 'Ronin',
            symbol: 'RON',
            decimals: 18,
            logoURI: 'https://assets.coingecko.com/coins/images/20009/thumb/photo_2024-04-06_22-52-24.jpg?1712415367',
            isNative: true,
        },
        // Then the rest from JSON
        ...roninTokenList.tokens,
    ],
};

// All supported networks (easy to add more later)
export const NETWORKS = {
    [ronin.id]: RONIN_NETWORK,
};

export const NATIVE_ADDRESS = NATIVE_TOKEN_ADDRESS;

export function isNativeToken(token) {
    return token?.isNative || token?.address?.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();
}

export function getNetwork(chainId) {
    return NETWORKS[chainId] || null;
}
