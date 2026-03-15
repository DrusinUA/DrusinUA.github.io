import React, { useState } from 'react';
import styles from './LotteriesPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import { LotteryPopup } from './components/LotteryPopup/LotteryPopup.jsx';

function LotteriesPage() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className={styles.lotteriesPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.innerFrame}>
                    <h1 className={styles.pageTitle}>Play Test Lotteries</h1>
                    <p className={styles.subtitle}>Will the odds be in your favor?</p>

                    <button
                        className={styles.openButton}
                        onClick={() => setShowPopup(true)}
                    >
                        CHECK MY RESULTS
                    </button>

                    <p className={styles.chooseText}>
                        Connect your wallet and check your lottery results
                    </p>
                </div>
            </section>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />

            {showPopup && (
                <LotteryPopup onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
}

export default LotteriesPage;
