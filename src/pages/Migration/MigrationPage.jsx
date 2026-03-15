import React from 'react';
import { ButtonConnectWallet } from "@shared/components/web3/ConnectButton/ConnectButton.jsx";
import migrationRings from './assets/migration_rings.png';
import styles from './MigrationPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';
import migBg from './assets/migBg.png';

function Migration() {
    return (
        <div className={styles.migrationPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <div className={styles.headerImage}>
                    <img src={migBg} alt="Dragon Rings" className={styles.headerDesktop} />
                </div>

                <div className={styles.headerSection}>
                    <h1>Artifacts Migration: Transform into Dragon Rings</h1>

                    <p className={styles.descriptionMigration}>
                        Burn your Artifact NFTs to receive Dragon Rings on the Ronin Network.
                        <img src={migrationRings} alt="Dragon Rings Variants"/>
                    </p>

                    <div className={styles.frame}>
                        <div className={styles.title}>Migrate Artifact</div>
                        <div className={styles.heading}>Connect your wallet</div>
                        <ButtonConnectWallet/>
                    </div>
                </div>
            </section>
            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default Migration;
