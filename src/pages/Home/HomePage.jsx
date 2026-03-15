import React from 'react';
import { useIsMobile } from '../../shared/hooks/useMediaQuery';
import allRings from './assets/addons/allRings.png';
import allArts from './assets/addons/allArts.png';
import discordIllustration from './assets/home/discordIllustration.png';
import tradeCosmetics from './assets/home/tradeCosmetics.png';
import iconSteam from './assets/home/iconSteam.svg';
import iconEpic from './assets/home/iconEpic.svg';
import iconApple from './assets/home/iconApple.svg';
import iconGooglePlay from './assets/home/iconGooglePlay.svg';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';

// Desktop assets
import gameCard from './assets/home/gameCard.png';
import gamePreview from './assets/home/Ronin_trailer.mp4';
import knowledgeBase from './assets/home/knowledgeBase.png';

// Mobile assets
import mobileHeroBg from './assets/home/mobileHeroBg.webp';
import knowledgeBaseMobile from './assets/home/knowledgeBaseMobile.webp';

const platformButtons = [
    { label: "Play on", platform: "STEAM", available: true, url: "https://store.steampowered.com/app/3910020/Calamity", icon: iconSteam },
    { label: "Play on", platform: "EPIC GAMES", available: true, url: "https://store.epicgames.com/en-US/p/calamity-ccalamity-beta-7dc49a", icon: iconEpic },
    { label: "Download on", platform: "APP STORE", available: true, url: "https://testflight.apple.com/join/seV17qSf", icon: iconApple },
    { label: "Get it on", platform: "GOOGLE PLAY", available: true, url: "https://play.google.com/store/apps/details?id=com.somethingiscooking.calamity", icon: iconGooglePlay },
];

const tradeCards = [
    {
        title: "Trade Rings",
        image: allRings,
        type: "rings",
        links: [
            { text: "Ronin", url: "https://marketplace.roninchain.com/collections/dragon-ring" },
            { text: "OpenSea", url: "https://opensea.io/collection/dragon-ring" },
        ],
    },
    {
        title: "Trade Cosmetics",
        image: tradeCosmetics,
        type: "cosmetics",
        links: [
            { text: "Ronin", url: "https://marketplace.roninchain.com/collections/calamity-cosmetics" },
            { text: "OpenSea", url: "https://opensea.io/collection/calamity-cosmetics" },
        ],
    },
    {
        title: "Trade Artifacts",
        image: allArts,
        type: "artifacts",
        links: [
            { text: "OpenSea", url: "https://opensea.io/collection/calamity-artifacts-official" },
        ],
    },
    {
        title: "Join Community",
        image: discordIllustration,
        type: "community",
        links: [
            { text: "Discord", url: "https://discord.gg/n3uBgxpTmE" },
        ],
    },
];

function Home() {
    const isMobile = useIsMobile();

    return (
        <div className="home-page">
            <div className="castle-bg-wrapper">
                <img src={castleBg} alt="" className="castle-background" loading="lazy" />
            </div>
            <section className="main-content">
                {!isMobile && (
                    <div className="video-section">
                        <video
                            src={gamePreview}
                            className="video-placeholder"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                )}

                <div className="game-preview-card">
                    {isMobile ? (
                        <img
                            src={mobileHeroBg}
                            alt="Game Preview"
                            className="preview-image preview-image-mobile"
                        />
                    ) : (
                        <img
                            src={gameCard}
                            alt="Game Preview"
                            className="preview-image preview-image-desktop"
                        />
                    )}
                    <div className="preview-overlay">
                        <div className="preview-text">
                            <h2 className="preview-title">Gather Loot. Trade. Compete.</h2>
                            <p className="preview-description">
                                A real-time indie MMO with PvE, PvP, and a player-driven economy
                            </p>
                        </div>
                        <div className="platform-buttons">
                            {platformButtons.map((platform, index) => (
                                <button
                                    key={index}
                                    className={`platform-btn ${!platform.available ? 'disabled' : ''}`}
                                    onClick={() => platform.available && window.open(platform.url, '_blank')}
                                    disabled={!platform.available}
                                >
                                    <div className="platform-text">
                                        <span className="platform-label">{platform.label}</span>
                                        <span className="platform-name">{platform.platform}</span>
                                    </div>
                                    <img src={platform.icon} alt={platform.platform} className="platform-icon-img" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="trade-grid">
                    {tradeCards.map((card, index) => (
                        <div key={index} className={`trade-card-new trade-card-${card.type}`}>
                            <h3 className="card-title">{card.title}</h3>
                            {card.image && (
                                <img src={card.image} alt={card.title} className="card-image" />
                            )}
                            <div className="card-links">
                                {card.links.map((link, linkIndex) => (
                                    <a
                                        key={linkIndex}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="card-link"
                                    >
                                        {link.text} →
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="knowledge-card">
                    {isMobile ? (
                        <img
                            src={knowledgeBaseMobile}
                            alt="Knowledge Base"
                            className="knowledge-image knowledge-image-mobile"
                            loading="lazy"
                        />
                    ) : (
                        <img
                            src={knowledgeBase}
                            alt="Knowledge Base"
                            className="knowledge-image knowledge-image-desktop"
                            loading="lazy"
                        />
                    )}
                    <div className="knowledge-content">
                        <h2 className="knowledge-title">Calamity Knowledge Base</h2>
                        <p className="knowledge-description">
                            Systems, items, and mechanics compiled in one place for players and adventurers.
                        </p>
                        <a
                            href="https://wiki.calamity.online/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="knowledge-link"
                        >
                            Calamity Wiki →
                        </a>
                    </div>
                </div>

            </section>
            <img src={wavesBottom} alt="" className="waves-bottom" />
        </div>
    );
}

export default Home;
