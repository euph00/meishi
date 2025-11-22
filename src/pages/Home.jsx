import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';

import { motion } from 'framer-motion';
import { pageVariants } from '../utils/animation';

const Home = () => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <Hero />
            <About />
            <Projects />
            <div style={{ height: '20vh' }}></div>
        </motion.div>
    );
};

export default Home;
