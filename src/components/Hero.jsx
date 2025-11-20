import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.section}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <MagneticButton>
                    <div className={styles.imageContainer}>
                        <div className={styles.glow}></div>
                        <img
                            src="/logo_text_or.svg"
                            alt="Logo"
                            className={styles.image}
                        />
                    </div>
                </MagneticButton>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={`${styles.title} ${styles.glitch}`}
                data-text="LINCH"
            >
                Linch
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className={styles.subtitle}
            >
                FULL STACK DEVELOPER & UI/UX ENTHUSIAST
                <br />
                <span className="text-white/60 text-lg mt-2 block">Crafting digital experiences that defy gravity.</span>
            </motion.p>
        </section>
    );
};

export default Hero;
