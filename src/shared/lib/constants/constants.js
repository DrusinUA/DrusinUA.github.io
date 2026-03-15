// ── Server URLs ──────────────────────────────────────────────
export const API_BASE_URL = 'https://info.calamity.online';
export const SERVER_URL = `${API_BASE_URL}/dapp`;

// ── Chain IDs (stubbed for static preview) ────────────────────
export const RONIN_CHAIN_ID = 2020;
export const ETHEREUM_CHAIN_ID = 1;
export const COSMETIC_CHAIN_ID = 2020;

// ── Contracts ────────────────────────────────────────────────
export const MIGRATOR = "0x1F0edCcC90b50D36403EFb412ffFE172C830C1fa";
export const COLLECTION_CONTRACT = "0x56e245db19a77175008d780509fa991f785c1366";
export const COSMETIC_CONTRACT = "0xb693bd5fDaFe1c69De15cD89ab5498D403eA5B78";
export const DRAGON_RINGS_CONTRACT = "0x58fac88b5899fd894fb7153d3c8a12db05333ac5";

export const CALAMITY_SHOP_CONTRACT = "0xE7B83f9bA17e87B50F2553476DC9bB762Cd34d7E";
export const CALAMITY_COIN_SHOP_CONTRACT = "0x25d7b3aabaf110e3f302203affa6495ba5affa9c";
export const CALAMITY_BUY_ROUTER_CONTRACT = "0xb7a0750719c6c0b70a7d0994a28c7a49959fe1bf";

export const USDC = {};
export const PRESALE_CONTRACT = {};

// ── Explorer URLs ────────────────────────────────────────────
export const EXPLORER_URL = {};

export const getExplorerTxUrl = (chainId, txHash) => {
    return `https://etherscan.io/tx/${txHash}`;
};
