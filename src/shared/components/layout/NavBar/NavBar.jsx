import React, { useState, useEffect } from 'react';
import {NavLink} from 'react-router-dom';
import Calamity from '@assets/images/Calamity.png';
import overview from '@assets/images/navbar/overview.png';
import shop from '@assets/images/navbar/shop.png';
import artifacts from '@assets/images/navbar/artifacts.png';
import link from '@assets/images/navbar/link.png';
import checker from "@assets/images/navbar/checker.png";
import cosmetics from '@assets/images/navbar/cosmetics.png';
import wiki from '@assets/images/navbar/wiki.png';
import armory from '@assets/images/navbar/armory.png';
import lottery from '@assets/images/navbar/lottery.png';
import privacy from '@assets/images/labels/privacy.svg';
import xIcon from '@assets/images/labels/x.svg';
import discordIcon from '@assets/images/labels/discord.svg';
import {ButtonConnectWalletMobile} from "@shared/components/web3/ConnectButton/ConnectButton.jsx";
import { PlayModal } from "@shared/components/ui/PlayModal/PlayModal.jsx";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile header bar */}
            <div className={`mobile-header ${isOpen ? 'menu-open' : ''}`}>
                <div className="mobile-logo" onClick={() => { window.location.href = '/'; closeMenu(); }}>
                    <img src={Calamity} alt="Calamity Logo" />
                </div>
                <ButtonConnectWalletMobile />
                <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile fullscreen menu */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <div className="mobile-menu-items">
                    <NavItem to="/" img={overview} onClick={closeMenu}>
                        Overview
                    </NavItem>

                    <NavItem to="/shop" img={shop} onClick={closeMenu}>
                        Buy Gold
                    </NavItem>

                    <NavItem to="/migrate" img={artifacts} onClick={closeMenu}>
                        Artifacts Migration
                    </NavItem>

                    <NavItem to="/link" img={link} onClick={closeMenu}>
                        Link Account
                    </NavItem>

                    <NavItem to="/cosmetics" img={cosmetics} onClick={closeMenu}>
                        Mint Cosmetics
                    </NavItem>

                    <NavItem to="/wallet-checker" img={checker} onClick={closeMenu}>
                        Wallet Checker
                    </NavItem>

                    <NavItem to="/lotteries" img={lottery} onClick={closeMenu}>
                        Lotteries
                    </NavItem>

                    <ExternalNavItem href="https://wiki.calamity.online/" img={wiki} onClick={closeMenu}>
                        Wiki
                    </ExternalNavItem>

                    <ExternalNavItem href="https://armory.calamity.online/" img={armory} onClick={closeMenu}>
                        Armory
                    </ExternalNavItem>

                </div>

                <PlayModal isOpen={isPlayModalOpen} onClose={() => setIsPlayModalOpen(false)} />

                <div className="mobile-menu-footer">
                    <button className="mobile-play-button" onClick={() => setIsPlayModalOpen(true)}>
                        Play
                    </button>
                    <div className="mobile-social-icons">
                        <img
                            src={discordIcon}
                            alt="Discord"
                            onClick={() => window.open('https://discord.gg/n3uBgxpTmE', '_blank')}
                        />
                        <img
                            src={xIcon}
                            alt="X"
                            onClick={() => window.open('https://x.com/PlayCalamity', '_blank')}
                        />
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <nav className="sidebar">
                <div className="logo" onClick={() => { window.location.href = '/'; }}>
                    <img src={Calamity} alt="Calamity Logo" />
                </div>

                <div className="menu-items">
                    <NavItem to="/" img={overview}>
                        Overview
                    </NavItem>

                    <NavItem to="/shop" img={shop}>
                        Buy Gold
                    </NavItem>

                    <NavItem to="/migrate" img={artifacts}>
                        Artifacts Migration
                    </NavItem>

                    <NavItem to="/link" img={link}>
                        Link Account
                    </NavItem>

                    <NavItem to="/cosmetics" img={cosmetics}>
                        Mint Cosmetics
                    </NavItem>

                    <NavItem to="/wallet-checker" img={checker}>
                        Wallet Checker
                    </NavItem>

                    <NavItem to="/lotteries" img={lottery}>
                        Lotteries
                    </NavItem>

                    <ExternalNavItem href="https://wiki.calamity.online/" img={wiki}>
                        Wiki
                    </ExternalNavItem>

                    <ExternalNavItem href="https://armory.calamity.online/" img={armory}>
                        Armory
                    </ExternalNavItem>

                </div>

                <div className="useful-links">
                    <h3>Useful links</h3>
                    <NavLink to="/privacy" className="link-item" style={{textDecoration: 'none'}}>
                        <img src={privacy} alt="Privacy Policy" width="24" height="24" />
                        <span>Privacy Policy</span>
                    </NavLink>
                </div>
            </nav>
        </>
    );
};

const NavItem = ({ to, img, children, onClick }) => (
    <NavLink
        to={to}
        end
        className={({isActive}) => `menu-item${isActive ? ' active' : ''}`}
        style={{textDecoration: 'none'}}
        onClick={onClick}
    >
        <img src={img} alt=""/>
        <span>{children}</span>
    </NavLink>
);

const ExternalNavItem = ({ href, img, children, onClick }) => (
    <a
        href={href}
        className="menu-item"
        style={{textDecoration: 'none', cursor: 'pointer'}}
        onClick={onClick}
    >
        <img src={img} alt=""/>
        <span>{children}</span>
    </a>
);

export default Navbar;

