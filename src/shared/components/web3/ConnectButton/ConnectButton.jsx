import React from "react";
import '@styles/connect-button.css'

export const ButtonConnectWalletHeader = () => {
    return (
        <button className="play-button" onClick={() => alert('Wallet connection disabled in preview')}>
            Connect Wallet
        </button>
    );
};

export const ButtonConnectWallet = ({ className }) => (
    <button className={`connect-btn ${className || ''}`} onClick={() => alert('Wallet connection disabled in preview')}>
        <span className="btn-text">Connect wallet</span>
    </button>
);

export const ButtonSwitchNetwork = ({ chainName, className }) => (
    <button className={`connect-btn ${className || ''}`} onClick={() => alert('Network switching disabled in preview')}>
        <span className="btn-text">Switch to {chainName}</span>
    </button>
);

export const ButtonConnectEmail = ({ onClick, className }) => (
    <button className={`connect-btn ${className || ''}`} onClick={onClick}>
        <span className="btn-text">Connect email</span>
    </button>
);

export const ButtonConnectWalletMobile = () => null;
