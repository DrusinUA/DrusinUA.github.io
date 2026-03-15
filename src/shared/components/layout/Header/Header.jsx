import React, { useState } from 'react';
import {ButtonConnectWalletHeader} from "@shared/components/web3/ConnectButton/ConnectButton.jsx";
import { PlayModal } from "@shared/components/ui/PlayModal/PlayModal.jsx";
import xIcon from '@assets/images/labels/x.svg';
import discordIcon from '@assets/images/labels/discord.svg';

function Header() {
    const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);

    return (
        <div className="logo-container">
            <div className="header-social-icons">
                <img
                    src={xIcon}
                    alt="X"
                    className="header-social-icon"
                    onClick={() => window.open('https://x.com/PlayCalamity', '_blank')}
                />
                <img
                    src={discordIcon}
                    alt="Discord"
                    className="header-social-icon"
                    onClick={() => window.open('https://discord.gg/n3uBgxpTmE', '_blank')}
                />
            </div>
            <button className="play-button" onClick={() => setIsPlayModalOpen(true)}>
                Play
            </button>
            <PlayModal isOpen={isPlayModalOpen} onClose={() => setIsPlayModalOpen(false)} />
            <ButtonConnectWalletHeader/>
            <div className="bottom-line"></div>
        </div>
    );
}

export default Header;
