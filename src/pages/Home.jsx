import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';

const Home = () => {
    return (
        <>
            <Hero />
            <About />
            <Projects />
            <div style={{ height: '20vh' }}></div>
        </>
    );
};

export default Home;
