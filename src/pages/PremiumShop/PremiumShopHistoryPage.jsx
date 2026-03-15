import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PremiumShopHistoryPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import shopHeader from './assets/shopHeaderDesktop.png';

function PremiumShopHistoryPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.historyPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.headerImage}>
                    <img src={shopHeader} alt="Shop" className={styles.headerDesktop} />
                </div>

                <button
                    className={styles.backLink}
                    onClick={() => navigate('/shop')}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Shop
                </button>

                <div className={styles.historySection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Payment History</h2>
                        <p className={styles.sectionSubtitle}>Sign in to view your transaction history</p>
                    </div>

                    <div className={styles.emptyStateMobile}>
                        No transactions found
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

export default PremiumShopHistoryPage;
