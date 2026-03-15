import React, { useState } from 'react';
import styles from './LotteriesPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import lotteryHeader from './assets/lottery.jpg';
import chestImg from '../PreSale/assets/presale/chest.png';
import { LootboxReveal } from './components/LootboxReveal/LootboxReveal.jsx';
import { TransactionModal } from '@shared/components/ui/TransactionModal/TransactionModal.jsx';

// Prize assets
import dragonRing from './assets/dragon_ring.png';
import factory from './assets/factory.png';
import katana from './assets/katana.png';
import circleOfFlame from './assets/circle_of_flame.png';
import ronCoin from './assets/ron_coin.png';
import mythicalBeast from './assets/mythical_beast.png';
import factoryExclusive from './assets/factory_exclusive.png';

const LOTTERIES = [
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

function selectPrize(lottery) {
    const roll = Math.random();
    if (roll < lottery.nothingWeight) return null;

    const totalWeight = lottery.prizes.reduce((sum, p) => sum + p.quantity, 0);
    const prizeRoll = Math.random() * totalWeight;
    let cumulative = 0;
    for (const prize of lottery.prizes) {
        cumulative += prize.quantity;
        if (prizeRoll < cumulative) return prize;
    }
    return lottery.prizes[lottery.prizes.length - 1];
}

function LotteriesPage() {
    const [step, setStep] = useState('connect'); // connect | select | reveal | revealing | result
    const [selectedLottery, setSelectedLottery] = useState(null);
    const [result, setResult] = useState(undefined);
    const [revealKey, setRevealKey] = useState(0);
    const [showTxModal, setShowTxModal] = useState(false);
    const [txHash, setTxHash] = useState(null);

    const handleConnect = () => {
        setStep('select');
    };

    const handleSelectLottery = (lottery) => {
        setSelectedLottery(lottery);
        setResult(undefined);
        setStep('reveal');
    };

    const handleReveal = () => {
        const prize = selectPrize(selectedLottery);
        setResult(prize);
        setRevealKey(prev => prev + 1);
        setStep('revealing');
    };

    const handleRevealComplete = () => {
        setStep('result');
    };

    const handleMint = () => {
        setShowTxModal(true);
        setTxHash(null);
        setTimeout(() => setTxHash('0x' + Math.random().toString(16).slice(2)), 2000);
    };

    const handleBackToSelect = () => {
        setSelectedLottery(null);
        setResult(undefined);
        setStep('select');
    };

    return (
        <div className={styles.lotteriesPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.headerImage}>
                    <img src={lotteryHeader} alt="" className={styles.headerDesktop} />
                </div>

                <div className={styles.innerFrame}>
                    {/* Step 1: Connect */}
                    {step === 'connect' && (
                        <div className={styles.stepContainer} key="connect">
                            <h1 className={styles.pageTitle}>Play Test Lotteries</h1>
                            <p className={styles.subtitle}>
                                Will the odds be in your favor?
                            </p>
                            <div className={styles.conditionsBox}>
                                Three exclusive lotteries await Play Test participants.
                                Connect your wallet to discover which lotteries you
                                qualify for and reveal your results.
                            </div>
                            <button
                                className={styles.connectButton}
                                onClick={handleConnect}
                            >
                                Connect Wallet
                            </button>
                        </div>
                    )}

                    {/* Step 2: Select lottery */}
                    {step === 'select' && (
                        <div className={styles.stepContainer} key="select">
                            <h1 className={styles.pageTitle}>Your Eligible Lotteries</h1>
                            <p className={styles.subtitle}>
                                Select a lottery to reveal your result
                            </p>
                            <div className={styles.lotteryGrid}>
                                {LOTTERIES.map((lottery) => (
                                    <div
                                        key={lottery.id}
                                        className={styles.lotteryCard}
                                        onClick={() => handleSelectLottery(lottery)}
                                    >
                                        <div className={styles.lotteryCardInfo}>
                                            <h3 className={styles.lotteryName}>{lottery.label}</h3>
                                            <p className={styles.lotterySubtitle}>{lottery.subtitle}</p>
                                            <p className={styles.lotteryMeta}>
                                                {lottery.totalPrizes} prizes &middot; {lottery.eligibility}
                                            </p>
                                        </div>
                                        <div className={styles.lotteryPreviews}>
                                            {lottery.prizes.slice(0, 3).map((p) => (
                                                <img key={p.id} src={p.icon} alt={p.name} />
                                            ))}
                                        </div>
                                        <span className={styles.eligibleBadge}>Eligible</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Prize preview + reveal button */}
                    {step === 'reveal' && selectedLottery && (
                        <div className={styles.stepContainer} key="reveal">
                            <h2 className={styles.sectionTitle}>{selectedLottery.label}</h2>
                            <p className={styles.sectionSubtitle}>
                                {selectedLottery.subtitle} &middot; {selectedLottery.totalPrizes} prizes
                            </p>
                            <div className={styles.prizeGrid}>
                                {selectedLottery.prizes.map((prize) => (
                                    <div key={prize.id} className={styles.prizeCard}>
                                        <div className={styles.prizeImageWrap}>
                                            <img src={prize.icon} alt={prize.name} className={styles.prizeImage} />
                                        </div>
                                        <span className={styles.prizeName}>{prize.name}</span>
                                        <span className={styles.prizeQty}>x{prize.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                className={styles.revealButton}
                                onClick={handleReveal}
                            >
                                REVEAL MY RESULT
                            </button>
                            <button
                                className={styles.backLink}
                                onClick={handleBackToSelect}
                            >
                                Back to lotteries
                            </button>
                        </div>
                    )}

                    {/* Step 3b: Revealing animation */}
                    {step === 'revealing' && (
                        <div className={styles.stepContainer} key="revealing">
                            <h2 className={styles.sectionTitle}>{selectedLottery.label}</h2>
                            <div className={styles.revealArea}>
                                <LootboxReveal
                                    key={revealKey}
                                    result={result}
                                    onComplete={handleRevealComplete}
                                    image={chestImg}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Result */}
                    {step === 'result' && (
                        <div className={styles.stepContainer} key="result">
                            <h2 className={styles.sectionTitle}>{selectedLottery.label}</h2>

                            {result ? (
                                <div className={styles.resultBlock}>
                                    <div className={styles.winIcon}>
                                        <img src={result.icon} alt={result.name} />
                                    </div>
                                    <h3 className={styles.winTitle}>You Won!</h3>
                                    <p className={styles.winPrize}>{result.name}</p>
                                    <button
                                        className={styles.mintButton}
                                        onClick={handleMint}
                                    >
                                        Mint NFT
                                    </button>
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

                            <button
                                className={styles.secondaryButton}
                                onClick={handleBackToSelect}
                            >
                                Check Another Lottery
                            </button>

                            <div className={styles.disclaimer}>
                                This is a preview. Official results announced after the Play Test.
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

export default LotteriesPage;
