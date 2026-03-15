// Stubbed API for static preview - no actual network calls

export const authApi = {
    login: async () => ({ data: {} }),
    refresh: async () => ({ data: {} }),
    logout: async () => ({ data: {} }),
    logoutAll: async () => ({ data: {} }),
    me: async () => ({ data: null }),
};

export const walletApi = {
    getSigningParams: async () => ({ data: {} }),
    link: async () => ({ data: {} }),
    setLabel: async () => ({ data: {} }),
    unlink: async () => ({ data: {} }),
    setPrimary: async () => ({ data: {} }),
    list: async () => ({ data: [] }),
};

export const shopApi = {
    buyCoins: async () => ({ data: {} }),
    history: async () => ({ data: { transactions: [] } }),
};

export default {};
