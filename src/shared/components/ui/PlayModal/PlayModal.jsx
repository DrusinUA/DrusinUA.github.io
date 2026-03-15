import React from 'react';
import iconSteam from '@pages/Home/assets/home/iconSteam.svg';
import iconEpic from '@pages/Home/assets/home/iconEpic.svg';
import iconApple from '@pages/Home/assets/home/iconApple.svg';
import iconGooglePlay from '@pages/Home/assets/home/iconGooglePlay.svg';

const platforms = [
    { label: "Play on", platform: "STEAM", url: "https://store.steampowered.com/app/3910020/Calamity", icon: iconSteam },
    { label: "Play on", platform: "EPIC GAMES", url: "https://store.epicgames.com/en-US/p/calamity-ccalamity-beta-7dc49a", icon: iconEpic },
    { label: "Download on", platform: "APP STORE", url: "https://testflight.apple.com/join/seV17qSf", icon: iconApple },
    { label: "Get it on", platform: "GOOGLE PLAY", url: "https://play.google.com/store/apps/details?id=com.somethingiscooking.calamity", icon: iconGooglePlay },
];

export const PlayModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="play-modal-container" onClick={e => e.stopPropagation()}>
                <h1 className="title">Choose Platform</h1>
                <p className="supporting-text">
                    Select your platform to download and play Calamity
                </p>
                <div className="play-modal-platforms">
                    {platforms.map((p, i) => (
                        <a
                            key={i}
                            className="play-modal-platform-btn"
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="play-modal-platform-text">
                                <span className="play-modal-platform-label">{p.label}</span>
                                <span className="play-modal-platform-name">{p.platform}</span>
                            </div>
                            <img src={p.icon} alt={p.platform} className="play-modal-platform-icon" />
                        </a>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>
                    <span className="button-label">Close</span>
                </button>
            </div>
        </div>
    );
};
