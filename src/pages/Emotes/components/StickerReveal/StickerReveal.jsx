import React, { useState, useEffect, useRef } from 'react';
import styles from './StickerReveal.module.scss';
import { StickerArt, PackArt } from '../../EmotesPage.jsx';

const CHANNEL_MS = 2500;
const OPEN_MS = 700;
const AUTO_ADVANCE_MS = 1800; // wait after last reveal before going to summary

export function StickerReveal({ stickers, onComplete, packImage }) {
    const [phase, setPhase] = useState('channeling'); // channeling -> open -> reveal
    const [sparkles, setSparkles] = useState([]);
    const [flipped, setFlipped] = useState(() => stickers.map(() => false));
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
        setTimeout(() => setPhase('reveal'), CHANNEL_MS + OPEN_MS);
    }, []);

    const handleFlip = (idx) => {
        if (flipped[idx]) return;

        setFlipped((prev) => {
            const next = [...prev];
            next[idx] = true;
            return next;
        });
    };

    // When all three are flipped, advance after a short beat.
    const allRevealed = flipped.every(Boolean);
    useEffect(() => {
        if (phase !== 'reveal' || !allRevealed) return;
        const t = setTimeout(() => onComplete(), AUTO_ADVANCE_MS);
        return () => clearTimeout(t);
    }, [allRevealed, phase, onComplete]);

    const isChanneling = phase === 'channeling';
    const isReveal = phase === 'reveal';
    const flippedCount = flipped.filter(Boolean).length;

    return (
        <div className={styles.revealContainer}>
            <div className={styles.stageFloor} aria-hidden="true" />

            {/* Pack stage only exists during channeling + open phases so the
                reveal phase doesn't have a 220x220 dead zone above the cards. */}
            {!isReveal && (
                <div className={styles.packStage}>
                    {isChanneling && (
                        <div className={styles.runicCircleWrap} aria-hidden="true">
                            <RunicCircle />
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
                            return (
                                <button
                                    type="button"
                                    key={`${sticker.id}-${idx}`}
                                    className={`${styles.cardSlot} ${
                                        isFlipped ? styles.cardSlotFlipped : styles.cardSlotIdle
                                    }`}
                                    style={{ '--enter-delay': `${idx * 700}ms` }}
                                    onClick={() => handleFlip(idx)}
                                    disabled={isFlipped}
                                    aria-label={isFlipped ? sticker.name : `Reveal rune ${idx + 1}`}
                                >
                                    <div className={styles.cardInner}>
                                        {/* Card back (visible when not flipped) */}
                                        <div className={styles.cardFace}>
                                            <CardBack />
                                        </div>
                                        {/* Card front (revealed sticker) */}
                                        <div className={`${styles.cardFace} ${styles.cardFaceFront}`}>
                                            <StickerArt sticker={sticker} />
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

// Layered runic summoning circle — three concentric layers, two rotating
// in opposite directions, plus a static hexagram core. Replaces the
// simple double-dashed-circle of the previous build.
function RunicCircle() {
    const outerTicks = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    const glyphAngles = [0, 60, 120, 180, 240, 300];

    return (
        <svg
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.runicCircle}
            aria-hidden="true"
        >
            {/* OUTER LAYER — rotates slowly clockwise */}
            <g className={styles.runicLayerOuter}>
                {/* Outer ring */}
                <circle
                    cx="150"
                    cy="150"
                    r="140"
                    fill="none"
                    stroke="rgba(231, 200, 79, 0.55)"
                    strokeWidth="1"
                    strokeDasharray="6 4"
                />
                {/* Slim secondary outer ring (gives the band a double-line feel) */}
                <circle
                    cx="150"
                    cy="150"
                    r="134"
                    fill="none"
                    stroke="rgba(231, 200, 79, 0.22)"
                    strokeWidth="0.6"
                />
                {/* 12 cardinal tick marks reaching inward from the ring */}
                {outerTicks.map((angle) => (
                    <line
                        key={angle}
                        x1="150"
                        y1="10"
                        x2="150"
                        y2="22"
                        stroke="rgba(231, 200, 79, 0.55)"
                        strokeWidth="1.2"
                        transform={`rotate(${angle} 150 150)`}
                    />
                ))}
            </g>

            {/* INNER LAYER — rotates counter-clockwise */}
            <g className={styles.runicLayerInner}>
                {/* Inner ring */}
                <circle
                    cx="150"
                    cy="150"
                    r="105"
                    fill="none"
                    stroke="rgba(176, 143, 216, 0.5)"
                    strokeWidth="0.9"
                    strokeDasharray="2 5"
                />
                {/* 6 runic glyph markers between rings — small geometric runes */}
                {glyphAngles.map((angle) => (
                    <g key={angle} transform={`rotate(${angle} 150 150)`}>
                        {/* "T" rune: cross bar + stem */}
                        <rect
                            x="144"
                            y="36"
                            width="12"
                            height="2.2"
                            fill="rgba(231, 200, 79, 0.7)"
                        />
                        <rect
                            x="148.5"
                            y="38"
                            width="3"
                            height="9"
                            fill="rgba(231, 200, 79, 0.55)"
                        />
                        {/* Tiny anchoring dot at the inner end */}
                        <circle
                            cx="150"
                            cy="52"
                            r="1.2"
                            fill="rgba(231, 200, 79, 0.6)"
                        />
                    </g>
                ))}
            </g>

            {/* CORE — static, the anchor of the sigil */}
            <g className={styles.runicLayerCore}>
                {/* Hexagram: two overlapping triangles */}
                <polygon
                    points="150,76 218,196 82,196"
                    fill="none"
                    stroke="rgba(231, 200, 79, 0.42)"
                    strokeWidth="1.2"
                />
                <polygon
                    points="150,224 82,104 218,104"
                    fill="none"
                    stroke="rgba(231, 200, 79, 0.42)"
                    strokeWidth="1.2"
                />
                {/* Hexagonal anchor at each star vertex */}
                {[
                    [150, 76], [218, 196], [82, 196],
                    [150, 224], [82, 104], [218, 104],
                ].map(([cx, cy], i) => (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="2.4"
                        fill="rgba(231, 200, 79, 0.55)"
                    />
                ))}
                {/* Central circle */}
                <circle
                    cx="150"
                    cy="150"
                    r="48"
                    fill="none"
                    stroke="rgba(231, 200, 79, 0.28)"
                    strokeWidth="0.8"
                    strokeDasharray="1.5 3"
                />
                {/* Innermost dot */}
                <circle
                    cx="150"
                    cy="150"
                    r="2.4"
                    fill="rgba(231, 200, 79, 0.55)"
                />
            </g>
        </svg>
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
