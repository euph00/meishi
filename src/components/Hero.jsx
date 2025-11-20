import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import { getAnimationDelay } from '../utils/animation';

import { content } from '../data/content';

const Hero = () => {
    const { hero } = content;
    return (
        <section className={styles.section}>
            <div className={styles.heroLogoWrapper}>
                <motion.div
                    className={styles.imageContainer}
                    layoutId="shared-logo-wrapper"
                    transition={{ duration: 1.5, ease: [0.6, 0.01, -0.05, 0.9] }}
                >
                    <div className={styles.glow} style={{ animationDelay: getAnimationDelay() }}></div>
                    <img
                        src="/logo_text_or.svg"
                        alt={hero.logoAlt}
                        className={styles.image}
                    />
                </motion.div>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={`${styles.title} ${styles.glitch}`}
                data-text={hero.title.toUpperCase()}
            >
                {hero.title}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className={styles.subtitle}
            >
                {hero.subtitle}
                <br />
                <span className="text-white/60 text-lg mt-2 block">{hero.description}</span>
            </motion.p>
        </section>
    );
};

export default Hero;
