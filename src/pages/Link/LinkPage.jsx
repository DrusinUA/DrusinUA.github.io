import React from 'react';
import styles from './LinkPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import linkHeader from './assets/linkHeaderDesktop.png';

function LinkPage() {
    return (
        <div className={styles.testPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.headerImage}>
                    <img src={linkHeader} alt="" className={styles.headerDesktop} />
                </div>

                <div className={styles.innerFrame}>
                    <h1 className={styles.pageTitle}>Link Your Account</h1>
                    <p className={styles.subtitle}>Connect your wallet and game account to receive rewards</p>

                    <div className={styles.descriptionBox}>
                        <p>Sign in to link your wallet with your Calamity game account. This will allow you to receive NFT rewards and participate in exclusive events.</p>
                    </div>

                    <div className={styles.buttonsRow}>
                        <button className={styles.primaryButton} onClick={() => alert('Login disabled in preview')}>
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            <p className={styles.supportText}>
                <a href="https://discord.gg/n3uBgxpTmE" target="_blank" rel="noopener noreferrer">Need help? Contact Support</a>
            </p>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default LinkPage;
