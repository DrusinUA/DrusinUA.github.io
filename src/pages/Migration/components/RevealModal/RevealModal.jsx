import React, { useState } from 'react';
import bgImage from "@assets/images/Background1.png";

import Arcane from '../../assets/rings/Arcane.gif';
import Frost from "../../assets/rings/Frost.gif";
import Imperial from "../../assets/rings/Imperial.gif";
import Inferno from "../../assets/rings/Inferno.gif";
import Necro from "../../assets/rings/Necro.gif";
import Succubus from "../../assets/rings/Succubus.gif";
import Tidal from "../../assets/rings/Tidal.gif";
import Zephyr from "../../assets/rings/Zephyr.gif";


function GlowImage({src, alt}) {
    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: 16,
            }}
        >
            <img
                src={src}
                alt={alt}
                style={{
                    display: 'block',
                    borderRadius: 12,
                    position: 'relative',
                    zIndex: 1,
                    width: 400,
                    height: 530
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
    )
}

export const RevealModal = ({isOpen, onClose, data}) => {
    const [index, setIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);

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

    function getImage(attributes) {
        let image;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].trait_type === "Type") {
                switch (attributes[i].value) {
                    case "Arcane":
                        image = Arcane;
                        break;
                    case "Frost":
                        image = Frost;
                        break;
                    case "Imperial":
                        image = Imperial;
                        break;
                    case "Inferno":
                        image = Inferno;
                        break;
                    case "Necro":
                        image = Necro;
                        break;
                    case "Succubus":
                        image = Succubus;
                        break;
                    case "Tidal":
                        image = Tidal;
                        break;
                    case "Zephyr":
                        image = Zephyr;
                        break;
                }
            }
        }
        return image;
    }

    function getName(attributes) {
        let value;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].trait_type === "Type") {
                 value = attributes[i].value;
            }
        }
        return value;
    }

    function close(){
        setIndex(0);
        setIsRevealed(false);
        onClose();
    }

    return (
        <div style={overlayStyle}>
            <div style={{position: 'relative', display: 'inline-block'}}>
                <GlowImage src={bgImage} alt="Background"/>

                <h1 className="card-title"
                    style={{
                        position: 'absolute',
                        textAlign: 'center',
                        top: 40,
                        left: 90,
                        zIndex: 2,
                    }}
                >Awakened Ring</h1>

                <div className="dragon-ring-container"
                     style={{
                         position: 'absolute',
                         textAlign: 'center',
                         top: 120,
                         left: 80,
                         zIndex: 2,
                     }}>
                    <>
                        <div
                            style={{
                                position: 'relative',
                                width: 240,
                                height: 240,
                                padding: 8,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(270deg, #ff00cc, #3333ff, #00ffcc)',
                                    backgroundSize: '600% 600%',
                                    animation: 'gradientAnimation 12s ease infinite',
                                    filter: 'blur(16px)',
                                    opacity: 0.7,
                                    zIndex: 0,
                                }}
                            />

                            <img
                                key={index}
                                src={getImage(data[index].attributes)}
                                alt="Ring"
                                style={{
                                    zIndex: 1,
                                    width: 224,
                                    height: 224,
                                    borderRadius: '4px',
                                }}
                                className="dragon-ring-image fade-in"
                            />
                        </div>
                    </>
                </div>

                <h2 className="card-title"
                    style={{
                        fontSize: "24px",
                        position: 'absolute',
                        textAlign: 'center',
                        top: 370,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 2,
                    }}
                >
                    {getName(data[index].attributes)}
                </h2>

                {index < data.length - 1 && <button className="next-button" style={{
                    position: 'absolute',
                    zIndex: 2,
                    top: 440,
                    left: 55,
                }} onClick={() => {
                    setIndex(index + 1);
                }}>
                    <span className="button-text">Next</span>
                </button>}

                {index === data.length - 1 && <button className="close-button" style={{
                    position: 'absolute',
                    zIndex: 2,
                    top: 440,
                    left: 55,
                }} onClick={close}>
                    <span className="button-text">Close</span>
                </button>}
            </div>
        </div>
    );
};
