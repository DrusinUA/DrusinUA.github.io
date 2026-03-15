import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useIsMobile } from '@shared/hooks/useMediaQuery.js';
import { useAccount, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { RONIN_CHAIN_ID } from '@shared/lib/constants/constants.js';
import { isNativeToken } from '../../constants/networks.js';

const ERC20_ABI = [
    { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
    { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
    { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
    { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
];

// Tab constants
const TAB_TOKENS = 'tokens';
const TAB_IMPORT = 'import';

// ─── Batch balance fetcher ───
function useMultiTokenBalances(tokens, enabled) {
    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient({ chainId: RONIN_CHAIN_ID });
    const [balances, setBalances] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const fetchAll = useCallback(async () => {
        if (!publicClient || !userAddress || !tokens.length || !enabled) return;
        setIsLoading(true);

        try {
            const result = {};

            // 1) Native token balance (RON)
            const nativeToken = tokens.find(t => isNativeToken(t));
            if (nativeToken) {
                try {
                    const nativeBal = await publicClient.getBalance({ address: userAddress });
                    result[nativeToken.address.toLowerCase()] = formatUnits(nativeBal, 18);
                } catch { /* ignore */ }
            }

            // 2) ERC20 balances via multicall (everything except native)
            const erc20Tokens = tokens.filter(t => !isNativeToken(t));

            if (erc20Tokens.length > 0) {
                const calls = erc20Tokens.map(t => ({
                    address: t.address,
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [userAddress],
                }));

                try {
                    const results = await publicClient.multicall({ contracts: calls });
                    erc20Tokens.forEach((token, i) => {
                        const r = results[i];
                        if (r.status === 'success') {
                            result[token.address.toLowerCase()] = formatUnits(r.result, token.decimals);
                        }
                    });
                } catch { /* ignore multicall failure */ }
            }

            if (mountedRef.current) setBalances(result);
        } catch { /* ignore */ }
        finally {
            if (mountedRef.current) setIsLoading(false);
        }
    }, [publicClient, userAddress, tokens, enabled]);

    useEffect(() => {
        if (!enabled) return;
        fetchAll();
        const id = setInterval(fetchAll, 5000);
        return () => clearInterval(id);
    }, [fetchAll, enabled]);

    return { balances, isLoading };
}

// ─── Spinner ───
const BalanceSpinner = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'tokenSpinner 0.8s linear infinite' }}>
        <circle cx="7" cy="7" r="5.5" fill="none" stroke="#4A357A" strokeWidth="2" />
        <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="#844ACB" strokeWidth="2" strokeLinecap="round" />
        <style>{`@keyframes tokenSpinner { to { transform: rotate(360deg); transform-origin: center; } }`}</style>
    </svg>
);

// ─── Token Row ───
const TokenRow = ({ token, balance, isSelected, onSelect, isMobile }) => {
    const hasBalance = balance !== undefined && Number(balance) > 0;
    const isBalanceLoading = balance === undefined;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: isMobile ? '8px 10px' : '10px 14px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                borderRadius: '8px',
                backgroundColor: isSelected ? 'rgba(132, 74, 203, 0.2)' : 'transparent',
                gap: '12px',
            }}
            onClick={() => onSelect(token)}
            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#4A357A'; }}
            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = isSelected ? 'rgba(132, 74, 203, 0.2)' : 'transparent'; }}
        >
            {/* Logo */}
            <div style={{
                width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden',
                flexShrink: 0, backgroundColor: '#3F2E66',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {token.logoURI ? (
                    <img
                        src={token.logoURI}
                        alt={token.symbol}
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <span style={{
                    display: token.logoURI ? 'none' : 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%',
                    fontSize: '13px', fontWeight: 700, color: '#9589C0',
                }}>
                    {token.symbol?.charAt(0)}
                </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: isMobile ? '13px' : '14px', fontWeight: 600,
                    color: '#f9fefd', fontFamily: 'Work Sans, sans-serif', lineHeight: '18px',
                }}>
                    {token.symbol}
                </div>
                <div style={{
                    fontSize: '11px', color: '#9589C0', fontFamily: 'Work Sans, sans-serif',
                    lineHeight: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {token.name}
                </div>
            </div>

            {/* Balance */}
            <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {isBalanceLoading ? (
                    <BalanceSpinner />
                ) : (
                    <div style={{
                        fontSize: isMobile ? '12px' : '13px', fontWeight: 500,
                        color: hasBalance ? '#f9fefd' : '#9589C0',
                        fontFamily: 'Work Sans, sans-serif',
                    }}>
                        {Number(balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Modal ───
export const TokenSelectorModal = ({ isOpen, onClose, onSelect, selectedToken, tokens = [] }) => {
    const isMobile = useIsMobile();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(TAB_TOKENS);
    const [importAddress, setImportAddress] = useState('');
    const [importedTokens, setImportedTokens] = useState([]);
    const [importPreview, setImportPreview] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importError, setImportError] = useState(null);
    const publicClient = usePublicClient({ chainId: RONIN_CHAIN_ID });

    const allTokens = useMemo(() => [...tokens, ...importedTokens], [tokens, importedTokens]);

    const { balances, isLoading: balancesLoading } = useMultiTokenBalances(allTokens, isOpen);

    // Filter
    const filteredTokens = useMemo(() => {
        const list = allTokens;
        let filtered = list;
        if (search.trim()) {
            const q = search.toLowerCase().trim();
            filtered = list.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.symbol.toLowerCase().includes(q) ||
                    t.address.toLowerCase().includes(q)
            );
        }

        // Sort: tokens with balance first, then alphabetically
        return [...filtered].sort((a, b) => {
            const balA = Number(balances[a.address.toLowerCase()] || 0);
            const balB = Number(balances[b.address.toLowerCase()] || 0);
            if (balA > 0 && balB <= 0) return -1;
            if (balB > 0 && balA <= 0) return 1;
            if (balA > 0 && balB > 0) return balB - balA; // higher balance first
            return a.symbol.localeCompare(b.symbol);
        });
    }, [allTokens, search, balances]);

    const handleSelect = useCallback((token) => {
        onSelect(token);
        setSearch('');
        setActiveTab(TAB_TOKENS);
        onClose();
    }, [onSelect, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setSearch('');
            setActiveTab(TAB_TOKENS);
            onClose();
        }
    };

    // Auto-fetch token metadata when valid address is entered
    useEffect(() => {
        const addr = importAddress.trim().toLowerCase();
        if (!addr || !addr.startsWith('0x') || addr.length !== 42 || !publicClient) {
            setImportPreview(null);
            setImportError(null);
            return;
        }

        // Already exists in list
        if (allTokens.find(t => t.address.toLowerCase() === addr)) {
            setImportPreview(null);
            setImportError('Token already in your list');
            return;
        }

        let cancelled = false;
        setImportLoading(true);
        setImportError(null);
        setImportPreview(null);

        (async () => {
            try {
                const results = await publicClient.multicall({
                    contracts: [
                        { address: addr, abi: ERC20_ABI, functionName: 'name' },
                        { address: addr, abi: ERC20_ABI, functionName: 'symbol' },
                        { address: addr, abi: ERC20_ABI, functionName: 'decimals' },
                    ],
                });

                if (cancelled) return;

                const nameResult = results[0];
                const symbolResult = results[1];
                const decimalsResult = results[2];

                if (nameResult.status !== 'success' || symbolResult.status !== 'success') {
                    setImportError('Not a valid ERC20 token');
                    setImportLoading(false);
                    return;
                }

                setImportPreview({
                    chainId: RONIN_CHAIN_ID,
                    address: addr,
                    name: nameResult.result,
                    symbol: symbolResult.result,
                    decimals: decimalsResult.status === 'success' ? Number(decimalsResult.result) : 18,
                });
            } catch {
                if (!cancelled) setImportError('Failed to fetch token info');
            } finally {
                if (!cancelled) setImportLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [importAddress, publicClient, allTokens]);

    const handleImport = () => {
        if (!importPreview) return;
        setImportedTokens(prev => [...prev, importPreview]);
        setImportAddress('');
        setImportPreview(null);
        setActiveTab(TAB_TOKENS);
        setSearch(importPreview.address);
    };

    if (!isOpen) return null;

    const tabStyle = (isActive) => ({
        flex: 1,
        padding: '8px 0',
        background: 'none',
        border: 'none',
        borderBottom: isActive ? '2px solid #844ACB' : '2px solid transparent',
        color: isActive ? '#f9fefd' : '#9589C0',
        fontFamily: 'Work Sans, sans-serif',
        fontSize: isMobile ? '12px' : '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    });

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1100,
                backdropFilter: 'blur(2px)',
            }}
            onClick={handleBackdropClick}
        >
            <div style={{
                width: isMobile ? 'calc(100vw - 32px)' : '400px',
                maxHeight: isMobile ? 'calc(100vh - 80px)' : '480px',
                backgroundColor: '#332551',
                borderRadius: '12px',
                border: '1px solid #844ACB',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: isMobile ? '12px 14px 8px' : '14px 16px 8px',
                }}>
                    <h2 style={{
                        margin: 0, fontSize: isMobile ? '15px' : '16px', fontWeight: 600,
                        color: '#f9fefd', fontFamily: 'Work Sans, sans-serif',
                    }}>
                        Select a token
                    </h2>
                    <button
                        onClick={() => { setSearch(''); setActiveTab(TAB_TOKENS); onClose(); }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#9589C0', transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f9fefd'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#9589C0'}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M14 4L4 14M4 4L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', padding: '0 14px', gap: '0' }}>
                    <button style={tabStyle(activeTab === TAB_TOKENS)} onClick={() => setActiveTab(TAB_TOKENS)}>
                        Tokens
                    </button>
                    <button style={tabStyle(activeTab === TAB_IMPORT)} onClick={() => setActiveTab(TAB_IMPORT)}>
                        Import
                    </button>
                </div>

                {activeTab === TAB_TOKENS ? (
                    <>
                        {/* Search */}
                        <div style={{ padding: isMobile ? '8px 10px' : '10px 14px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                height: '38px', padding: '0 10px',
                                background: '#3F2E66', border: '1px solid #844ACB',
                                borderRadius: '8px',
                            }}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z" stroke="#9589C0" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M14 14L10.5 10.5" stroke="#9589C0" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search name or paste address"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        background: 'transparent', border: 'none', color: '#f9fefd',
                                        fontFamily: 'Work Sans, sans-serif', fontSize: '13px',
                                        fontWeight: 400, width: '100%', outline: 'none',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Token List */}
                        <div style={{
                            flex: 1, overflowY: 'auto',
                            padding: isMobile ? '0 6px 8px' : '0 10px 10px',
                        }}>
                            {filteredTokens.length === 0 ? (
                                <div style={{
                                    textAlign: 'center', padding: '30px 16px',
                                    color: '#9589C0', fontFamily: 'Work Sans, sans-serif', fontSize: '13px',
                                }}>
                                    No tokens found
                                </div>
                            ) : (
                                filteredTokens.map((token) => (
                                    <TokenRow
                                        key={token.address}
                                        token={token}
                                        balance={balances[token.address.toLowerCase()]}
                                        isSelected={selectedToken?.address === token.address}
                                        onSelect={handleSelect}
                                        isMobile={isMobile}
                                    />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '6px 14px', borderTop: '1px solid rgba(132, 74, 203, 0.3)',
                            textAlign: 'center',
                        }}>
                            <span style={{ fontSize: '11px', color: '#9589C0', fontFamily: 'Work Sans, sans-serif' }}>
                                {filteredTokens.length} tokens {balancesLoading ? '(loading balances...)' : ''}
                            </span>
                        </div>
                    </>
                ) : (
                    /* Import Tab */
                    <div style={{ padding: isMobile ? '12px 10px' : '16px 14px', flex: 1 }}>
                        <div style={{
                            color: '#9589C0', fontFamily: 'Work Sans, sans-serif',
                            fontSize: '13px', marginBottom: '12px', lineHeight: '18px',
                        }}>
                            Paste a token contract address to import it.
                        </div>

                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            height: '42px', padding: '0 12px',
                            background: '#3F2E66', border: '1px solid #844ACB',
                            borderRadius: '8px', marginBottom: '12px',
                        }}>
                            <input
                                type="text"
                                placeholder="0x..."
                                value={importAddress}
                                onChange={(e) => setImportAddress(e.target.value)}
                                style={{
                                    background: 'transparent', border: 'none', color: '#f9fefd',
                                    fontFamily: 'Work Sans, sans-serif', fontSize: '13px',
                                    fontWeight: 400, width: '100%', outline: 'none',
                                }}
                            />
                        </div>

                        {/* Loading state */}
                        {importLoading && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px', marginBottom: '12px',
                                color: '#9589C0', fontFamily: 'Work Sans, sans-serif', fontSize: '13px',
                            }}>
                                <BalanceSpinner /> Fetching token info...
                            </div>
                        )}

                        {/* Error */}
                        {importError && (
                            <div style={{
                                padding: '10px 12px', marginBottom: '12px', borderRadius: '8px',
                                background: 'rgba(255, 80, 80, 0.1)', border: '1px solid rgba(255, 80, 80, 0.3)',
                                color: '#ff6b6b', fontFamily: 'Work Sans, sans-serif', fontSize: '13px',
                            }}>
                                {importError}
                            </div>
                        )}

                        {/* Preview card */}
                        {importPreview && (
                            <div style={{
                                padding: '12px', marginBottom: '12px', borderRadius: '8px',
                                background: '#3F2E66', border: '1px solid rgba(132, 74, 203, 0.4)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        backgroundColor: '#4A357A', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: '15px', fontWeight: 700, color: '#9589C0',
                                        flexShrink: 0,
                                    }}>
                                        {importPreview.symbol?.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '14px', fontWeight: 600, color: '#f9fefd',
                                            fontFamily: 'Work Sans, sans-serif',
                                        }}>
                                            {importPreview.name}
                                        </div>
                                        <div style={{
                                            fontSize: '12px', color: '#9589C0',
                                            fontFamily: 'Work Sans, sans-serif',
                                        }}>
                                            {importPreview.symbol} &middot; {importPreview.decimals} decimals
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '11px', color: '#9589C0', fontFamily: 'monospace',
                                    wordBreak: 'break-all', lineHeight: '15px',
                                }}>
                                    {importPreview.address}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleImport}
                            disabled={!importPreview || importLoading}
                            style={{
                                width: '100%', height: '40px', borderRadius: '8px',
                                border: 'none', cursor: importPreview ? 'pointer' : 'default',
                                backgroundColor: importPreview ? '#844ACB' : 'rgba(74,56,143,0.4)',
                                color: '#f9fefd', fontFamily: 'Work Sans, sans-serif',
                                fontSize: '14px', fontWeight: 600,
                                transition: 'background-color 0.15s ease',
                            }}
                        >
                            Import Token
                        </button>

                        {importedTokens.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <div style={{
                                    fontSize: '12px', color: '#9589C0',
                                    fontFamily: 'Work Sans, sans-serif', marginBottom: '8px',
                                }}>
                                    Imported ({importedTokens.length})
                                </div>
                                {importedTokens.map(t => (
                                    <div key={t.address} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '8px 0',
                                        borderBottom: '1px solid rgba(132, 74, 203, 0.15)',
                                    }}>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{
                                                fontSize: '13px', color: '#f9fefd',
                                                fontFamily: 'Work Sans, sans-serif', fontWeight: 500,
                                            }}>
                                                {t.symbol}
                                                <span style={{ color: '#9589C0', fontWeight: 400 }}> {t.name}</span>
                                            </div>
                                            <div style={{
                                                fontSize: '11px', color: '#9589C0', fontFamily: 'monospace',
                                            }}>
                                                {t.address.slice(0, 10)}...{t.address.slice(-6)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSelect(t)}
                                            style={{
                                                background: 'none', border: '1px solid #844ACB',
                                                borderRadius: '4px', padding: '2px 8px',
                                                color: '#844ACB', fontSize: '11px', cursor: 'pointer',
                                                fontFamily: 'Work Sans, sans-serif', fontWeight: 600,
                                                flexShrink: 0,
                                            }}
                                        >
                                            Select
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
