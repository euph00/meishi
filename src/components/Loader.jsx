import { motion } from 'framer-motion';
import styles from './Loader.module.css';
import { getAnimationDelay } from '../utils/animation';

const Loader = ({ onLoadingComplete, pathname }) => {
    const isHome = pathname === '/';

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // exit prop removed to prevent container fade out
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => {
                // We don't trigger onLoadingComplete here anymore because we want the exit animation to finish first
                // Actually, AnimatePresence handles the exit. 
                // The issue is we want the background to fade but the logo to stay for the transition.
            }}
        >
            {/* Background overlay that fades out */}
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            <motion.div
                className={styles.logoContainer}
                layoutId={isHome ? "shared-logo-wrapper" : undefined}
                transition={{ duration: 1.5, ease: [0.6, 0.01, -0.05, 0.9] }}
                exit={!isHome ? { opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.5 } } : undefined}
            >
                <div className={styles.glow} style={{ animationDelay: getAnimationDelay() }}></div>
                <motion.img
                    src="/logo_text_or.svg"
                    alt="Logo"
                    className={styles.image}
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </motion.div>
        </motion.div>
    );
};

export default Loader;
