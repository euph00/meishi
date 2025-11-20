import { motion } from 'framer-motion';
import styles from './Background.module.css';
const Background = () => {
    return (
        <div className={styles.container}>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className={styles.orb1}
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={styles.orb2}
            />
            <div className={styles.noise}></div>
        </div>
    );
};
export default Background;
