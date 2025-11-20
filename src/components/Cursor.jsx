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
    // Generate 8 particles for the splash
    const particles = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        return {
            id: i,
            angle,
        };
    });

    return (
        <>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={styles.particle}
                    initial={{ x: x, y: y, scale: 1, opacity: 1 }}
                    animate={{
                        x: x + Math.cos((p.angle * Math.PI) / 180) * 100,
                        y: y + Math.sin((p.angle * Math.PI) / 180) * 100,
                        scale: 0,
                        opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            ))}
        </>
    );
};

export default Cursor;
