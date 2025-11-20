import { motion } from 'framer-motion';
import styles from './SocialLinks.module.css';
import { content } from '../data/content';

const SocialLinks = () => {
    const { social } = content;
    return (
        <section style={{ padding: '5rem 0', textAlign: 'center' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem', color: '#fff' }}
            >
                {social.heading}
            </motion.h2>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
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
        </section>
    );
};

export default SocialLinks;
