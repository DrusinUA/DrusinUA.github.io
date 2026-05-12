import React, { useState } from 'react';
import styles from './LotteriesPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import lotteryHeader from './assets/lottery.png';
import runicOrbImg from '../../../assets/Magic Orb.gif';
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
        eligible: true,
        subtitle: 'Participation Lottery',
        eligibility: 'Players who reached Difficulty Level 5+',
        totalPrizes: 127,
        drawInfo: '3 weeks after Play Test ends',
        prizes: [
            { id: 'ring', name: 'Ring NFT', icon: dragonRing, quantity: 3 },
            { id: 'factory', name: 'Factory NFT', icon: factory, quantity: 9 },
            { id: 'katana', name: "Jin's Katana NFT", icon: katana, quantity: 10 },
            { id: 'flame', name: 'Fiery Crowns NFT', icon: circleOfFlame, quantity: 5 },
            { id: 'ron', name: '50 RON Voucher', icon: ronCoin, quantity: 100 },
        ],
        nothingWeight: 0.975,
    },
    {
        id: 'bestiary',
        label: 'Bestiary Cache',
        eligible: true,
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
        eligible: true,
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
    return lottery.prizes[Math.floor(Math.random() * lottery.prizes.length)];
}

function createSequenceSignature(sequence) {
    return sequence
        .map(({ lottery, result }) => `${lottery.id}:${result?.id ?? 'lose'}`)
        .join('|');
}

function buildRevealSequence(lotteries, previousSignature = '') {
    const eligibleLotteries = lotteries.filter((lottery) => lottery.eligible);

    if (!eligibleLotteries.length) {
        return [];
    }

    for (let attempt = 0; attempt < 8; attempt += 1) {
        const winStates = eligibleLotteries.map(() => Math.random() >= 0.45);

        if (!winStates.some(Boolean)) {
            winStates[Math.floor(Math.random() * winStates.length)] = true;
        }

        if (eligibleLotteries.length > 1 && winStates.every(Boolean)) {
            winStates[Math.floor(Math.random() * winStates.length)] = false;
        }

        const nextSequence = eligibleLotteries.map((lottery, index) => ({
            lottery,
            result: winStates[index] ? selectPrize(lottery) : null,
        }));

        if (createSequenceSignature(nextSequence) !== previousSignature) {
            return nextSequence;
        }
    }

    return eligibleLotteries.map((lottery, index) => ({
        lottery,
        result: index === 0 ? selectPrize(lottery) : null,
    }));
}

