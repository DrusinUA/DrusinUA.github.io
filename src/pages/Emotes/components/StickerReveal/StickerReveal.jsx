import React, { useState, useEffect, useRef } from 'react';
import styles from './StickerReveal.module.scss';
import { StickerArt, PackArt } from '../../EmotesPage.jsx';

const CHANNEL_MS = 2500;
const OPEN_MS = 700;
const AUTO_ADVANCE_MS = 1800; // wait after last reveal before going to summary

export function StickerReveal({ stickers, onComplete, packImage }) {
    const [phase, setPhase] = useState('channeling'); // channeling -> open -> reveal
    const [sparkles, setSparkles] = useState([]);
    const [particles, setParticles] = useState([]);
    const [flipped, setFlipped] = useState(() => stickers.map(() => false));
    const [burstSlot, setBurstSlot] = useState(null); // index of slot currently bursting
    const hasStarted = useRef(false);

    // Orbiting motes during the channeling phase.
    useEffect(() => {
        if (phase !== 'channeling') {
            setSparkles([]);
            return;
        }
        setSparkles(
            Array.from({ length: 14 }, (_, i) => ({
                id: i,
                startAngle: (360 / 14) * i + Math.random() * 22,
                radius: 70 + Math.random() * 30,
                size: 1.6 + Math.random() * 2.4,
                duration: 2.2 + Math.random() * 1.4,
                delay: Math.random() * 1.6,
                color: ['#e7c84f', '#b08fd8', '#f5e9d0'][
                    Math.floor(Math.random() * 3)
                ],
            })),
        );
    }, [phase]);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        setTimeout(() => setPhase('open'), CHANNEL_MS);
        setTimeout(() => {
            setPhase('reveal');

            // One-shot pack burst.
            const colors = ['#e7c84f', '#b08fd8', '#f5e9d0', '#a52e3a'];
            const count = 28;
            setParticles(
                Array.from({ length: count }, (_, i) => {
                    const angleRad =
                        ((360 / count) * i + Math.random() * 18) * (Math.PI / 180);
                    const dist = 90 + Math.random() * 110;
                    return {
                        id: i,
                        x: Math.cos(angleRad) * dist,
                        y: Math.sin(angleRad) * dist,
                        size: Math.random() * 4 + 1.8,
                        delay: Math.random() * 0.2,
                        duration: 0.8 + Math.random() * 0.4,
                        color: colors[Math.floor(Math.random() * colors.length)],
                    };
                }),
            );
            setTimeout(() => setParticles([]), 1300);
        }, CHANNEL_MS + OPEN_MS);
    }, []);

    const handleFlip = (idx) => {
        if (flipped[idx]) return;

        setFlipped((prev) => {
            const next = [...prev];
            next[idx] = true;
            return next;
        });

        // Burst halo behind that slot.
        setBurstSlot(idx);
        setTimeout(() => setBurstSlot((cur) => (cur === idx ? null : cur)), 700);
    };

    // When all three are flipped, advance after a short beat.
    const allRevealed = flipped.every(Boolean);
    useEffect(() => {
        if (phase !== 'reveal' || !allRevealed) return;
        const t = setTimeout(() => onComplete(), AUTO_ADVANCE_MS);
        return () => clearTimeout(t);
    }, [allRevealed, phase, onComplete]);

    const isChanneling = phase === 'channeling';
    const isOpen = phase === 'open' || phase === 'reveal';
    const isReveal = phase === 'reveal';
    const flippedCount = flipped.filter(Boolean).length;

    return (
        <div className={styles.revealContainer}>
            <div className={styles.stageFloor} aria-hidden="true" />

            {/* Particles always emanate from the visual centre, even after
                packStage is unmounted in the reveal phase. */}
            <div className={styles.particleHost} aria-hidden="true">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className={styles.particle}
                        style={{
                            '--px': `${p.x}px`,
                            '--py': `${p.y}px`,
                            '--size': `${p.size}px`,
                            '--delay': `${p.delay}s`,
                            '--duration': `${p.duration}s`,
                            '--color': p.color,
                        }}
                    />
                ))}
            </div>

            {/* Pack stage only exists during channeling + open phases so the
                reveal phase doesn't have a 220x220 dead zone above the cards. */}
            {!isReveal && (
                <div className={styles.packStage}>
                    {isChanneling && (
                        <div className={styles.magicRings} aria-hidden="true">
                            <svg viewBox="0 0 220 220" className={styles.runicRingOuter}>
                                <circle
                                    cx="110"
                                    cy="110"
                                    r="100"
                                    fill="none"
                                    stroke="rgba(231, 200, 79, 0.5)"
                                    strokeWidth="1"
                                    strokeDasharray="3 6"
                                />
                            </svg>
                            <svg viewBox="0 0 180 180" className={styles.runicRingInner}>
                                <circle
                                    cx="90"
                                    cy="90"
                                    r="80"
                                    fill="none"
                                    stroke="rgba(176, 143, 216, 0.4)"
                                    strokeWidth="1"
                                    strokeDasharray="2 4"
                                />
                            </svg>
                        </div>
                    )}

                    {sparkles.map((s) => (
                        <div
                            key={s.id}
                            className={styles.sparkle}
                            style={{
                                '--angle': `${s.startAngle}deg`,
                                '--radius': `${s.radius}px`,
                                '--size': `${s.size}px`,
                                '--duration': `${s.duration}s`,
                                '--delay': `${s.delay}s`,
                                '--color': s.color,
                            }}
                        />
                    ))}

                    {phase === 'channeling' && (
                        <>
                            <div className={styles.packShadow} aria-hidden="true" />
                            <div className={`${styles.pack} ${styles.packLevitate}`}>
                                {packImage ? (
                                    <img src={packImage} alt="Emote Pack" className={styles.packImg} />
                                ) : (
                                    <PackArt />
                                )}
                            </div>
                        </>
                    )}
                    {phase === 'open' && (
                        <>
                            <div className={`${styles.packHalf} ${styles.packHalfLeft}`}>
                                {packImage ? (
                                    <img src={packImage} alt="" className={styles.packImg} />
                                ) : (
                                    <PackArt />
                                )}
                            </div>
                            <div className={`${styles.packHalf} ${styles.packHalfRight}`}>
                                {packImage ? (
                                    <img src={packImage} alt="" className={styles.packImg} />
                                ) : (
                                    <PackArt />
                                )}
                            </div>
                            <div className={styles.crackSliver} aria-hidden="true" />
                        </>
                    )}
                </div>
            )}

            {/* Interactive reveal: 3 face-down cards, click each to flip */}
            {isReveal && (
                <>
                    <div className={styles.revealHint}>
                        {allRevealed
                            ? 'All three runes unveiled.'
                            : flippedCount === 0
                                ? 'Tap each rune to reveal it.'
                                : `${3 - flippedCount} ${3 - flippedCount === 1 ? 'rune' : 'runes'} remaining.`}
                    </div>
                    <div className={styles.cardRow}>
                        {stickers.map((sticker, idx) => {
                            const isFlipped = flipped[idx];
                            const isBursting = burstSlot === idx;
                            return (
                                <button
                                    type="button"
                                    key={`${sticker.id}-${idx}`}
                                    className={`${styles.cardSlot} ${
                                        isFlipped ? styles.cardSlotFlipped : styles.cardSlotIdle
                                    }`}
                                    style={{ '--enter-delay': `${idx * 220}ms` }}
                                    onClick={() => handleFlip(idx)}
                                    disabled={isFlipped}
                                    aria-label={isFlipped ? sticker.name : `Reveal rune ${idx + 1}`}
                                >
                                    {/* Animated gradient glow that appears behind the card once revealed */}
                                    <div className={styles.cardGlow} aria-hidden="true" />

                                    {isBursting && (
                                        <div className={styles.cardBurst} aria-hidden="true" />
                                    )}

                                    <div className={styles.cardInner}>
                                        {/* Card back (visible when not flipped) */}
                                        <div className={styles.cardFace}>
                                            <CardBack />
                                        </div>
                                        {/* Card front (revealed sticker) */}
                                        <div className={`${styles.cardFace} ${styles.cardFaceFront}`}>
                                            <StickerArt sticker={sticker} size={104} />
                                            <span className={styles.cardLabel}>{sticker.name}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// Face-down card back: dark purple panel with a Calamity sigil and a
// pulsing hint ring telling the user it's interactive.
function CardBack() {
    return (
        <svg
            viewBox="0 0 96 132"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.cardBackSvg}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="cb-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a3c92" />
                    <stop offset="100%" stopColor="#2e2050" />
                </linearGradient>
                <linearGradient id="cb-rim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e7c84f" />
                    <stop offset="100%" stopColor="#a37e1a" />
                </linearGradient>
            </defs>
            {/* Card body */}
            <rect x="3" y="3" width="90" height="126" rx="6" fill="url(#cb-body)" />
            {/* Gold trim */}
            <rect
                x="3"
                y="3"
                width="90"
                height="126"
                rx="6"
                fill="none"
                stroke="url(#cb-rim)"
                strokeWidth="1.2"
                opacity="0.85"
            />
            {/* Inner panel */}
            <rect
                x="9"
                y="10"
                width="78"
                height="112"
                rx="3"
                fill="none"
                stroke="rgba(231, 200, 79, 0.35)"
                strokeWidth="0.6"
            />
            {/* Corner runic ticks */}
            <g fill="rgba(231, 200, 79, 0.55)">
                <rect x="14" y="15" width="2" height="6" rx="0.4" />
                <rect x="80" y="15" width="2" height="6" rx="0.4" />
                <rect x="14" y="111" width="2" height="6" rx="0.4" />
                <rect x="80" y="111" width="2" height="6" rx="0.4" />
            </g>
            {/* Centered sigil — stylized "C" with a star above */}
            <g transform="translate(48 66)">
                <circle r="22" fill="rgba(40, 28, 64, 0.7)" stroke="rgba(231, 200, 79, 0.35)" strokeWidth="0.6" />
                <path
                    d="M8 -6 A 14 14 0 1 0 8 6"
                    fill="none"
                    stroke="rgba(231, 200, 79, 0.85)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                />
                <path
                    d="M0 -16 L2 -10 L8 -10 L3 -7 L5 -1 L0 -4 L-5 -1 L-3 -7 L-8 -10 L-2 -10 Z"
                    fill="rgba(231, 200, 79, 0.6)"
                />
            </g>
            {/* Subtle scrollwork at top and bottom */}
            <path
                d="M16 28 L24 24 L48 26 L72 24 L80 28"
                fill="none"
                stroke="rgba(231, 200, 79, 0.25)"
                strokeWidth="0.8"
            />
            <path
                d="M16 104 L24 108 L48 106 L72 108 L80 104"
                fill="none"
                stroke="rgba(231, 200, 79, 0.25)"
                strokeWidth="0.8"
            />
        </svg>
    );
}
