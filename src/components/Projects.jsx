import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Projects.module.css';

import { content } from '../data/content';

const Projects = () => {
    const [hoveredProject, setHoveredProject] = useState(null);
    const { projects } = content;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.h2
                    className={styles.heading}
                >
                    {projects.heading}
                </motion.h2>

                <div className={styles.projectList}>
                    {projects.list.map((project) => (
                        <Link to={project.path} key={project.id} style={{ textDecoration: 'none' }}>
                            <motion.div
                                className={styles.projectItem}
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                <div className={styles.projectInfo}>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <span className={styles.projectCategory}>{project.category}</span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
