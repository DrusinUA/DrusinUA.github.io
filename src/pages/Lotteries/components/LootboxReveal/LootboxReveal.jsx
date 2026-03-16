import React, { useState, useEffect, useRef } from 'react';
import styles from './LootboxReveal.module.scss';
import lootboxImg from '../../../PreSale/assets/presale/lootbox.png';

export function LootboxReveal({ result, onComplete, image, completeDelayMs = 800 }) {
    const [phase, setPhase] = useState('channeling'); // channeling -> open -> reveal
    const [particles, setParticles] = useState([]);
    const [sparkles, setSparkles] = useState([]);
    const hasStarted = useRef(false);

    // Generate floating sparkles for the channeling phase
    useEffect(() => {
        if (phase !== 'channeling') {
            setSparkles([]);
            return;
        }
        const makeSparkles = () =>
            Array.from({ length: 16 }, (_, i) => ({
                id: i,
                startAngle: (360 / 16) * i + Math.random() * 20,
                radius: 55 + Math.random() * 35,
                size: 2 + Math.random() * 3,
                duration: 1.8 + Math.random() * 1.2,
                delay: Math.random() * 1.5,
                color: ['#844acb', '#9559d8', '#b47ee8', '#e7c84f', '#6b4f9e'][Math.floor(Math.random() * 5)],
            }));
        setSparkles(makeSparkles());
    }, [phase]);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        // channeling (2.2s) -> open (0.6s) -> reveal
        setTimeout(() => setPhase('open'), 2200);
        setTimeout(() => {
            setPhase('reveal');

            // Particles burst
            const colors = result
                ? ['#e7c84f', '#f9fefd', '#844acb', '#9559d8', '#fdfd80']
                : ['#5a4588', '#4a357a', '#3f2e66'];

            const count = result ? 30 : 12;
            const newParticles = Array.from({ length: count }, (_, i) => {
                const angleRad = ((360 / count) * i + Math.random() * 20) * (Math.PI / 180);
                const dist = 60 + Math.random() * 100;
                return {
                    id: i,
                    x: Math.cos(angleRad) * dist,
                    y: Math.sin(angleRad) * dist,
                    size: Math.random() * 5 + 2,
                    delay: Math.random() * 0.2,
                    duration: 0.6 + Math.random() * 0.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                };
            });
            setParticles(newParticles);
            setTimeout(() => setParticles([]), 1200);

            setTimeout(() => onComplete(), completeDelayMs);
        }, 2800);
    }, []);

    const isChanneling = phase === 'channeling';
    const isOpen = phase === 'open' || phase === 'reveal';

    return (
        <div className={styles.lootboxContainer}>
            {/* Swirling magic rings behind the orb */}
            {isChanneling && (
                <div className={styles.magicRings}>
                    <div className={`${styles.ring} ${styles.ring1}`} />
                    <div className={`${styles.ring} ${styles.ring2}`} />
                    <div className={`${styles.ring} ${styles.ring3}`} />
                </div>
            )}

            {/* Floating sparkles during channeling */}
            {sparkles.map(s => (
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

            {/* Glow behind orb */}
            <div className={`${styles.glow} ${isChanneling ? styles.glowPulse : ''} ${isOpen ? styles.glowBurst : ''}`} />

            {/* Orb image */}
            <div className={`${styles.lootbox} ${isChanneling ? styles.channeling : ''} ${isOpen ? styles.opened : ''}`}>
                <img src={image || lootboxImg} alt="Magic Orb" className={styles.lootboxImg} />
            </div>

            {/* Burst particles */}
            {particles.map(p => (
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

            {/* Result */}
            {phase === 'reveal' && (
                <div className={styles.resultArea}>
                    {result ? (
                        <div className={styles.winResult}>
                            <div className={styles.prizeIcon}>
                                <img src={result.icon} alt={result.name} />
                            </div>
                            <h3 className={styles.winTitle}>You Won!</h3>
                            <p className={styles.prizeName}>{result.name}</p>
                        </div>
                    ) : (
                        <div className={styles.loseResult}>
                            <svg className={styles.emptyOrb} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Outer glow */}
                                <defs>
                                    <radialGradient id="orbGlow" cx="50%" cy="45%" r="50%">
                                        <stop offset="0%" stopColor="#5a4588" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#2e2551" stopOpacity="0" />
                                    </radialGradient>
                                    <radialGradient id="orbBody" cx="40%" cy="35%" r="55%">
                                        <stop offset="0%" stopColor="#6b4f9e" />
                                        <stop offset="50%" stopColor="#4a357a" />
                                        <stop offset="100%" stopColor="#2e2551" />
                                    </radialGradient>
                                    <linearGradient id="crack" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#3f2e66" />
                                        <stop offset="100%" stopColor="#231E41" />
                                    </linearGradient>
                                </defs>
                                {/* Background glow */}
                                <circle cx="40" cy="40" r="38" fill="url(#orbGlow)" />
                                {/* Crystal orb body */}
                                <circle cx="40" cy="40" r="28" fill="url(#orbBody)" stroke="#5a4588" strokeWidth="1.5" />
                                {/* Highlight */}
                                <ellipse cx="33" cy="32" rx="8" ry="5" fill="rgba(132, 74, 203, 0.3)" transform="rotate(-20 33 32)" />
                                {/* Cracks */}
                                <path d="M34 28 L38 40 L32 44 L36 54" stroke="url(#crack)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
                                <path d="M38 40 L46 38 L50 44" stroke="url(#crack)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
                                <path d="M32 44 L26 50" stroke="url(#crack)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
                                {/* Dim sparkles */}
                                <circle cx="30" cy="30" r="1" fill="#6b4f9e" opacity="0.6">
                                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="50" cy="35" r="0.8" fill="#5a4588" opacity="0.4">
                                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="42" cy="52" r="0.7" fill="#5a4588" opacity="0.3">
                                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                                </circle>
                            </svg>
                            <p className={styles.loseTitle}>No Prize</p>
                            <p className={styles.loseText}>Better luck next draw!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
