import React, { useState, useEffect, useCallback } from 'react';
import styles from './LotteryPopup.module.scss';

// Prize assets
import dragonRing from '../../assets/dragon_ring.png';
import factory from '../../assets/factory.png';
import katana from '../../assets/katana.png';
import circleOfFlame from '../../assets/circle_of_flame.png';
import ronCoin from '../../assets/ron_coin.png';
import mythicalBeast from '../../assets/mythical_beast.png';
import factoryExclusive from '../../assets/factory_exclusive.png';

const TABS = [
    {
        id: 'hoard',
        label: "Dragon's Hoard",
        subtitle: 'Participation Lottery',
        eligibility: 'Players who reached Difficulty Level 5+',
        totalPrizes: 127,
        drawInfo: '3 weeks after Play Test ends',
        prizes: [
            { id: 'ring', name: 'Ring NFT', icon: dragonRing, quantity: 3 },
            { id: 'factory', name: 'Factory NFT', icon: factory, quantity: 9 },
            { id: 'katana', name: "Jin's Katana NFT", icon: katana, quantity: 10 },
            { id: 'flame', name: 'Circle of Flame NFT', icon: circleOfFlame, quantity: 5 },
            { id: 'ron', name: '50 RON Voucher', icon: ronCoin, quantity: 100 },
        ],
        nothingWeight: 0.975,
    },
    {
        id: 'bestiary',
        label: 'Bestiary Cache',
        subtitle: 'Lootbox Lottery',
        eligibility: 'All Lootbox buyers (1 purchase = 1 ticket)',
        totalPrizes: 20,
        drawInfo: '3 weeks after Play Test ends',
        prizes: [
            { id: 'beast', name: 'Mythical Beast Cosmetic NFT', icon: mythicalBeast, quantity: 20 },
        ],
        nothingWeight: 0.90,
    },
    {
        id: 'forge',
        label: "Forgemaster's Fortune",
        subtitle: 'Factory Buyer Lottery',
        eligibility: 'All Factory buyers during Play Test (1 purchase = 1 ticket)',
        totalPrizes: 20,
        drawInfo: '3 weeks after Play Test ends',
        prizes: [
            { id: 'factory-ex', name: 'Factory-themed NFT (Exclusive)', icon: factoryExclusive, quantity: 20 },
        ],
        nothingWeight: 0.90,
    },
];

function selectPrize(tab) {
    const roll = Math.random();
    if (roll < tab.nothingWeight) return null;

    const totalWeight = tab.prizes.reduce((sum, p) => sum + p.quantity, 0);
    const prizeRoll = Math.random() * totalWeight;
    let cumulative = 0;
    for (const prize of tab.prizes) {
        cumulative += prize.quantity;
        if (prizeRoll < cumulative) return prize;
    }
    return tab.prizes[tab.prizes.length - 1];
}

export function LotteryPopup({ onClose }) {
    const [activeTab, setActiveTab] = useState(0);
    const [phase, setPhase] = useState('browse'); // browse | revealing | result
    const [result, setResult] = useState(undefined);

    const tab = TABS[activeTab];

    const handleClose = useCallback(() => onClose(), [onClose]);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [handleClose]);

    const handleReveal = () => {
        const prize = selectPrize(tab);
        setResult(prize);
        setPhase('revealing');
        setTimeout(() => setPhase('result'), 2000);
    };

    const handleReset = () => {
        setPhase('browse');
        setResult(undefined);
    };

    const handleTabChange = (idx) => {
        setActiveTab(idx);
        handleReset();
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.container} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={handleClose}>&#10005;</button>

                <h2 className={styles.title}>PLAY TEST LOTTERIES</h2>
                <p className={styles.subtitle}>"Will the odds be in your favor?"</p>

                {/* Tabs */}
                <div className={styles.tabs}>
                    {TABS.map((t, idx) => (
                        <button
                            key={t.id}
                            className={`${styles.tab} ${idx === activeTab ? styles.tabActive : ''}`}
                            onClick={() => handleTabChange(idx)}
                            disabled={phase !== 'browse'}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab info */}
                <div className={styles.tabInfo}>
                    <p className={styles.eligibility}>
                        <strong>Eligibility:</strong> {tab.eligibility}
                    </p>
                    <p className={styles.drawDetails}>
                        Total prizes: {tab.totalPrizes} | Draw: {tab.drawInfo}
                    </p>
                </div>

                {/* Fixed-height content area */}
                <div className={styles.contentArea}>
                    {phase === 'browse' && (
                        <div className={styles.browseContent}>
                            <div className={styles.prizeGrid}>
                                {tab.prizes.map((prize) => (
                                    <div key={prize.id} className={styles.prizeCard}>
                                        <div className={styles.prizeImageWrap}>
                                            <img src={prize.icon} alt={prize.name} className={styles.prizeImage} />
                                        </div>
                                        <span className={styles.prizeName}>{prize.name}</span>
                                        <span className={styles.prizeQty}>x{prize.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={styles.revealBtn} onClick={handleReveal}>
                                CHECK MY RESULT
                            </button>
                        </div>
                    )}

                    {phase === 'revealing' && (
                        <div className={styles.revealingContent}>
                            <div className={styles.revealOrb} />
                            <p className={styles.revealingText}>Checking your result...</p>
                        </div>
                    )}

                    {phase === 'result' && (
                        <div className={styles.resultContent}>
                            {result ? (
                                <div className={styles.winBlock}>
                                    <div className={styles.winIcon}>
                                        <img src={result.icon} alt={result.name} />
                                    </div>
                                    <h3 className={styles.winTitle}>You Won!</h3>
                                    <p className={styles.winPrize}>{result.name}</p>
                                </div>
                            ) : (
                                <div className={styles.loseBlock}>
                                    <div className={styles.loseIcon}>&#10060;</div>
                                    <h3 className={styles.loseTitle}>No prize this time</h3>
                                    <p className={styles.loseText}>
                                        Better luck in the next draw!
                                    </p>
                                </div>
                            )}

                            <button className={styles.revealBtn} onClick={handleReset}>
                                Try Another Lottery
                            </button>
                        </div>
                    )}
                </div>

                {/* Disclaimer */}
                <div className={styles.disclaimer}>
                    This is a preview. Official results announced after the Play Test.
                </div>
            </div>
        </div>
    );
}
