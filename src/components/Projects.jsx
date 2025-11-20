import { motion } from 'framer-motion';
import styles from './Projects.module.css';

const projects = [
    { title: "Nebula Dashboard", category: "Web App", link: "#" },
    { title: "Quantum E-Commerce", category: "E-Commerce", link: "#" },
    { title: "Stellar Portfolio", category: "Design", link: "#" },
    { title: "Void Chat", category: "Mobile App", link: "#" },
];

const Projects = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={styles.heading}
                >
                    Selected Work
                </motion.h2>
                <div className={styles.projectList}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={styles.projectItem}
                        >
                            <div className={styles.projectInfo}>
                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                <span className={styles.projectCategory}>{project.category}</span>
                            </div>
                            <div className={styles.projectLink}>View Case Study →</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
