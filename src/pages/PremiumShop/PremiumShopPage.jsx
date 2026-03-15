import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PremiumShopPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import shopHeader from './assets/shopHeaderDesktop.png';
import dragonGold from './assets/shop/Dragon on Gold.gif';
import dragonBack from './assets/shop/dragon.png';

function PremiumShopPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.shopPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.headerImage}>
                    <img src={shopHeader} alt="Shop" className={styles.headerDesktop} />
                </div>

                <div className={styles.productCard}>
                    <div className={styles.productImage}>
                        <img src={dragonGold} alt="Dragon on Gold" />
                    </div>

                    <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>In Game Gold</h3>
                        <p className={styles.productDesc}>
                            Purchase Gold directly into your in-game inventory at a fixed rate.
                        </p>
                        <p className={styles.productDesc}>
                            Spend it instantly on the Auction House, Gold Shop, Fishing, Duels, and other in-game activities.
                        </p>

                        <div className={styles.productPrice}>$1 = 100 Gold</div>

                        <button className={styles.actionButton} disabled>
                            Buy Gold
                        </button>
                        <button
                            type="button"
                            className={styles.linkHint}
                            onClick={() => navigate('/link')}
                        >
                            Link your in-game account first
                        </button>
                    </div>

                    <div
                        className={styles.productBackground}
                        style={{ backgroundImage: `url(${dragonBack})` }}
                    />
                </div>
            </section>

            <p className={styles.supportText}>
                <a href="https://discord.gg/n3uBgxpTmE" target="_blank" rel="noopener noreferrer">Need help? Contact Support</a>
            </p>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default PremiumShopPage;
