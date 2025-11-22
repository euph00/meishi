import { motion } from 'framer-motion';
import styles from '../components/Hero.module.css'; // Reusing Hero styles for consistency

const SeeMessages = () => {
    return (
        <section className={styles.section} style={{ minHeight: '100vh', paddingTop: '10rem' }}>
            <div className={styles.heroLogoWrapper}>
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={styles.title}
                    style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
                >
                    SEE MESSAGES
                </motion.h1>
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={styles.description}
            >
                Coming Soon...
            </motion.p>
        </section>
    );
};

export default SeeMessages;
