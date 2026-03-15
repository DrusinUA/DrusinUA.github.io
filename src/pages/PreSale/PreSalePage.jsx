import React, {useState} from "react";
import tierSfactory from './assets/presale/tierSfactory.webp';
import tokens from './assets/presale/tokens.png'
import supply from "./assets/presale/supply.png"
import powerhouse from "./assets/presale/powerhouse.png"
import Portal from "./assets/presale/Portal.gif";
import Wishmaster from "./assets/presale/Wishmaster.gif";
import PreSaleImg from "./assets/presale/pre-sale.png";
import lootbox from "./assets/presale/lootbox.png";
import menu from "./assets/presale/menu.png";
import dice from "./assets/presale/dice.png";
import seasonpass from "./assets/presale/seasonpass.png";
import chest from "./assets/presale/chest.png";
import styles from './PreSalePage.module.scss';
import {PreSaleModal} from "./components/PresaleModal/PresaleModal.jsx";

function PreSale() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <PreSaleModal isOpen={isModalOpen} onClose={closeModal}/>
            <div className="container-wrapper">
                <div className="container">

                    <div className={styles.psPageContainer}>
                        <div className={styles.psContentContainer}>
                            <div className={styles.psImageContainer}>
                                <img className={styles.psTierSfactoryImage} src={tierSfactory} alt="Tier 5 Factory"
                                     loading="lazy"
                                     decoding="async"
                                />
                                <div className={styles.psLabelBanner}>Tier 5 Factory</div>
                            </div>
                            <div className={styles.psTextContainer}>
                                <h1 className={styles.psTitle}>Build Wealth.<br/>Own the Game.</h1>
                                <div className={`description ${styles.psDescription}`}>
                                    <p>Factories are a limited collection of 9,999 NFTs</p>
                                    — your personal in-game space and gateway to earning $WYRM and unlocking exclusive
                                    game
                                    mechanics
                                </div>
                                <button className={styles.psBuyButton} disabled={true}>Sale Ended</button>
                            </div>
                        </div>
                        <div className={styles.psPageTextContainer}>
                            <h1 style={{
                                fontSize: "36px",
                            }}>Factory Game-Changing Utilities</h1>
                        </div>
                        <div className={styles.psContentGridContainer}>
                            <div className={styles.psCard}>
                                <div className={`${styles.psCard} ${styles.psTokenCard}`}>
                                    <img className={styles.psOrbOverlay} src={tokens} alt="orb-overlay"/>
                                    <div className={styles.psYellowBanner}>
                                        <p><strong>WYRM<br/>TGE</strong><br/>shortly<br/>after the<br/>Factories<br/>Public<br/>Sale
                                        </p>
                                    </div>
                                    <div className={styles.psCardContent}>
                                        <h1 className={styles.token}>The Gateway<br/>to the Token</h1>
                                        <div className={styles.psCardBody}>
                                            <h1>1650</h1>
                                            <p><strong>WYRM tokens</strong> airdropped <br/> per each Tier 1 Factory at
                                                TGE</p>
                                            <h1>~3850</h1>
                                            <p><strong>WYRM tokens</strong> can be earned from <br/> staking each
                                                Factory over 3
                                                months</p>
                                            <h1>Earn More</h1>
                                            <p>Merge Factories into higher tier to<br/> get more tokens from Staking</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.psCard}>
                                <div className={`${styles.psCard} ${styles.psPowerhouseCard}`}>
                                    <img className={styles.psOrbOverlay} src={powerhouse} alt="powerhouse"/>
                                    <div className={styles.psCardContent}>
                                        <h1 className={styles.psCardTitle}>In-Game<br/>Powerhouse</h1>
                                        <div className={styles.psCardBody}>
                                            {/* See CSS file for styling — kept at the end of the CSS file for convenience */}
                                            {/* Could be done via absolute positioning, but this was faster */}
                                            <div className={styles.psCardRow}>
                                                <div className={styles.psText}>
                                                    <h1>Expeditions 🔥</h1>
                                                    <p>Holders can send their characters on passive dungeon runs
                                                        completely
                                                        free.
                                                        Stake
                                                        extra Factories to earn a share of profits from public paid
                                                        Expeditions</p>
                                                </div>
                                                <img src={Portal} alt="portal" className={styles.portal} width={"160px"}
                                                     height={"160px"}
                                                     style={{
                                                         marginBottom: "10px",
                                                         // marginLeft: "10px"
                                                     }}/>
                                            </div>
                                            <div className={styles.psCardRow}>
                                                <div className={styles.psText}>
                                                    <h1>Automatas</h1>
                                                    <p>Hunt for Automatas during seasonal events and place them inside
                                                        your
                                                        Factory
                                                        to
                                                        generate valuable in-game resouces</p>
                                                </div>
                                                <img src={Wishmaster} alt="wishmaster" style={{
                                                    marginBottom: "16px",
                                                    marginLeft: "-13px",
                                                    // marginLeft: "10px"
                                                }} width={"220px"} height={"220px"}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.psCard}>
                                <div className={`${styles.psCard} ${styles.psSupplyCard}`}>
                                    <img className={styles.psOrbOverlay} src={supply} alt="supply-overlay" style={{
                                        right: "-30px"
                                    }}/>
                                    <div className={styles.psCardContent}>
                                        <h1 className={styles.psCardTitle}>Deflationary<br/>Supply</h1>
                                        <div className={styles.psCardBody}>
                                            <h1 style={{color: "white"}}>Merge to Upgrade</h1>
                                            <p style={{
                                                maxWidth: '448px',
                                            }}>Combine 3 lower-tier Factories into 1 higher-tier Factory to unlock
                                                greater
                                                staking power, expanded in-game space, and exclusive utilities</p>
                                            <h1 style={{
                                                background: "linear-gradient(to right, rgba(73, 245, 105, 1), rgba(162, 255, 42, 1))",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                fontWeight: "700"
                                            }}>174% Boost</h1>
                                            <p style={{
                                                maxWidth: '430px',
                                            }}>Each merge grants +15% staking power - reaching up to +74% at Tier 5 for
                                                maximum
                                                efficiency and rewards</p>
                                            <h1 style={{color: "white"}}>Built-in Scarity</h1>
                                            <p style={{
                                                maxWidth: '420px',
                                            }}>Every merge permanently reduces total supply, making Factories
                                                increasingly rare
                                                and valuable</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.psCard}>
                                <div className={`${styles.psCard} ${styles.psPreSaleCard}`}>
                                    <img className={styles.psOrbOverlay} src={PreSaleImg} alt="pre-salce-card"/>
                                    <div className={styles.psCardContent}>
                                        <h1 className={styles.psCardTitle}>Exclusive<br/>Early Bird Perks</h1>
                                        <div className={styles.psCardBody}>
                                            <h1>Discount</h1>
                                            <p>Get in at a lower price - $40 per Factory vs $45 during the Public
                                                Sale</p>
                                            <h1>Bulk Advantage</h1>
                                            <p>Buy in volume, merge faster, and unlock higher-tier rewards</p>
                                            <h1>Limited Cosmetic</h1>
                                            <p>Receive the unique "Factory Unit" cosmetic NFT when you purchase 27
                                                Factories</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.psPageTextContainer} style={{
                            marginTop: '44px',
                        }}>
                            <h1>WYRM</h1>
                            <p>The Token That Finally Matters</p>
                            <span>
                        <strong>WYRM goes live right after the Factories Public Sale</strong>, powering monetized seasonal content <br/> with real utility — blending deep on-chain economy with real-time Web2-style gameplay
                    </span>
                        </div>
                        <div className={styles.psInfoContainer}>
                            <div className={styles.psInfoRow}>
                                <div className={styles.psInfoCard}>
                                    <div className={styles.psInfoText}>Season Pass with<br/>P2E rewards</div>
                                    <img className={styles.psInfoImage} src={seasonpass} alt="Season Pass" width={"238px"}
                                         height={"238px"}/>
                                </div>
                                <div className={styles.psInfoCard}>
                                    <div className={styles.psInfoText} style={{marginLeft: "-10px"}}>Staking for Lootboxes
                                    </div>
                                    <img className={styles.psInfoImage} style={{marginLeft: "-10px"}} src={lootbox}
                                         alt="Lootboxes"/>
                                </div>
                            </div>
                            <div className={styles.psInfoRow}>
                                <div className={styles.psInfoCard}>
                                    <div className={styles.psInfoText} style={{marginLeft: "-10px"}}>Auction House trading
                                    </div>
                                    <img className={styles.psInfoImage} src={menu} alt="Auction House"/>
                                </div>
                                <div className={styles.psInfoCard} style={{
                                    maxWidth: "352px"
                                }}>
                                    <div className={styles.psInfoText}>Premium Shop</div>
                                    <img className={styles.psInfoImage} src={chest} alt="Gems" width={"290px"}
                                         height={"290px"}
                                         style={{
                                             marginLeft: "-200px"
                                         }}/>
                                </div>
                                <div className={styles.psInfoCard}>
                                    <div className={styles.psInfoText} style={{
                                        marginLeft: "-10px",
                                    }}>Risk minigames & wagering
                                    </div>
                                    <img className={styles.psInfoImage} src={dice} alt="Dice" style={{
                                        marginLeft: "-70px",
                                    }} width={"222px"}/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.psPageTextContainer} style={{
                            marginTop: '44px',
                            marginBottom: '24px',
                        }}>
                            <h1>Tokenomics</h1>
                        </div>
                        <div className={styles.psBottomContainer}>
                            <div className={styles.psBottomInfoRow}>
                                <h1 style={{
                                    marginBottom: '16px',
                                }}>Key Metrics</h1>
                                <p><strong>Max supply: </strong>1 000 000 000 WYRM</p>
                                <p><strong>Fully Diluted Valuation: </strong>$8 180 000</p>
                                <p><strong>Market Cap: </strong>$879 350 (10,975%)</p>
                                <p><strong>Market Cap (without Liquidity tokens): </strong>$470 350 (5,975%)</p>
                                <h1 style={{
                                    marginTop: '28px',
                                    marginBottom: '16px',
                                }}>Distribution</h1>
                                <p><strong>Private Sale: </strong> 11%</p>
                                <p><strong>Community: </strong> 70,5%</p>
                                <p style={{
                                    marginLeft: '20px',
                                }}><strong>Factories: </strong>5,5%</p>
                                <p style={{
                                    marginLeft: '20px',
                                }}><strong>Airdrops & Rewards: </strong>10%</p>
                                <p style={{
                                    marginLeft: '20px',
                                }}><strong>Future Game Rewards: </strong>55%</p>
                                <p><strong>Liquidity: </strong> 5%</p>
                                <p><strong>Team: </strong> 10%</p>
                                <p><strong>Advisors: </strong> 3,5%</p>
                            </div>
                            <div className={styles.psBottomInfoRow}>
                                <h1 style={{
                                    marginBottom: '16px',
                                }}>Unlock Schedule</h1>
                                <p><strong>Private Sale: </strong>10% day one, 6 month gradual unlock</p>
                                <p><strong>Community: </strong></p>
                                <p style={{
                                    marginLeft: '20px',
                                }}><strong>Factories: </strong>30% day one, 3 month gradual unlock</p>
                                <p style={{
                                    marginLeft: '20px',
                                }}><strong>Airdrops & Rewards: </strong>30% day one, 3 month grad. unlock</p>
                                <p style={{
                                    marginLeft: '20px',
                                }}><strong>Future Game Rewards: </strong>gradual unlock over 24 months</p>
                                <p><strong>Liquidity: </strong> 100% unlock</p>
                                <p><strong>Team: </strong> 12 months cliff, 12 months gradual unlock</p>
                                <p><strong>Advisors: </strong> 12 months cliff, 12 months gradual unlock</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default PreSale;