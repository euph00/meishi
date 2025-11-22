import { motion } from 'framer-motion';
import styles from './About.module.css';

import { content } from '../data/content';

const About = () => {
    const { about } = content;
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: false, amount: 0.3 }}
                    whileHover={{
                        y: -5,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className={styles.card}
                >
                    <h2 className={styles.heading}>{about.heading}</h2>
                    <p className={styles.text} dangerouslySetInnerHTML={{ __html: about.bio1.replace('藤田ことね', '<span class="' + styles.highlight + '">藤田ことね</span>') }}></p>
                    <p className={styles.text}>
                        {about.bio2}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: false, amount: 0.3 }}
                    whileHover={{
                        y: -5,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className={styles.card}
                >
                    <h2 className={styles.heading}>{about.skillsHeading}</h2>
                    <p className={styles.text} dangerouslySetInnerHTML={{ __html: about.skillsDescription.replace('React, Node.js, and Three.js', '<span class="' + styles.highlight + '">React, Node.js, and Three.js</span>') }}></p>
                    <ul className={styles.skillsGrid}>
                        {about.skills.map((skill) => (
                            <li key={skill} className={styles.skillItem}>
                                <span className={styles.skillDot}></span>
                                {skill}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
