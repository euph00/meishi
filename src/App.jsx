import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import Scene from './components/Scene';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import SocialLinks from './components/SocialLinks';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import styles from './App.module.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Slightly longer to see the initial fade in

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className={styles.main}>
      <Cursor />
      <Scene />
      <AnimatePresence>
        {isLoading && <Loader key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <div className={styles.content}>
          <Hero />
          <About />
          <Projects />
          <div style={{ height: '20vh' }}></div>
        </div>
      )}
    </main>
  );
}

export default App;



