import React, { useState } from 'react';
import styles from './EmotesPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import { StickerReveal } from './components/StickerReveal/StickerReveal.jsx';
import { TransactionModal } from '@shared/components/ui/TransactionModal/TransactionModal.jsx';

// Real sticker art sourced from RektSkullsUnity's CustomSprites/Emotes.
import gg from './assets/stickers/gg.png';
import hello from './assets/stickers/hello.png';
import help from './assets/stickers/help.png';
import noSticker from './assets/stickers/no.png';
import thanks from './assets/stickers/thanks.png';
import thumbup from './assets/stickers/thumbup.png';

const STICKER_POOL = [
    { id: 'gg', name: 'GG', icon: gg },
    { id: 'hello', name: 'Hello', icon: hello },
    { id: 'help', name: 'Help!', icon: help },
    { id: 'no', name: 'No', icon: noSticker },
    { id: 'thanks', name: 'Thanks', icon: thanks },
    { id: 'thumbup', name: 'Thumbs Up', icon: thumbup },
];

const INITIAL_PACKS = [
    { id: 'pack-001', tokenId: '#001', label: 'Emote Pack' },
    { id: 'pack-002', tokenId: '#002', label: 'Emote Pack' },
    { id: 'pack-003', tokenId: '#003', label: 'Emote Pack' },
];

const RONIN_MARKETPLACE_URL = 'https://marketplace.roninchain.com/';

function drawThreeStickers() {
    const pool = [...STICKER_POOL];
    const result = [];
    for (let i = 0; i < 3; i += 1) {
        const idx = Math.floor(Math.random() * pool.length);
        const [picked] = pool.splice(idx, 1);
        result.push(picked);
    }
    return result;
}

