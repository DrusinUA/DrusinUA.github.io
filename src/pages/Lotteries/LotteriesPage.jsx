import React, { useEffect, useState } from 'react';
import styles from './LotteriesPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import lotteryHeader from './assets/lottery.jpg';
import chestImg from '../PreSale/assets/presale/chest.png';
import { LootboxReveal } from './components/LootboxReveal/LootboxReveal.jsx';

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
            { id: 'flame', name: 'Circle of Flame NFT', icon: circleOfFlame, quantity: 5 },
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
    const [step, setStep] = useState('connect'); // connect | select | revealing | result | summary
    const [revealSequence, setRevealSequence] = useState([]);
    const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
    const [revealKey, setRevealKey] = useState(0);
    const [lastSequenceSignature, setLastSequenceSignature] = useState('');

    const eligibleLotteries = LOTTERIES.filter((lottery) => lottery.eligible);
    const currentReveal = revealSequence[currentRevealIndex] ?? null;

    useEffect(() => {
        if (step !== 'result' || !currentReveal) {
            return undefined;
        }

        const nextRevealTimer = setTimeout(() => {
            if (currentRevealIndex < revealSequence.length - 1) {
                setCurrentRevealIndex((prev) => prev + 1);
                setRevealKey((prev) => prev + 1);
                setStep('revealing');
                return;
            }

            setStep('summary');
        }, 1800);

        return () => clearTimeout(nextRevealTimer);
    }, [currentReveal, currentRevealIndex, revealSequence.length, step]);

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
        setStep('result');
    };

    const handleBackToOverview = () => {
        setRevealSequence([]);
        setCurrentRevealIndex(0);
        setRevealKey(0);
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
                                Eligible lotteries will reveal automatically, one by one.
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
                                            {lottery.prizes.slice(0, 3).map((p) => (
                                                <img key={p.id} src={p.icon} alt={p.name} />
                                            ))}
                                        </div>
                                        <span className={`${styles.statusBadge} ${lottery.eligible ? styles.eligibleBadge : styles.ineligibleBadge}`}>
                                            {lottery.eligible ? 'Eligible' : 'Not eligible'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button
                                className={styles.revealButton}
                                onClick={handleStartRevealSequence}
                                disabled={!eligibleLotteries.length}
                            >
                                Reveal Eligible Lotteries
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
                                    image={chestImg}
                                />
                            </div>
                            <p className={styles.autoAdvanceText}>
                                Only eligible lotteries are being revealed automatically.
                            </p>
                        </div>
                    )}

                    {/* Step 4: Result */}
                    {step === 'result' && currentReveal && (
                        <div className={styles.stepContainer} key={`result-${currentReveal.lottery.id}`}>
                            <p className={styles.progressText}>
                                Lottery {currentRevealIndex + 1} of {revealSequence.length}
                            </p>
                            <h2 className={styles.sectionTitle}>{currentReveal.lottery.label}</h2>
                            <p className={styles.sectionSubtitle}>{currentReveal.lottery.subtitle}</p>

                            {currentReveal.result ? (
                                <div className={styles.resultBlock}>
                                    <div className={styles.winIcon}>
                                        <img src={currentReveal.result.icon} alt={currentReveal.result.name} />
                                    </div>
                                    <h3 className={styles.winTitle}>You Won!</h3>
                                    <p className={styles.winPrize}>{currentReveal.result.name}</p>
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
                            <p className={styles.autoAdvanceText}>
                                {currentRevealIndex < revealSequence.length - 1
                                    ? 'Opening the next eligible lottery...'
                                    : 'Preparing your final summary...'}
                            </p>
                        </div>
                    )}

                    {/* Step 5: Summary */}
                    {step === 'summary' && (
                        <div className={styles.stepContainer} key="summary">
                            <h2 className={styles.sectionTitle}>Eligible Lottery Results</h2>
                            <p className={styles.sectionSubtitle}>
                                All {revealSequence.length} eligible lotteries were revealed in sequence.
                            </p>
                            <div className={styles.summaryGrid}>
                                {revealSequence.map(({ lottery, result }) => (
                                    <div
                                        key={lottery.id}
                                        className={`${styles.summaryCard} ${result ? styles.summaryCardWin : styles.summaryCardLose}`}
                                    >
                                        <div className={styles.summaryHeader}>
                                            <div className={styles.summaryText}>
                                                <h3 className={styles.summaryTitle}>{lottery.label}</h3>
                                                <p className={styles.summarySubtitle}>{lottery.subtitle}</p>
                                            </div>
                                            <span
                                                className={`${styles.summaryStatus} ${result ? styles.summaryStatusWin : styles.summaryStatusLose}`}
                                            >
                                                {result ? 'Won' : 'No prize'}
                                            </span>
                                        </div>

                                        {result ? (
                                            <div className={styles.summaryPrize}>
                                                <div className={styles.summaryPrizeIcon}>
                                                    <img src={result.icon} alt={result.name} />
                                                </div>
                                                <span className={styles.summaryPrizeName}>{result.name}</span>
                                            </div>
                                        ) : (
                                            <p className={styles.summaryLoseText}>
                                                No prize drawn in this lottery.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                className={styles.revealButton}
                                onClick={handleBackToOverview}
                            >
                                Back to lottery overview
                            </button>

                            <div className={styles.disclaimer}>
                                This is a preview. Official results announced after the Play Test.
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default LotteriesPage;
