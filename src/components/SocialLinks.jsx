import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react';
import styles from './SocialLinks.module.css';

const links = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
    { icon: Globe, href: 'https://example.com', label: 'Website' },
];

const SocialLinks = () => {
    return (
        <section style={{ padding: '5rem 0', textAlign: 'center' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem', color: '#fff' }}
            >
                Get in Touch
            </motion.h2>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                {links.map((link, index) => (
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
