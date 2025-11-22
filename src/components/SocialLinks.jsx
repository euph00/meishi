import { motion, useAnimation } from 'framer-motion';
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
                    <SocialButton key={link.label} link={link} />
                ))}
            </motion.div>
        </div>
    );
};

const SocialButton = ({ link }) => {
    const controls = useAnimation();

    const handleClick = (e) => {
        e.preventDefault();

        // Supernova Effect - Glow bright white and scale up
        // We don't await this so the link opens immediately
        controls.start({
            scale: 1.2,
            filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 1)) brightness(3)",
            transition: { duration: 0.2, ease: "easeOut" }
        });

        // Open link immediately to avoid popup blockers
        window.open(link.href, '_blank');

        // Reset after a short delay
        setTimeout(() => {
            controls.start({
                scale: 1,
                filter: "none",
                transition: { duration: 0.5, ease: "easeOut" }
            });
        }, 300);
    };

    return (
        <motion.a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={controls}
            onClick={handleClick}
            aria-label={link.label}
        >
            <link.icon className={styles.icon} />
        </motion.a>
    );
};

export default SocialLinks;
