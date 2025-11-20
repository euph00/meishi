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
                    viewport={{ once: true }}
                    className={styles.card}
                >
                    <h2 className={styles.heading}>{about.heading}</h2>
                    <p className={styles.text} dangerouslySetInnerHTML={{ __html: about.bio1.replace('immersive digital experiences', '<span class="' + styles.highlight + '">immersive digital experiences</span>') }}></p>
                    <p className={styles.text}>
                        {about.bio2}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
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
