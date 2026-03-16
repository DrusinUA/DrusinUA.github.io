import React, { useState, useEffect, useRef } from 'react';
import styles from './LootboxReveal.module.scss';
import lootboxImg from '../../../PreSale/assets/presale/lootbox.png';

export function LootboxReveal({ result, onComplete, image, completeDelayMs = 800 }) {
    const [phase, setPhase] = useState('idle'); // idle -> shake -> open -> reveal
    const [particles, setParticles] = useState([]);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        // idle (0.4s) -> shake (1.8s) -> open (0.6s) -> reveal
        setTimeout(() => setPhase('shake'), 400);
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

    return (
        <div className={styles.lootboxContainer}>
            {/* Glow behind lootbox */}
            <div className={`${styles.glow} ${phase === 'shake' ? styles.glowPulse : ''} ${phase === 'open' || phase === 'reveal' ? styles.glowBurst : ''}`} />

            {/* Lootbox */}
            <div className={`${styles.lootbox} ${phase === 'shake' ? styles.shaking : ''} ${phase === 'open' || phase === 'reveal' ? styles.opened : ''}`}>
                <img src={image || lootboxImg} alt="Lootbox" className={styles.lootboxImg} />
            </div>

            {/* Particles */}
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
