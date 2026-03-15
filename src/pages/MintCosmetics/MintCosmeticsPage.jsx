import React from 'react';
import { ButtonConnectWallet } from "@shared/components/web3/ConnectButton/ConnectButton.jsx";
import styles from './MintCosmeticsPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import cosmeticsHeader from './assets/cosmeticsHeaderDesktop.png';

function MintCosmetics() {
    return (
        <div className={styles.mintCosmeticsPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.headerImage}>
                    <img src={cosmeticsHeader} alt="" className={styles.headerDesktop} />
                </div>

                <div className={styles.innerFrame}>
                    <h1 className={styles.pageTitle}>Mint Cosmetic Items</h1>

                    <p className={styles.subtitle}>
                        Connect a wallet eligible for Cosmetic Item minting to continue.
                    </p>

                    <div className={styles.connectBlock}>
                        <div className={styles.descriptionBox}>
                            <p>Cosmetic Items are NFTs that can be freely traded. Link your in-game account to a wallet holding these NFTs to use them inside the game.</p>
                        </div>
                        <ButtonConnectWallet className={styles.fullWidthButton} />
                    </div>
                </div>
            </section>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default MintCosmetics;
