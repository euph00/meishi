export const APP_START_TIME = Date.now();

export const getAnimationDelay = () => {
    const elapsed = Date.now() - APP_START_TIME;
    return `-${elapsed}ms`;
};
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: "blur(10px)"
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        filter: "blur(10px)",
        transition: {
            duration: 0.4,
            ease: "easeIn"
        }
    }
};
