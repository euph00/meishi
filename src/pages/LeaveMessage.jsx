import { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './LeaveMessage.module.css';

import { content } from '../data/content';

const LeaveMessage = () => {
    const [formState, setFormState] = useState({ name: '', message: '' });
    const [textColor, setTextColor] = useState('#ffffff');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const controls = useAnimation();

    const colors = [
        { id: 'white', value: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)' },
        { id: 'pink', value: '#ff74b8', glow: 'rgba(255, 116, 184, 0.8)' },
        { id: 'red', value: '#f34f6d', glow: 'rgba(243, 79, 109, 0.8)' },
        { id: 'blue', value: '#2681c8', glow: 'rgba(38, 129, 200, 0.8)' },
        { id: 'yellow', value: '#ffc30b', glow: 'rgba(255, 195, 11, 0.8)' },
        { id: 'green', value: '#0fbe94', glow: 'rgba(15, 190, 148, 0.8)' },
        { id: 'lightblue', value: '#8dbbff', glow: 'rgba(141, 187, 255, 0.8)' },
        { id: 'orange', value: '#f39800', glow: 'rgba(243, 152, 0, 0.8)' },
        { id: 'grey', value: '#656a75', glow: 'rgba(101, 106, 117, 0.8)' },
    ];

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formState.name) return;

        setIsSubmitting(true);

        // Supernova Effect on Button
        await controls.start({
            scale: 1.5,
            filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) brightness(2)",
            opacity: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        });

        // Simulate network request
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <section className={styles.section}>
            <AnimatePresence>
                {!isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 100 }}
                    >
                        <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={20} /> {content.leaveMessage.back}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.container}>
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            className={styles.card}
                            initial={{ opacity: 0, y: 50, rotateX: -10 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h1 className={styles.title}>{content.leaveMessage.title}</h1>

                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className={styles.input}
                                        placeholder=" "
                                        value={formState.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                        style={{ color: textColor }}
                                    />
                                    <label htmlFor="name" className={styles.label}>{content.leaveMessage.nameLabel}</label>
                                </div>

                                <div className={styles.inputGroup}>
                                    <textarea
                                        name="message"
                                        id="message"
                                        className={styles.textarea}
                                        placeholder=" "
                                        value={formState.message}
                                        onChange={handleChange}
                                        style={{ color: textColor }}
                                    />
                                    <label htmlFor="message" className={styles.label}>{content.leaveMessage.messageLabel}</label>
                                </div>

                                <div className={styles.colorPickerContainer}>
                                    <span className={styles.colorLabel}>{content.leaveMessage.colorLabel}</span>
                                    <div className={styles.colorPalette}>
                                        {colors.map((color) => (
                                            <motion.div
                                                key={color.id}
                                                className={`${styles.colorOption} ${textColor === color.value ? styles.active : ''}`}
                                                style={{ backgroundColor: color.value, '--glow-color': color.glow }}
                                                onClick={() => setTextColor(color.value)}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.buttonWrapper}>
                                    <motion.button
                                        type="submit"
                                        className={styles.button}
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={isSubmitting ? controls : { opacity: 1, scale: 1, filter: "none" }}
                                    >
                                        {isSubmitting ? content.leaveMessage.button.sending : content.leaveMessage.button.default}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            className={styles.card}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "backOut" }}
                        >
                            <div className={styles.successMessage}>

                                <h2 className={styles.successTitle}>{content.leaveMessage.success.title}</h2>
                                <p className={`${styles.successText} ${styles.shimmer}`}>
                                    {content.leaveMessage.success.messageLine1}<br />
                                    {content.leaveMessage.success.messageLine2}<br />
                                    {content.leaveMessage.success.messageLine3}
                                </p>
                                <Link to="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--accent-color)', textDecoration: 'none' }}>{content.leaveMessage.success.returnHome}</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default LeaveMessage;
