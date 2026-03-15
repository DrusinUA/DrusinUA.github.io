import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SpinningWheel.module.scss';

const SEGMENT_COLORS = [
    ['#844acb', '#9559d8'], // primary / primary-glow
    ['#4a357a', '#5a4588'], // primary-800 / primary-600
];

const GOLD = '#e7c84f';

export function SpinningWheel({ prizes, result, onComplete }) {
    const canvasRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const hasStarted = useRef(false);
    const loadedImages = useRef({});

    const segmentAngle = (2 * Math.PI) / prizes.length;

    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - 4;

        ctx.clearRect(0, 0, size, size);

        // Draw segments
        prizes.forEach((prize, i) => {
            const startAngle = segmentAngle * i - Math.PI / 2;
            const endAngle = startAngle + segmentAngle;
            const [color1, color2] = SEGMENT_COLORS[i % 2];

            // Segment fill with radial gradient
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            grad.addColorStop(0, color2);
            grad.addColorStop(1, color1);

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Segment border line
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(
                cx + radius * Math.cos(startAngle),
                cy + radius * Math.sin(startAngle)
            );
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw icon centered in segment
            const midAngle = startAngle + segmentAngle / 2;
            const iconDist = radius * 0.6;
            const iconX = cx + iconDist * Math.cos(midAngle);
            const iconY = cy + iconDist * Math.sin(midAngle);

            const img = loadedImages.current[prize.id];
            if (img) {
                const iconSize = 40;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, iconX - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
            }
        });

        // Outer ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#613c94';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Gold tick marks around the edge
        const tickCount = prizes.length * 3;
        for (let i = 0; i < tickCount; i++) {
            const angle = (2 * Math.PI * i) / tickCount;
            const isMajor = i % 3 === 0;
            const innerR = isMajor ? radius - 10 : radius - 6;
            ctx.beginPath();
            ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
            ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
            ctx.strokeStyle = isMajor ? GOLD : 'rgba(231,200,79,0.4)';
            ctx.lineWidth = isMajor ? 2 : 1;
            ctx.stroke();
        }

        // Outer gold ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Center hub
        const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
        hubGrad.addColorStop(0, '#9559d8');
        hubGrad.addColorStop(0.7, '#844acb');
        hubGrad.addColorStop(1, '#4a357a');
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fillStyle = hubGrad;
        ctx.fill();
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Center decoration
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = GOLD;
        ctx.fill();
    }, [prizes, segmentAngle]);

    // Load prize icons
    useEffect(() => {
        let loadCount = 0;
        const totalToLoad = prizes.filter(p => p.icon).length;
        if (totalToLoad === 0) {
            drawWheel();
            return;
        }
        prizes.forEach(prize => {
            if (!prize.icon) return;
            const img = new Image();
            img.onload = () => {
                loadedImages.current[prize.id] = img;
                loadCount++;
                if (loadCount >= totalToLoad) drawWheel();
            };
            img.onerror = () => {
                loadCount++;
                if (loadCount >= totalToLoad) drawWheel();
            };
            img.src = prize.icon;
        });
    }, [prizes, drawWheel]);

    // Start spin
    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        const targetIdx = prizes.findIndex(p => p.id === result.id);
        const idx = targetIdx === -1 ? 0 : targetIdx;

        const segDeg = 360 / prizes.length;
        const segmentCenter = segDeg * idx + segDeg / 2;
        const fullSpins = 360 * (5 + Math.floor(Math.random() * 3));
        const targetRotation = fullSpins + (360 - segmentCenter);

        setIsSpinning(true);
        setTimeout(() => setRotation(targetRotation), 50);

        setTimeout(() => {
            setIsSpinning(false);
            setShowResult(true);
            setTimeout(() => onComplete(), 600);
        }, 4200);
    }, []);

    return (
        <div className={styles.wheelContainer}>
            {/* Pointer */}
            <div className={styles.pointer}>
                <svg width="32" height="28" viewBox="0 0 32 28">
                    <defs>
                        <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f5d96b" />
                            <stop offset="100%" stopColor="#c9a020" />
                        </linearGradient>
                        <filter id="pointerShadow">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
                        </filter>
                    </defs>
                    <polygon
                        points="16,28 2,2 30,2"
                        fill="url(#pointerGrad)"
                        stroke="#8B6914"
                        strokeWidth="1.5"
                        filter="url(#pointerShadow)"
                    />
                </svg>
            </div>

            {/* Wheel */}
            <div
                className={styles.wheelFrame}
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                        ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                        : 'none',
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className={styles.canvas}
                />
            </div>

            {/* Result */}
            {showResult && (
                <div className={styles.resultDisplay}>
                    <div className={styles.resultIcon}>
                        <img src={result.icon} alt={result.name} />
                    </div>
                    <h3 className={styles.resultTitle}>Congratulations!</h3>
                    <p className={styles.resultPrize}>{result.name}</p>
                </div>
            )}
        </div>
    );
}