function EmotesPage() {
    const [step, setStep] = useState('connect'); // connect | inventory | revealing | summary
    const [packs, setPacks] = useState(INITIAL_PACKS);
    // Snapshot of the burned pack — survives after we remove it from the
    // packs array so the summary can still title with its token id.
    const [activePack, setActivePack] = useState(null);
    const [revealedStickers, setRevealedStickers] = useState([]);
    const [revealKey, setRevealKey] = useState(0);
    const [showTxModal, setShowTxModal] = useState(false);
    const [txHash, setTxHash] = useState(null);

    const handleConnect = () => {
        // Placeholder — real wallet flow lands here later.
        setStep('inventory');
    };

    const handleBurnPack = (pack) => {
        setActivePack(pack);
        setShowTxModal(true);
        setTxHash(null);

        setTimeout(() => setTxHash(`0x${Math.random().toString(16).slice(2)}`), 700);
        setTimeout(() => {
            setShowTxModal(false);
            setRevealedStickers(drawThreeStickers());
            setRevealKey((k) => k + 1);
            setStep('revealing');
        }, 1500);
    };

    const handleRevealComplete = () => {
        setPacks((prev) => prev.filter((p) => p.id !== activePack?.id));
        setStep('summary');
    };

    const handleBackToInventory = () => {
        setActivePack(null);
        setRevealedStickers([]);
        setRevealKey(0);
        setStep('inventory');
    };

    return (
        <div className={styles.emotesPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div
                    className={`${styles.innerFrame} ${
                        step === 'connect' ? styles.innerFrameCompact : ''
                    }`}
                >
                    {/* Step 1: Connect */}
                    {step === 'connect' && (
                        <div className={`${styles.stepContainer} ${styles.connectStep}`} key="connect">
                            <h1 className={styles.pageTitle}>Emote Packs</h1>
                            <p className={styles.subtitle}>
                                Sealed sticker packs from across the realm.
                                Connect to claim what is yours.
                            </p>
                            <div className={styles.connectBlock}>
                                <div className={styles.descriptionBox}>
                                    <p>
                                        Each Emote Pack is a sealed Ronin artifact —
                                        trade them on the marketplace, or break a seal here
                                        to unveil three random stickers. Stickers are yours
                                        to wield across Calamity.
                                    </p>
                                </div>
                                <button
                                    className={styles.primaryButton}
                                    onClick={handleConnect}
                                >
                                    Connect Wallet
                                </button>
                            </div>
                            <a
                                href={RONIN_MARKETPLACE_URL}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={styles.marketplaceLink}
                            >
                                <span>Acquire a pack on Ronin Marketplace</span>
                                <ArrowIcon />
                            </a>
                        </div>
                    )}

                    {/* Step 2: Inventory */}
                    {step === 'inventory' && (
                        <div className={styles.stepContainer} key="inventory">
                            <h2 className={styles.sectionTitle}>Your Sealed Packs</h2>
                            <p className={styles.sectionSubtitle}>
                                {packs.length > 0
                                    ? 'Break the seal to reveal three stickers.'
                                    : 'No sealed packs in your vault.'}
                            </p>

                            {packs.length > 0 ? (
                                <div className={styles.packGrid}>
                                    {packs.map((pack) => (
                                        <div key={pack.id} className={styles.packCard}>
                                            <div className={styles.packArtWrap}>
                                                <PackArt />
                                            </div>
                                            <div className={styles.packMain}>
                                                <div className={styles.packBody}>
                                                    <h3 className={styles.packName}>{pack.label}</h3>
                                                    <p className={styles.packToken}>Token {pack.tokenId}</p>
                                                </div>
                                                <button
                                                    className={styles.breakSealButton}
                                                    onClick={() => handleBurnPack(pack)}
                                                >
                                                    Break Seal
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyArtWrap}>
                                        <PackArt muted />
                                    </div>
                                    <p className={styles.emptyText}>
                                        Your vault is empty.
                                    </p>
                                </div>
                            )}

                            <a
                                href={RONIN_MARKETPLACE_URL}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={styles.marketplaceLink}
                            >
                                <span>Acquire more packs on Ronin Marketplace</span>
                                <ArrowIcon />
                            </a>
                        </div>
                    )}

                    {/* Step 3: Revealing */}
                    {step === 'revealing' && (
                        <div className={`${styles.stepContainer} ${styles.revealingStep}`} key={`revealing-${revealKey}`}>
                            <p className={styles.progressText}>Breaking Seal {activePack?.tokenId}</p>
                            <h2 className={styles.sectionTitle}>Unveiling Your Runes</h2>
                            <p className={styles.sectionSubtitle}>
                                The seal yields. Claim what falls free.
                            </p>
                            <div className={styles.revealArea}>
                                <StickerReveal
                                    key={revealKey}
                                    stickers={revealedStickers}
                                    onComplete={handleRevealComplete}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Summary */}
                    {step === 'summary' && (
                        <div className={`${styles.stepContainer} ${styles.summaryStep}`} key="summary">
                            <p className={styles.progressText}>Three Runes Claimed</p>
                            <h2 className={styles.sectionTitle}>The Seal of {activePack?.tokenId}</h2>
                            <p className={styles.sectionSubtitle}>
                                Pack consumed. Stickers bound to your vault.
                            </p>
                            <div className={styles.summaryGrid}>
                                {revealedStickers.map((sticker, idx) => (
                                    <div key={`${sticker.id}-${idx}`} className={styles.summaryCard}>
                                        <StickerArt sticker={sticker} />
                                        <span className={styles.summaryStickerName}>{sticker.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.summaryActions}>
                                {packs.length > 0 ? (
                                    <button
                                        className={styles.mintButton}
                                        onClick={handleBackToInventory}
                                    >
                                        Break Another Seal
                                    </button>
                                ) : (
                                    <a
                                        href={RONIN_MARKETPLACE_URL}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className={styles.mintButton}
                                    >
                                        Acquire More Packs
                                    </a>
                                )}
                                <button
                                    className={styles.secondaryButton}
                                    onClick={handleBackToInventory}
                                >
                                    Return to Vault
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />

            <TransactionModal
                isOpen={showTxModal}
                onClose={() => setShowTxModal(false)}
                txHash={txHash}
                step={1}
                totalSteps={1}
            />
        </div>
    );
}

// ─── Sealed booster pack (replaces the gift-box look) ─────────────
// Vertical pack with leather body, gold trim, runic seal, and a
// torn top edge — no ribbons, no bows.
export function PackArt({ muted = false }) {
    return (
        <svg
            viewBox="0 0 80 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${styles.packArt} ${muted ? styles.packArtMuted : ''}`}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="pack-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2a1d3f" />
                    <stop offset="55%" stopColor="#1c1330" />
                    <stop offset="100%" stopColor="#120c20" />
                </linearGradient>
                <linearGradient id="pack-body-rim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3f2e66" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#1a1230" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="pack-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0d860" />
                    <stop offset="55%" stopColor="#c9a836" />
                    <stop offset="100%" stopColor="#7a6420" />
                </linearGradient>
                <radialGradient id="pack-seal" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#c54a4a" />
                    <stop offset="55%" stopColor="#8a2a35" />
                    <stop offset="100%" stopColor="#3e1118" />
                </radialGradient>
            </defs>

            {/* Outer rim (gold trim seen behind body) */}
            <path
                d="M8 14 L14 8 L66 8 L72 14 L72 110 L66 116 L14 116 L8 110 Z"
                fill="url(#pack-gold)"
                opacity="0.85"
            />

            {/* Body — clipped 1.5px inside rim */}
            <path
                d="M10 15 L15.5 9.5 L64.5 9.5 L70 15 L70 109 L64.5 114.5 L15.5 114.5 L10 109 Z"
                fill="url(#pack-body)"
                stroke="url(#pack-body-rim)"
                strokeWidth="0.5"
            />

            {/* Torn / perforated top edge */}
            <path
                d="M14 22 L18 18 L22 22 L26 18 L30 22 L34 18 L38 22 L42 18 L46 22 L50 18 L54 22 L58 18 L62 22 L66 18"
                stroke="url(#pack-gold)"
                strokeWidth="0.6"
                fill="none"
                opacity="0.7"
            />

            {/* Inner panel hairline */}
            <rect
                x="15"
                y="26"
                width="50"
                height="76"
                rx="2"
                fill="none"
                stroke="rgba(132, 74, 203, 0.25)"
                strokeWidth="0.6"
            />

            {/* Runic glyphs row (top) */}
            <g opacity="0.55" fill="url(#pack-gold)">
                <rect x="22" y="34" width="2" height="6" rx="0.4" />
                <rect x="27" y="32" width="2" height="8" rx="0.4" />
                <rect x="32" y="35" width="2" height="5" rx="0.4" />
                <rect x="40" y="33" width="2" height="7" rx="0.4" />
                <rect x="45" y="34" width="2" height="6" rx="0.4" />
                <rect x="50" y="32" width="2" height="8" rx="0.4" />
                <rect x="55" y="35" width="2" height="5" rx="0.4" />
            </g>

            {/* Wax seal — center, with stamped 'C' */}
            <g>
                <circle cx="40" cy="64" r="13" fill="url(#pack-seal)" />
                <circle
                    cx="40"
                    cy="64"
                    r="13"
                    fill="none"
                    stroke="rgba(255, 220, 180, 0.18)"
                    strokeWidth="0.8"
                />
                <circle
                    cx="40"
                    cy="64"
                    r="10"
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.35)"
                    strokeWidth="0.5"
                    strokeDasharray="0.8 1.2"
                />
                {/* Stylized C glyph */}
                <path
                    d="M45 60 A6 6 0 1 0 45 68"
                    stroke="rgba(255, 224, 184, 0.85)"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Highlight */}
                <ellipse
                    cx="36"
                    cy="60"
                    rx="3.5"
                    ry="1.5"
                    fill="rgba(255, 200, 200, 0.25)"
                    transform="rotate(-25 36 60)"
                />
            </g>

            {/* Bottom runic glyphs row */}
            <g opacity="0.45" fill="url(#pack-gold)">
                <rect x="26" y="88" width="2" height="6" rx="0.4" />
                <rect x="31" y="86" width="2" height="8" rx="0.4" />
                <rect x="38" y="89" width="2" height="5" rx="0.4" />
                <rect x="45" y="87" width="2" height="7" rx="0.4" />
                <rect x="50" y="88" width="2" height="6" rx="0.4" />
            </g>

            {/* Subtle inner shadow up top */}
            <rect x="10" y="10" width="60" height="14" fill="rgba(0, 0, 0, 0.35)" />
        </svg>
    );
}

// ─── Sticker visual (used by both reveal and summary) ─────────────
// Size is driven by a CSS variable on the parent context (--sticker-size)
// so reveal and summary can override responsively at mobile breakpoints
// without inline-style overrides.
export function StickerArt({ sticker }) {
    return (
        <div className={styles.stickerArt}>
            <img src={sticker.icon} alt={sticker.name} className={styles.stickerImg} />
        </div>
    );
}

function ArrowIcon() {
    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={styles.arrowIcon}
        >
            <path
                d="M3 9L9 3M9 3H4M9 3V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default EmotesPage;