function LotteriesPage() {
    const [step, setStep] = useState('connect'); // connect | select | revealing | summary
    const [revealSequence, setRevealSequence] = useState([]);
    const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
    const [revealKey, setRevealKey] = useState(0);
    const [lastSequenceSignature, setLastSequenceSignature] = useState('');
    const [showTxModal, setShowTxModal] = useState(false);
    const [txHash, setTxHash] = useState(null);

    const eligibleLotteries = LOTTERIES.filter((lottery) => lottery.eligible);
    const currentReveal = revealSequence[currentRevealIndex] ?? null;
    const wonResults = revealSequence.filter(({ result }) => Boolean(result));
    const totalWon = wonResults.length;
    const totalMissed = revealSequence.length - totalWon;
    const summaryTitle = totalWon === 0
        ? 'Eligible Lottery Results'
        : totalWon === 1
            ? 'Your Prize'
            : 'Your Prizes';
    const summaryText = totalWon === 0
        ? `No prize was revealed across ${revealSequence.length} eligible lotteries.`
        : `You won ${totalWon} prize${totalWon === 1 ? '' : 's'} and missed ${totalMissed} ${totalMissed === 1 ? 'lottery' : 'lotteries'}.`;

    const handleConnect = () => {
        setStep('select');
    };

    const handleStartRevealSequence = () => {
        const nextSequence = buildRevealSequence(LOTTERIES, lastSequenceSignature);

        setRevealSequence(nextSequence);
        setLastSequenceSignature(createSequenceSignature(nextSequence));
        setCurrentRevealIndex(0);
        setRevealKey((prev) => prev + 1);
        setStep('revealing');
    };

    const handleRevealComplete = () => {
        if (currentRevealIndex < revealSequence.length - 1) {
            setCurrentRevealIndex((prev) => prev + 1);
            setRevealKey((prev) => prev + 1);
            return;
        }

        setStep('summary');
    };

    const handleMint = () => {
        setShowTxModal(true);
        setTxHash(null);
        setTimeout(() => setTxHash(`0x${Math.random().toString(16).slice(2)}`), 2000);
    };

    const handleBackToOverview = () => {
        setRevealSequence([]);
        setCurrentRevealIndex(0);
        setRevealKey(0);
        setShowTxModal(false);
        setTxHash(null);
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
                        <div className={`${styles.stepContainer} ${styles.connectStep}`} key="connect">
                            <div className={styles.connectTop}>
                                <h1 className={styles.pageTitle}>Play Test Lotteries</h1>
                                <p className={styles.subtitle}>
                                    Will the odds be in your favor?
                                </p>
                            </div>
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
                            <h1 className={styles.pageTitle}>Lotteries</h1>
                            <p className={styles.subtitle}>
                                All lotteries will reveal automatically, one by one.
                            </p>
                            <div className={styles.lotteryGrid}>
                                {LOTTERIES.map((lottery) => (
                                    <div
                                        key={lottery.id}
                                        className={`${styles.lotteryCard} ${!lottery.eligible ? styles.lotteryCardIneligible : ''}`}
                                    >
                                        <div className={styles.lotteryCardInfo}>
                                            <h3 className={styles.lotteryName}>{lottery.label}</h3>
                                            <p className={styles.lotterySubtitle}>{lottery.subtitle}</p>
                                            <p className={styles.lotteryMeta}>
                                                {lottery.totalPrizes} prizes &middot; {lottery.eligibility}
                                            </p>
                                        </div>
                                        <div className={styles.lotteryPreviews}>
                                            {lottery.prizes.slice(0, 5).map((p) => (
                                                <img key={p.id} src={p.icon} alt={p.name} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className={styles.revealButton}
                                onClick={handleStartRevealSequence}
                                disabled={!eligibleLotteries.length}
                            >
                                <span className={styles.revealButtonShine} />
                                Reveal
                            </button>
                        </div>
                    )}

                    {/* Step 3: Sequential reveal */}
                    {step === 'revealing' && currentReveal && (
                        <div className={styles.stepContainer} key={`revealing-${currentReveal.lottery.id}`}>
                            <p className={styles.progressText}>
                                Lottery {currentRevealIndex + 1} of {revealSequence.length}
                            </p>
                            <h2 className={styles.sectionTitle}>{currentReveal.lottery.label}</h2>
                            <p className={styles.sectionSubtitle}>
                                {currentReveal.lottery.subtitle} &middot; {currentReveal.lottery.totalPrizes} prizes
                            </p>
                            <div className={styles.revealArea}>
                                <LootboxReveal
                                    key={revealKey}
                                    result={currentReveal.result}
                                    onComplete={handleRevealComplete}
                                    image={runicOrbImg}
                                    completeDelayMs={1600}
                                />
                            </div>
                            <p className={styles.autoAdvanceText}>
                                Lotteries are being revealed automatically, one by one.
                            </p>
                        </div>
                    )}

                    {/* Step 4: Summary */}
                    {step === 'summary' && (
                        <div className={styles.stepContainer} key="summary">
                            <h2 className={styles.sectionTitle}>{summaryTitle}</h2>
                            <p className={styles.sectionSubtitle}>{summaryText}</p>
                            {totalWon > 0 ? (
                                <div className={styles.summaryGrid}>
                                    {wonResults.map(({ lottery, result }) => (
                                        <div
                                            key={lottery.id}
                                            className={`${styles.summaryCard} ${styles.summaryCardWin}`}
                                        >
                                            <div className={styles.summaryHeader}>
                                                <div className={styles.summaryText}>
                                                    <h3 className={styles.summaryTitle}>{lottery.label}</h3>
                                                    <p className={styles.summarySubtitle}>{lottery.subtitle}</p>
                                                </div>
                                                <span className={`${styles.summaryStatus} ${styles.summaryStatusWin}`}>
                                                    Won
                                                </span>
                                            </div>
                                            <div className={styles.summaryPrize}>
                                                <div className={styles.summaryPrizeIcon}>
                                                    <img src={result.icon} alt={result.name} />
                                                </div>
                                                <div className={styles.summaryPrizeCopy}>
                                                    <span className={styles.summaryPrizeLabel}>Your prize</span>
                                                    <span className={styles.summaryPrizeName}>{result.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.summaryPanel}>
                                    <svg className={styles.summaryEmptyOrb} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <radialGradient id="summaryOrbGlow" cx="50%" cy="45%" r="50%">
                                                <stop offset="0%" stopColor="#5a4588" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#2e2551" stopOpacity="0" />
                                            </radialGradient>
                                            <radialGradient id="summaryOrbBody" cx="40%" cy="35%" r="55%">
                                                <stop offset="0%" stopColor="#6b4f9e" />
                                                <stop offset="50%" stopColor="#4a357a" />
                                                <stop offset="100%" stopColor="#2e2551" />
                                            </radialGradient>
                                            <linearGradient id="summaryCrack" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#3f2e66" />
                                                <stop offset="100%" stopColor="#231E41" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="40" cy="40" r="38" fill="url(#summaryOrbGlow)" />
                                        <circle cx="40" cy="40" r="28" fill="url(#summaryOrbBody)" stroke="#5a4588" strokeWidth="1.5" />
                                        <ellipse cx="33" cy="32" rx="8" ry="5" fill="rgba(132, 74, 203, 0.3)" transform="rotate(-20 33 32)" />
                                        <path d="M34 28 L38 40 L32 44 L36 54" stroke="url(#summaryCrack)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
                                        <path d="M38 40 L46 38 L50 44" stroke="url(#summaryCrack)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
                                        <path d="M32 44 L26 50" stroke="url(#summaryCrack)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
                                        <circle cx="30" cy="30" r="1" fill="#6b4f9e" opacity="0.6">
                                            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="50" cy="35" r="0.8" fill="#5a4588" opacity="0.4">
                                            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
                                        </circle>
                                    </svg>
                                    <h3 className={styles.summaryHeroTitle}>Sorry, no prize this time</h3>
                                    <p className={styles.summaryHeroText}>
                                        All {revealSequence.length} lotteries completed without a win. Better luck next round!
                                    </p>
                                </div>
                            )}
                            <div className={styles.summaryActions}>
                                {totalWon > 0 && (
                                    <button
                                        className={styles.mintButton}
                                        onClick={handleMint}
                                    >
                                        Mint {totalWon} item{totalWon === 1 ? '' : 's'}
                                    </button>
                                )}
                                <button
                                    className={styles.secondaryButton}
                                    onClick={handleBackToOverview}
                                >
                                    Back to lottery overview
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

export default LotteriesPage;
