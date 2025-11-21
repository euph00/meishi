import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Cursor.module.css';

const Cursor = () => {
    const [clicks, setClicks] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const newClick = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
            };
            setClicks((prev) => [...prev, newClick]);

            // Cleanup after animation
            setTimeout(() => {
                setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
            }, 1000);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <AnimatePresence>
            {clicks.map((click) => (
                <Splash key={click.id} x={click.x} y={click.y} />
            ))}
        </AnimatePresence>
    );
};

const Splash = ({ x, y }) => {
    // Generate 12 particles for a more organic splash
    const particles = Array.from({ length: 12 }).map((_, i) => {
        const angle = Math.random() * 360; // Random angle
        const distance = 40 + Math.random() * 60; // Random distance between 40 and 100
        const scale = 0.5 + Math.random() * 0.5; // Random size variation
        return {
            id: i,
            angle,
            distance,
            scale,
        };
    });

    return (
        <>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={styles.particle}
                    initial={{ x: x, y: y, scale: 0, opacity: 1 }}
                    animate={{
                        x: x + Math.cos((p.angle * Math.PI) / 180) * p.distance,
                        y: y + Math.sin((p.angle * Math.PI) / 180) * p.distance,
                        scale: p.scale, // Animate to random scale then fade
                        opacity: 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            ))}
        </>
    );
};

export default Cursor;
