import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Projects.module.css';

const projects = [
    {
        id: 1,
        title: "Nebula Dashboard",
        category: "Data Visualization",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Quantum E-Commerce",
        category: "Web Application",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Stellar Portfolio",
        category: "Creative Design",
        image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Void Chat",
        category: "Real-time Communication",
        image: "https://images.unsplash.com/photo-1614728853913-1e22ba234666?q=80&w=2070&auto=format&fit=crop"
    }
];

const Projects = () => {
    const [hoveredProject, setHoveredProject] = useState(null);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.h2
                    className={styles.heading}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Selected Works
                </motion.h2>

                <div className={styles.projectList}>
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            className={styles.projectItem}
                            onMouseEnter={() => setHoveredProject(project.id)}
                            onMouseLeave={() => setHoveredProject(null)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: project.id * 0.1 }}
                        >
                            <div className={styles.projectInfo}>
                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                <span className={styles.projectCategory}>{project.category}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
