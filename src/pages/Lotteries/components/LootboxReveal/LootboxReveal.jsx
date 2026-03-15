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
                            <p className={styles.loseTitle}>Empty...</p>
                            <p className={styles.loseText}>The lootbox was empty this time. Better luck next draw!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
