import { motion } from 'framer-motion';
import styles from './About.module.css';

const About = () => {
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
                    <h2 className={styles.heading}>About Me</h2>
                    <p className={styles.text}>
                        I'm a passionate developer who loves to build <span className={styles.highlight}>immersive digital experiences</span>.
                        My journey started with a curiosity for how things work on the web, and it has evolved into a career of crafting
                        high-performance applications.
                    </p>
                    <p className={styles.text}>
                        When I'm not coding, you can find me exploring new technologies, contributing to open source, or gaming.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className={styles.card}
                >
                    <h2 className={styles.heading}>Skills</h2>
                    <p className={styles.text}>
                        I specialize in the modern JavaScript stack, with a focus on <span className={styles.highlight}>React, Node.js, and Three.js</span>.
                        I believe in writing clean, maintainable code and designing interfaces that are intuitive and accessible.
                    </p>
                    <ul className={styles.skillsGrid}>
                        {['React / Next.js', 'TypeScript', 'Three.js / R3F', 'Node.js', 'Tailwind / CSS', 'PostgreSQL'].map((skill) => (
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
