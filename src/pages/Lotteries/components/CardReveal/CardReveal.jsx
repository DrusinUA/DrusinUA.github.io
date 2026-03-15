import React, { useState, useEffect, useRef } from 'react';
import styles from './CardReveal.module.scss';

export function CardReveal({ result, onComplete }) {
    const [phase, setPhase] = useState('appear'); // appear -> anticipate -> flip -> done
    const [particles, setParticles] = useState([]);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        // Phase sequence: appear (0.3s) -> anticipate (1.5s) -> flip (0.6s) -> done
        setTimeout(() => setPhase('anticipate'), 300);
        setTimeout(() => setPhase('flip'), 1800);
        setTimeout(() => {
            setPhase('done');
            // Spawn particles
            {
                const newParticles = Array.from({ length: 40 }, (_, i) => ({
                    id: i,
                    x: Math.random() * 360 - 180,
                    y: Math.random() * -300 - 50,
                    size: Math.random() * 6 + 3,
                    delay: Math.random() * 0.3,
                    duration: 0.8 + Math.random() * 0.6,
                    color: ['#e7c84f', '#f9fefd', '#844acb', '#9559d8', '#fdfd80'][Math.floor(Math.random() * 5)],
                }));
                setParticles(newParticles);
                setTimeout(() => setParticles([]), 1500);
            }
            setTimeout(() => onComplete(), 600);
        }, 2400);
    }, []);

    const isFlipped = phase === 'flip' || phase === 'done';

    return (
        <div className={styles.cardRevealContainer}>
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

            {/* Card */}
            <div className={`${styles.cardWrapper} ${phase === 'anticipate' ? styles.anticipate : ''}`}>
                <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
                    {/* Card Back */}
                    <div className={styles.cardBack}>
                        <div className={styles.cardBackInner}>
                            <div className={styles.cardBackPattern} />
                            <div className={styles.cardBackCrest}>&#9876;</div>
                        </div>
                    </div>

                    {/* Card Front */}
                    <div className={`${styles.cardFront} ${phase === 'done' ? styles.cardFrontWin : ''}`}>
                        <div className={styles.cardFrontIcon}>
                            <img src={result.icon} alt={result.name} />
                        </div>
                        <h3 className={styles.cardFrontTitle}>{result.name}</h3>
                        <p className={styles.cardFrontQty}>x{result.quantity}</p>
                        <p className={styles.cardFrontCongrats}>Congratulations!</p>
                    </div>
                </div>
            </div>

            {/* Glow aura during anticipation */}
            {phase === 'anticipate' && (
                <div className={styles.auraGlow} />
            )}
        </div>
    );
}
