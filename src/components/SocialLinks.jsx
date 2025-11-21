import { motion } from 'framer-motion';
import styles from './SocialLinks.module.css';
import { content } from '../data/content';

const SocialLinks = () => {
    const { social } = content;
    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
                {social.links.map((link, index) => (
                    <motion.a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={link.label}
                    >
                        <link.icon className={styles.icon} />
                    </motion.a>
                ))}
            </motion.div>
        </div>
    );
};

export default SocialLinks;
