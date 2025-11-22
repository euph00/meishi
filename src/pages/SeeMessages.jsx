import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { content } from '../data/content';
import styles from './SeeMessages.module.css';

import { pageVariants } from '../utils/animation';

const SeeMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const checkHeight = () => {
            const section = document.getElementById('messages-section');
            if (section) {
                const hasOverflow = section.scrollHeight > window.innerHeight;
                setIsOverflowing(hasOverflow);
                document.body.style.overflow = hasOverflow ? 'unset' : 'hidden';
                document.documentElement.style.overflow = hasOverflow ? 'unset' : 'hidden';
            }
        };

        // Check initially and on resize
        checkHeight();
        window.addEventListener('resize', checkHeight);

        // Also check when messages change
        return () => {
            window.removeEventListener('resize', checkHeight);
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [messages]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    return (
        <motion.section
            id="messages-section"
            className={styles.section}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={!isOverflowing ? {
                height: '100vh',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                overflow: 'hidden'
            } : {}}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 100 }}
            >
                <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={20} /> {content.seeMessages.back}
                </Link>
            </motion.div>

            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ width: 24 }}></div> {/* Spacer to balance title since back button is gone */}
                    <h1 className={styles.title}>{content.seeMessages.title}</h1>
                    <div style={{ width: 24 }}></div>
                </header>

                {loading ? (
                    <div className={styles.loading}>{content.seeMessages.loading}</div>
                ) : messages.length === 0 ? (
                    <div className={styles.empty}>{content.seeMessages.empty}</div>
                ) : (
                    <div className={styles.grid}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                className={styles.card}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <p className={styles.messageText} style={{ color: msg.color || '#fff', textShadow: msg.color ? `0 0 10px ${msg.color}40` : 'none' }}>
                                    {msg.message}
                                </p>
                                <div className={styles.cardFooter}>
                                    <span className={styles.name} style={{ color: msg.color || 'rgba(255, 255, 255, 0.9)' }}>{msg.name}</span>
                                    <span className={styles.date}>{formatDate(msg.timestamp)}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default SeeMessages;
