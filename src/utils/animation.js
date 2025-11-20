export const APP_START_TIME = Date.now();

export const getAnimationDelay = () => {
    const elapsed = Date.now() - APP_START_TIME;
    return `-${elapsed}ms`;
};
