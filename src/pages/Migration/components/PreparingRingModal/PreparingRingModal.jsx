import React, { useState, useEffect } from 'react';
import bgImage from "@assets/images/bg.png";
import CraftRing from '@assets/images/CraftRing.gif';

// Hook to detect screen size
function useScreenSize() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width,
        isMobile: width < 768,
        isSmallMobile: width < 400,
    };
}

// Desktop version with absolute positioning
function DesktopModal() {
    return (
        <div className="crafting-block" style={{ position: 'relative', display: 'inline-block' }}>
            {/* Background with glow */}
            <div style={{ position: 'relative', display: 'inline-block', borderRadius: 16 }}>
                <img
                    src={bgImage}
                    alt="Background"
                    style={{
                        display: 'block',
                        borderRadius: 12,
                        position: 'relative',
                        zIndex: 1,
                        width: 550,
                        height: 440
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        right: -6,
                        bottom: -6,
                        borderRadius: 16,
                        background: 'linear-gradient(45deg, rgba(142, 68, 173, 0.6), rgba(75, 0, 130, 0.6))',
                        filter: 'blur(20px)',
                        zIndex: 0,
                    }}
                />
            </div>

            <img
                src={CraftRing}
                alt="Craft icon"
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 24,
                    width: 96,
                    height: 84,
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />
            <div className="crafting-title" style={{
                position: 'absolute',
                top: 115,
                left: 24,
                zIndex: 2,
                margin: 0,
                fontSize: 28,
            }}>We are crafting Your Ring
            </div>

            <p className="supporting-text" style={{
                position: 'absolute',
                top: 165,
                left: 24,
                right: 24,
                zIndex: 2,
                margin: 0,
                fontSize: 16,
                lineHeight: '28px',
            }}>
                Please wait a couple of minutes while we mint your Dragon Rings and send them to your Ronin Network wallet.
                <br/><br/>
                You can close this window now, or wait and check your new rings one by one.
            </p>
            <button className="connect-btn" style={{
                position: 'absolute',
                top: 360,
                left: 24,
                zIndex: 2,
                width: "220px",
            }} onClick={() => {
                window.open("https://opensea.io/collection/dragon-ring", '_blank');
            }}>
                <span className="btn-text">Opensea</span>
            </button>
        </div>
    );
}

// Mobile version with bg image as background
function MobileModal() {
    return (
        <div className="crafting-block" style={{
            position: 'relative',
            width: '90vw',
            maxWidth: 340,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(142, 68, 173, 0.4)',
        }}>
            {/* Background image */}
            <img
                src={bgImage}
                alt="Background"
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    borderRadius: 16,
                }}
            />

            {/* GIF overlay - positioned at blacksmith hands */}
            <img
                src={CraftRing}
                alt="Craft icon"
                style={{
                    position: 'absolute',
                    top: 12,
                    left: 16,
                    width: 70,
                    height: 61,
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            />

            {/* Content overlay */}
            <div style={{
                position: 'absolute',
                top: 80,
                left: 16,
                right: 16,
                bottom: 16,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 2,
            }}>
                <div className="crafting-title" style={{
                    margin: 0,
                    fontSize: 18,
                    marginBottom: 6,
                }}>We are crafting Your Ring
                </div>

                <p className="supporting-text" style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: '18px',
                }}>
                    Please wait while we mint your Dragon Rings and send them to your Ronin wallet.
                    <br/><br/>
                    You can close this window or wait to see your new rings.
                </p>

                <button className="connect-btn" style={{
                    width: "auto",
                    padding: "6px 20px",
                    minWidth: "auto",
                    height: 32,
                    alignSelf: 'flex-start',
                    marginTop: 'auto',
                }} onClick={() => {
                    window.open("https://opensea.io/collection/dragon-ring", '_blank');
                }}>
                    <span className="btn-text" style={{ fontSize: 12 }}>Opensea</span>
                </button>
            </div>
        </div>
    );
}

export const PreparingRingModal = ({ isOpen }) => {
    const { isMobile } = useScreenSize();

    if (!isOpen) return null;

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    return (
        <div style={overlayStyle}>
            {isMobile ? <MobileModal /> : <DesktopModal />}
        </div>
    );
};

