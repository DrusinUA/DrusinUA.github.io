import React, { useState } from 'react';
import styles from './WalletCheckerPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import walletCheckerHeader from './assets/walletCheckerHeaderDesktop.png';

function WalletCheckerPage() {
    const [walletAddress, setWalletAddress] = useState('');

    const handleCheck = () => {
        alert('Wallet checking disabled in preview');
    };

    return (
        <div className={styles.walletCheckerPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.headerImage}>
                    <img src={walletCheckerHeader} alt="" className={styles.headerDesktop} />
                </div>

                <div className={styles.innerFrame}>
                    <h1 className={styles.pageTitle}>Check Your Mint Eligibility</h1>
                    <p className={styles.subtitle}>
                        Enter your wallet address to check your eligibility for the upcoming Factory NFT mint or WYRM token allocation.
                    </p>

                    <div className={styles.warningBox}>
                        <div className={styles.warningStripe}>
                            <div className={styles.warningIcon}>&#9888;&#65039;</div>
                            <p className={styles.warningTitle}>The WYRM token and Factory NFTs are not live yet!</p>
                        </div>
                        <p className={styles.warningText}>
                            The Factory NFT collection will be created and launched during the Main Factory Sale, following the Play-to-Airdrop campaign.
                        </p>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Enter Wallet Address</label>
                        <div className={styles.inputRow}>
                            <input
                                type="text"
                                className={styles.walletInput}
                                placeholder="0x..."
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                            />
                            <button
                                className={styles.checkButton}
                                onClick={handleCheck}
                                disabled={!walletAddress}
                            >
                                Check
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default WalletCheckerPage;
