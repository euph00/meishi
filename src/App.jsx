import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import Scene from './components/Scene';
import Loader from './components/Loader';
import Home from './pages/Home';
import LeaveMessage from './pages/LeaveMessage';
import SeeMessages from './pages/SeeMessages';
import styles from './App.module.css';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

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
    }, 2500);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <main className={styles.main}>
        <Scene />
        <AnimatePresence mode="wait">
          {isLoading && <Loader key="loader" progress={100} />}
        </AnimatePresence>

        {!isLoading && (
          <div className={styles.content}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/leave-message" element={<LeaveMessage />} />
              <Route path="/messages" element={<SeeMessages />} />
            </Routes>
          </div>
        )}
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;



